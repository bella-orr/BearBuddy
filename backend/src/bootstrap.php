<?php
ini_set('display_errors', '0');
ini_set('log_errors', '1');
ini_set('zend.exception_ignore_args', '1');
error_reporting(E_ALL);

foreach (['database', 'security'] as $file) require __DIR__ . "/$file.php";
foreach (['login', 'password_vault', 'class_schedule', 'personal_events', 'campus_locations', 'obstacle_reports'] as $file) {
    require __DIR__ . "/routes/$file.php"; }

function sendResponse($status, $data) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit; }

function sendError($status, $message) {
    sendResponse($status, ['error' => $message]); }

function handleError($error) {
    error_log('[BearBuddy] ' . $error->getMessage() . ' in ' . $error->getFile() . ' line ' . $error->getLine());
    if ($error instanceof PDOException && $error->getCode() == '23000') sendError(409, 'That conflicts with data that already exists.');
    sendError(500, 'Something went wrong on the server.'); }

set_exception_handler('handleError');

function getRequestData() {
    if (strpos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) {
        sendError(415, 'Send the request body as JSON (Content-Type: application/json).'); }

    $body = file_get_contents('php://input');
    if (strlen($body) > 65536) sendError(413, 'Request body is too large.');

    $data = json_decode($body, true);
    if (!is_array($data)) sendError(400, 'Request body must be a JSON object.');
    return $data; }

function requireLogin() {
    if (empty($_SESSION['user_id'])) sendError(401, 'Please sign in.');
    return $_SESSION['user_id']; }

session_name('bearbuddy_session');
session_set_cookie_params(['path' => '/', 'httponly' => true, 'secure' => getSetting('COOKIE_SECURE') == 'true', 'samesite' => 'Lax']);
ini_set('session.use_strict_mode', '1');
session_start();
