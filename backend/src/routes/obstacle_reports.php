<?php
function getObstacleRows($userId, $where, $params = []) {
    $sql = 'SELECT r.report_id, r.location_id, l.name AS location_name, l.latitude, l.longitude,
                   r.obstacle_type, r.description,
                   CONVERT(VARCHAR(19), r.reported_at, 120) AS reported_at,
                   CONVERT(VARCHAR(19), r.expired_at, 120) AS expired_at,
                   r.status, CASE WHEN r.user_id = ? THEN 1 ELSE 0 END AS is_mine
            FROM dbo.obstacle_report r
            JOIN dbo.campus_location l ON l.location_id = r.location_id
            WHERE ' . $where . ' ORDER BY r.reported_at DESC';
    return runQuery($sql, array_merge([$userId], $params))->fetchAll(); }

function findMyObstacle($userId, $reportId) {
    $report = getObstacleRows($userId, 'r.report_id = ? AND r.user_id = ?', [$reportId, $userId])[0] ?? null;
    if (!$report) sendError(404, 'Report not found.');
    return $report; }

function getObstacles() {
    $userId = requireLogin();
    $where = "r.status = 'active' AND (r.expired_at IS NULL OR r.expired_at > SYSDATETIME())";
    sendResponse(200, ['obstacles' => getObstacleRows($userId, $where)]);}

function addObstacle() {
    $userId = requireLogin();
    $data = getRequestData();
    $locationId = (int) ($data['location_id'] ?? 0);
    $obstacleType = trim($data['obstacle_type'] ?? '');
    $description = trim($data['description'] ?? '') ?: null;

    if ($obstacleType == '') sendError(400, 'Enter the obstacle type.');

    if (!runQuery('SELECT location_id FROM dbo.campus_location WHERE location_id = ?', [$locationId])->fetch()) {
        sendError(400, 'That location does not exist.'); }

    runQuery("INSERT INTO dbo.obstacle_report (user_id, location_id, obstacle_type, description, expired_at, status)
              VALUES (?, ?, ?, ?, DATEADD(HOUR, 72, SYSDATETIME()), 'active')",
        [$userId, $locationId, $obstacleType, $description]);
    sendResponse(201, ['obstacle' => findMyObstacle($userId, getNewId())]); }

function updateObstacleStatus($reportId) {
    $userId = requireLogin();
    findMyObstacle($userId, $reportId);
    runQuery("UPDATE dbo.obstacle_report SET status = 'resolved' WHERE report_id = ? AND user_id = ?", [$reportId, $userId]);
    sendResponse(200, ['obstacle' => findMyObstacle($userId, $reportId)]); }
