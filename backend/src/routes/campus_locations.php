<?php
function getLocations() {
    requireLogin();
    $search = trim($_GET['search'] ?? '');

    if ($search == '') {
        $locations = runQuery('SELECT location_id, name, building, latitude, longitude FROM dbo.campus_location ORDER BY name')->fetchAll();
    } else {
        $locations = runQuery('SELECT TOP 50 location_id, name, building, latitude, longitude FROM dbo.campus_location
                               WHERE name LIKE ? OR building LIKE ? ORDER BY name', ["%$search%", "%$search%"])->fetchAll(); }
    sendResponse(200, ['locations' => $locations]); }
