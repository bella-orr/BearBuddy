<?php
function getClassRows($userId, $classId = null) {
    $sql = 'SELECT schedule_id, course_name, building, room, meeting_days,
                   CONVERT(VARCHAR(5), start_time, 108) AS start_time,
                   CONVERT(VARCHAR(5), end_time, 108) AS end_time
            FROM dbo.class_schedule WHERE user_id = ?';
    $params = [$userId];
    if ($classId) {
        $sql .= ' AND schedule_id = ?';
        $params[] = $classId;}
    return runQuery($sql . ' ORDER BY start_time, course_name', $params)->fetchAll();}

function findClass($userId, $classId) {
    $class = getClassRows($userId, $classId)[0] ?? null;
    if (!$class) sendError(404, 'Class not found.');
    return $class;}

function getClassFromRequest() {
    $data = getRequestData();
    $class = [trim($data['course_name'] ?? ''), trim($data['building'] ?? '') ?: null, trim($data['room'] ?? '') ?: null, trim($data['meeting_days'] ?? '') ?: null,
        getTime($data, 'start_time'),
        getTime($data, 'end_time'),];

    if ($class[0] == '') sendError(400, 'Enter the course name.');
    if ($class[3] && !preg_match('/^[MTWRFSU]+$/', $class[3])) sendError(400, 'meeting_days must use the letters M T W R F S U, like "MWF".');
    if ($class[4] && $class[5] && $class[5] <= $class[4]) sendError(400, 'end_time must be after start_time.');
    return $class;}

function getClasses() {
    sendResponse(200, ['classes' => getClassRows(requireLogin())]);}

function addClass() {
    $userId = requireLogin();
    $class = getClassFromRequest();
    runQuery('INSERT INTO dbo.class_schedule (user_id, course_name, building, room, meeting_days, start_time, end_time)
              VALUES (?, ?, ?, ?, ?, ?, ?)', array_merge([$userId], $class));
    sendResponse(201, ['class' => findClass($userId, getNewId())]); }

function updateClass($classId) {
    $userId = requireLogin();
    findClass($userId, $classId);
    $class = getClassFromRequest();
    runQuery('UPDATE dbo.class_schedule
              SET course_name = ?, building = ?, room = ?, meeting_days = ?, start_time = ?, end_time = ?
              WHERE schedule_id = ? AND user_id = ?', array_merge($class, [$classId, $userId]));
    sendResponse(200, ['class' => findClass($userId, $classId)]); }

function deleteClass($classId) {
    $userId = requireLogin();
    findClass($userId, $classId);
    runQuery('DELETE FROM dbo.class_schedule WHERE schedule_id = ? AND user_id = ?', [$classId, $userId]);
    sendResponse(200, ['deleted' => true]); }

function getClassConflicts() {
    $classes = getClassRows(requireLogin());
    $conflicts = [];
    foreach ($classes as $i => $a) {
        foreach (array_slice($classes, $i + 1) as $b) {
            $sameDays = array_intersect(str_split($a['meeting_days'] ?? ''), str_split($b['meeting_days'] ?? ''));
            if ($sameDays && $a['start_time'] && $b['start_time'] && $a['start_time'] < $b['end_time'] && $b['start_time'] < $a['end_time']) {
                $conflicts[] = ['days' => implode('', $sameDays), 'classes' => [$a, $b]]; } } }
    sendResponse(200, ['conflicts' => $conflicts]);}

function getTime($data, $field) {
    $time = trim($data[$field] ?? '') ?: null;
    if ($time && !preg_match('/^([01][0-9]|2[0-3]):[0-5][0-9]$/', $time)) sendError(400, "$field must be a time like 09:30.");
    return $time; }