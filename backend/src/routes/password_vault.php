<?php
// encrypted_password is VARBINARY. It is read and written as hex text with CONVERT(..., 2).
function getAccountsForUser($userId, $accountId = null) {
    $sql = 'SELECT saved_account_id, website_name, website_url, username,
                   CONVERT(VARCHAR(MAX), encrypted_password, 2) AS encrypted_password
            FROM dbo.saved_account WHERE user_id = ?';
    $params = [$userId];
    if ($accountId) {
        $sql .= ' AND saved_account_id = ?';
        $params[] = $accountId; }
    return runQuery($sql . ' ORDER BY website_name', $params)->fetchAll();}

function findSavedAccount($userId, $accountId) {
    $account = getAccountsForUser($userId, $accountId)[0] ?? null;
    if (!$account) sendError(404, 'Saved account not found.');
    return $account;}

function getAccountFromRequest($data) {
    $account = [trim($data['website_name'] ?? ''), trim($data['website_url'] ?? '') ?: null, trim($data['username'] ?? '')];
    if ($account[0] == '' || $account[2] == '') sendError(400, 'Enter the website name and username.');
    return $account;}

function getSavedAccounts() {
    $userId = requireLogin();
    $accounts = getAccountsForUser($userId);
    foreach ($accounts as $i => $account) unset($accounts[$i]['encrypted_password']);
    sendResponse(200, ['accounts' => $accounts]);}

function getSavedAccount($accountId) {
    $userId = requireLogin();
    $account = findSavedAccount($userId, $accountId);
    $account['password'] = decryptPassword($account['encrypted_password']);
    unset($account['encrypted_password']);
    sendResponse(200, ['account' => $account]);}

function addSavedAccount() {
    $userId = requireLogin();
    $data = getRequestData();
    $account = getAccountFromRequest($data);
    $password = $data['password'] ?? '';
    if ($password == '') sendError(400, 'Enter the password.');

    $check = checkPasswordBeforeSaving($userId, $password);
    runQuery('INSERT INTO dbo.saved_account (user_id, website_name, website_url, username, encrypted_password)
              VALUES (?, ?, ?, ?, CONVERT(VARBINARY(MAX), CAST(? AS VARCHAR(MAX)), 2))',
        array_merge([$userId], $account, [encryptPassword($password)]));
    sendResponse(201, ['saved_account_id' => getNewId()] + $check);}

function updateSavedAccount($accountId) {
    $userId = requireLogin();
    findSavedAccount($userId, $accountId);
    $data = getRequestData();
    $account = getAccountFromRequest($data);
    $password = $data['password'] ?? '';
    $check = [];

    if ($password != '') {
        $check = checkPasswordBeforeSaving($userId, $password, $accountId);
        runQuery('UPDATE dbo.saved_account SET encrypted_password = CONVERT(VARBINARY(MAX), CAST(? AS VARCHAR(MAX)), 2)
                  WHERE saved_account_id = ? AND user_id = ?', [encryptPassword($password), $accountId, $userId]); }

    runQuery('UPDATE dbo.saved_account SET website_name = ?, website_url = ?, username = ? WHERE saved_account_id = ? AND user_id = ?',
        array_merge($account, [$accountId, $userId]));
    sendResponse(200, ['updated' => true] + $check);}

function deleteSavedAccount($accountId) {
    $userId = requireLogin();
    findSavedAccount($userId, $accountId);
    runQuery('DELETE FROM dbo.saved_account WHERE saved_account_id = ? AND user_id = ?', [$accountId, $userId]);
    sendResponse(200, ['deleted' => true]); }
