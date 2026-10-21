<?php
function getEventRows($userId, $eventId = null) {
    $sql = 'SELECT event_id, title, description, type,
                   CONVERT(VARCHAR(19), start_time, 120) AS start_time,
                   CONVERT(VARCHAR(19), end_time, 120) AS end_time, location
            FROM dbo.personal_event WHERE user_id = ?';
    $params = [$userId];

    if ($eventId) {
        $sql .= ' AND event_id = ?';
        $params[] = $eventId;}
    return runQuery($sql . ' ORDER BY start_time', $params)->fetchAll();}

function findEvent($userId, $eventId) {
    $event = getEventRows($userId, $eventId)[0] ?? null;
    if (!$event) sendError(404, 'Event not found.');
    return $event; }

function getEventFromRequest() {
    $data = getRequestData();
    $event = [ trim($data['title'] ?? ''), trim($data['description'] ?? '') ?: null, trim($data['type'] ?? '') ?: null,
        getDateTime($data, 'start_time'),
        getDateTime($data, 'end_time'),
        trim($data['location'] ?? '') ?: null, ];
    if ($event[0] == '') sendError(400, 'Enter the event title.');
    if ($event[4] <= $event[3]) sendError(400, 'end_time must be after start_time.');
    return $event;}

function getEvents() {
    sendResponse(200, ['events' => getEventRows(requireLogin())]);}

function addEvent() {
    $userId = requireLogin();
    $event = getEventFromRequest();
    runQuery('INSERT INTO dbo.personal_event (user_id, title, description, type, start_time, end_time, location)
              VALUES (?, ?, ?, ?, ?, ?, ?)', array_merge([$userId], $event));
    sendResponse(201, ['event' => findEvent($userId, getNewId())]);}

function updateEvent($eventId) {
    $userId = requireLogin();
    findEvent($userId, $eventId);
    $event = getEventFromRequest();
    runQuery('UPDATE dbo.personal_event
              SET title = ?, description = ?, type = ?, start_time = ?, end_time = ?, location = ?
              WHERE event_id = ? AND user_id = ?', array_merge($event, [$eventId, $userId]));
    sendResponse(200, ['event' => findEvent($userId, $eventId)]);}

function deleteEvent($eventId) {
    $userId = requireLogin();
    findEvent($userId, $eventId);
    runQuery('DELETE FROM dbo.personal_event WHERE event_id = ? AND user_id = ?', [$eventId, $userId]);
    sendResponse(200, ['deleted' => true]);}

function getDateTime($data, $field) {
    $timestamp = strtotime(trim($data[$field] ?? ''));
    if (!$timestamp) sendError(400, "$field must be a date and time like 2026-10-20 14:00.");
    return date('Y-m-d H:i:s', $timestamp);}