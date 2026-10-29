<?php
$config = [];
$envFile = __DIR__ . '/../.env';

if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES) as $line) {
        $line = trim($line);
        if ($line == '' || $line[0] == '#' || !str_contains($line, '=')) continue;
        [$name, $value] = explode('=', $line, 2);
        $config[trim($name)] = trim($value); } }

function getSetting($name, $default = null) {
    global $config;
    return empty($config[$name]) ? $default : $config[$name];}

function getConnection() {
    static $conn = null;
    if ($conn) return $conn;

    $dsn = 'sqlsrv:Server=' . getSetting('DB_SERVER', 'localhost,1433')
        . ';Database=' . getSetting('DB_NAME', 'BearBuddy')
        . ';Encrypt=' . getSetting('DB_ENCRYPT', 'yes')
        . ';TrustServerCertificate=' . getSetting('DB_TRUST_SERVER_CERTIFICATE', 'yes');

    $conn = new PDO($dsn, getSetting('DB_USER'), getSetting('DB_PASSWORD'));
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $conn->setAttribute(PDO::SQLSRV_ATTR_FETCHES_NUMERIC_TYPE, true);
    return $conn; }

function runQuery($sql, $params = []) {
    $stmt = getConnection()->prepare($sql);
    $stmt->execute($params);
    return $stmt;}
function getNewId() {
    return (int) getConnection()->lastInsertId(); }
