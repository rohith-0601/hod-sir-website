<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$PASSWORD = "admin123";

if (!isset($_POST["password"]) || $_POST["password"] !== $PASSWORD) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

if (!isset($_FILES["image"]) || !isset($_POST["category"])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing image or category"]);
    exit;
}

$category = $_POST["category"];
$allowed = ["professional", "hobbies", "life"];

if (!in_array($category, $allowed)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid category"]);
    exit;
}

/* ---------- CREATE UPLOAD FOLDER ---------- */

$uploadDir = __DIR__ . "/../uploads/gallery/";

if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

/* ---------- SAVE IMAGE ---------- */

$ext = pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION);
$filename = uniqid() . "." . $ext;

$target = $uploadDir . $filename;

if (!move_uploaded_file($_FILES["image"]["tmp_name"], $target)) {
    http_response_code(500);
    echo json_encode(["error" => "Upload failed"]);
    exit;
}

/* ---------- UPDATE JSON ---------- */

$contentPath = __DIR__ . "/content.json";
$content = json_decode(file_get_contents($contentPath), true);

$content["gallery"][$category][] = "/uploads/gallery/" . $filename;

file_put_contents(
    $contentPath,
    json_encode($content, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
);

/* ---------- RESPONSE ---------- */

echo json_encode([
    "success" => true,
    "path" => "/uploads/gallery/" . $filename
]);
