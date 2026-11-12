<?php
define('MIN_PASSWORD_LENGTH', 10);
define('MAX_FAILED_ATTEMPTS', 3);
define('LOCKOUT_MINUTES', 15);
define('HASH_TYPE', defined('PASSWORD_ARGON2ID') ? PASSWORD_ARGON2ID : PASSWORD_DEFAULT);

function checkBreaches($password) {
    $hash = strtoupper(sha1($password));
    $options = ['http' => ['header' => "Add-Padding: true\r\nUser-Agent: BearBuddy-UC-capstone\r\n", 'timeout' => 5]];
    for ($try = 1; $try <= 3; $try++) {
        $response = file_get_contents('https://api.pwnedpasswords.com/range/' . substr($hash, 0, 5), false, stream_context_create($options));
        if ($response !== false) break; }
    if ($response === false) return null;

    foreach (explode("\n", $response) as $line) {
        $parts = explode(':', trim($line));
        if (count($parts) == 2 && $parts[0] == substr($hash, 5)) return (int) $parts[1];}
    return 0;}

function checkLoginPassword($password) {
    if (strlen($password) < MIN_PASSWORD_LENGTH) {
        return 'Use at least ' . MIN_PASSWORD_LENGTH . ' characters. A few random words works well.'; }
    if (!preg_match('/[0-9]/', $password) || !preg_match('/[^a-zA-Z0-9]/', $password)) {
        return 'Include at least one number and one symbol.'; }

    $breaches = checkBreaches($password);
    if ($breaches === null) return 'The breach check is not responding. Try again in a minute.';
    if ($breaches > 0) return "That password has appeared in $breaches known data breaches. Choose a different one.";
    return null; }

// Failed logins are saved in backend/storage files, not in the database.
function getAttemptsFile() {
    return __DIR__ . '/../storage/' . md5($_SERVER['REMOTE_ADDR']) . '.json'; }

function checkLockout() {
    $attempts = file_exists(getAttemptsFile()) ? json_decode(file_get_contents(getAttemptsFile()), true) : [];
    if (($attempts['failed_logins'] ?? 0) >= MAX_FAILED_ATTEMPTS && time() - $attempts['last_failed_login'] < LOCKOUT_MINUTES * 60) {
        sendError(429, 'Too many failed attempts. Wait ' . LOCKOUT_MINUTES . ' minutes and try again.'); }}

function addFailedAttempt() {
    $attempts = file_exists(getAttemptsFile()) ? json_decode(file_get_contents(getAttemptsFile()), true) : [];
    if (time() - ($attempts['last_failed_login'] ?? 0) >= LOCKOUT_MINUTES * 60) $attempts['failed_logins'] = 0;
    $attempts['failed_logins'] = ($attempts['failed_logins'] ?? 0) + 1;
    $attempts['last_failed_login'] = time();
    if (!is_dir(__DIR__ . '/../storage')) mkdir(__DIR__ . '/../storage');
    file_put_contents(getAttemptsFile(), json_encode($attempts)); }

function getEncryptionKey() {
    $key = base64_decode(getSetting('APP_ENCRYPTION_KEY', ''));
    if (strlen($key) != SODIUM_CRYPTO_SECRETBOX_KEYBYTES) {
        throw new Exception('Wrong key.'); }
    return $key;}

function encryptPassword($password) {
    $nonce = random_bytes(SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
    return bin2hex($nonce . sodium_crypto_secretbox($password, $nonce, getEncryptionKey()));}

function decryptPassword($hex) {
    $data = hex2bin($hex);
    $nonce = substr($data, 0, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES);
    $password = sodium_crypto_secretbox_open(substr($data, SODIUM_CRYPTO_SECRETBOX_NONCEBYTES), $nonce, getEncryptionKey());
    if ($password === false) throw new Exception('A saved password could not be decrypted.');
    return $password; }

// Reads dbo.saved_account for this student and decrypts each password to compare.
function isPasswordReused($userId, $password, $skipId = null) {
    foreach (getAccountsForUser($userId) as $account) {
        if ($account['saved_account_id'] != $skipId && decryptPassword($account['encrypted_password']) === $password) return true;}
    return false; }

function checkPasswordBeforeSaving($userId, $password, $skipId = null) {
    if (isPasswordReused($userId, $password, $skipId)) sendError(409, 'You already use this password for another account. Use a different password.');
    $breaches = checkBreaches($password);
    if ($breaches > 0) return ['warning' => "This password has appeared in $breaches known data breaches. Change it on this website."];
    return []; }
