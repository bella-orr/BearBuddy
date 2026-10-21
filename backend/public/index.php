<?php
require __DIR__ . '/../src/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = '/' . trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

$id = null;
if (preg_match('#^/(accounts|schedule|events|obstacles)/([0-9]{1,10})$#', $path, $matches)) {
    $id = (int) $matches[2];
    if ($id < 1 || $id > 2147483647) sendError(404, 'Not found.');
    $path = "/$matches[1]/{id}"; }

switch ("$method $path") {
    case 'GET /': sendResponse(200, ['status' => 'ok', 'app' => 'BearBuddy API']); break;

    case 'POST /auth/register': register(); break;
    case 'POST /auth/login': login(); break;
    case 'POST /auth/logout': logout(); break;
    case 'GET /auth/me': getCurrentUser(); break;
    case 'PUT /auth/me': updateProfile(); break;
    case 'DELETE /auth/me': deleteAccount(); break;
    case 'POST /auth/change-password': changePassword(); break;

    case 'GET /accounts': getSavedAccounts(); break;
    case 'POST /accounts': addSavedAccount(); break;
    case 'GET /accounts/{id}': getSavedAccount($id); break;
    case 'PUT /accounts/{id}': updateSavedAccount($id); break;
    case 'DELETE /accounts/{id}': deleteSavedAccount($id); break;

    case 'GET /schedule': getClasses(); break;
    case 'GET /schedule/conflicts': getClassConflicts(); break;
    case 'POST /schedule': addClass(); break;
    case 'PUT /schedule/{id}': updateClass($id); break;
    case 'DELETE /schedule/{id}': deleteClass($id); break;

    case 'GET /events': getEvents(); break;
    case 'POST /events': addEvent(); break;
    case 'PUT /events/{id}': updateEvent($id); break;
    case 'DELETE /events/{id}': deleteEvent($id); break;

    case 'GET /locations': getLocations(); break;

    case 'GET /obstacles': getObstacles(); break;
    case 'POST /obstacles': addObstacle(); break;
    case 'PATCH /obstacles/{id}': updateObstacleStatus($id); break;

    default: sendError(404, 'Not found.');}