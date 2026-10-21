<?php
function findUser($userId) {
    return runQuery('SELECT user_id, email, first_name, last_name, display_name FROM dbo.users WHERE user_id = ?', [$userId])->fetch(); }

function isCorrectPassword($userId, $password) {
    $user = runQuery('SELECT password_hash FROM dbo.users WHERE user_id = ?', [$userId])->fetch();
    return $user && password_verify($password, $user['password_hash']); }

function startUserSession($userId) {
    session_regenerate_id(true);
    $_SESSION = ['user_id' => $userId]; }

function register() {
    $data = getRequestData();
    $email = strtolower(trim($data['email'] ?? ''));
    $password = $data['password'] ?? '';
    $firstName = trim($data['first_name'] ?? '');
    $lastName = trim($data['last_name'] ?? '');
    $displayName = trim($data['display_name'] ?? '');

    if ($firstName == '' || $lastName == '' || $displayName == '') sendError(400, 'Enter your first name, last name and display name.');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) sendError(400, 'Enter a valid email address.');

    $passwordError = checkLoginPassword($password);
    if ($passwordError) sendError(400, $passwordError);

    if (runQuery('SELECT user_id FROM dbo.users WHERE email = ?', [$email])->fetch()) {
        sendError(409, 'An account with that email already exists.'); }

    runQuery('INSERT INTO dbo.users (email, password_hash, first_name, last_name, display_name) VALUES (?, ?, ?, ?, ?)',
        [$email, password_hash($password, HASH_TYPE), $firstName, $lastName, $displayName]);
    $userId = getNewId();

    startUserSession($userId);
    sendResponse(201, ['user' => findUser($userId)]); }

function login() {
    $data = getRequestData();
    $email = strtolower(trim($data['email'] ?? ''));
    $password = $data['password'] ?? '';
    if ($email == '' || $password == '') sendError(400, 'Enter your email and password.');
    checkLockout();
    $user = runQuery('SELECT user_id, password_hash FROM dbo.users WHERE email = ?', [$email])->fetch();
    
    if (!$user || !password_verify($password, $user['password_hash'])) {
        addFailedAttempt();
        sendError(401, 'Email or password is incorrect.'); }

    startUserSession($user['user_id']);
    sendResponse(200, ['user' => findUser($user['user_id'])]); }

function logout() {
    $_SESSION = [];
    session_destroy();
    setcookie(session_name(), '', time() - 3600, '/');
    sendResponse(200, ['signed_out' => true]); }

function getCurrentUser() {
    $user = findUser(requireLogin());
    if (!$user) {
        $_SESSION = [];
        sendError(401, 'Please sign in.'); }

    sendResponse(200, ['user' => $user]); }

function updateProfile() {
    $userId = requireLogin();
    $data = getRequestData();
    $firstName = trim($data['first_name'] ?? '');
    $lastName = trim($data['last_name'] ?? '');
    $displayName = trim($data['display_name'] ?? '');
    if ($firstName == '' || $lastName == '' || $displayName == '') sendError(400, 'Enter your first name, last name and display name.');

    runQuery('UPDATE dbo.users SET first_name = ?, last_name = ?, display_name = ? WHERE user_id = ?', [$firstName, $lastName, $displayName, $userId]);

    sendResponse(200, ['user' => findUser($userId)]); }

function changePassword() {
    $userId = requireLogin();
    $data = getRequestData();
    $currentPassword = $data['current_password'] ?? '';
    $newPassword = $data['new_password'] ?? '';

    if (!isCorrectPassword($userId, $currentPassword)) sendError(401, 'Current password is incorrect.');
    $passwordError = checkLoginPassword($newPassword);

    if ($passwordError) sendError(400, $passwordError);

    runQuery('UPDATE dbo.users SET password_hash = ? WHERE user_id = ?', [password_hash($newPassword, HASH_TYPE), $userId]);
    startUserSession($userId);
    sendResponse(200, ['password_changed' => true]);}

function deleteAccount() {
    $userId = requireLogin();
    $data = getRequestData();
    if (!isCorrectPassword($userId, $data['password'] ?? '')) sendError(401, 'Password is incorrect.');

    $conn = getConnection();
    $conn->beginTransaction();
    try {
        foreach (['saved_account', 'class_schedule', 'personal_event', 'obstacle_report', 'users'] as $table) {
            runQuery("DELETE FROM dbo.$table WHERE user_id = ?", [$userId]);}
        $conn->commit();
    } catch (Exception $e) {
        $conn->rollBack();
        throw $e; }

    $_SESSION = [];
    session_destroy();
    sendResponse(200, ['deleted' => true]); }
