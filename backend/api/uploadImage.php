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

// ✅ Check for PHP upload errors first
$uploadError = $_FILES["image"]["error"];
if ($uploadError !== UPLOAD_ERR_OK) {
    $phpErrors = [
        UPLOAD_ERR_INI_SIZE   => "File exceeds upload_max_filesize (" . ini_get("upload_max_filesize") . ")",
        UPLOAD_ERR_FORM_SIZE  => "File exceeds form MAX_FILE_SIZE",
        UPLOAD_ERR_PARTIAL    => "File was only partially uploaded",
        UPLOAD_ERR_NO_FILE    => "No file was uploaded",
        UPLOAD_ERR_NO_TMP_DIR => "Missing temp folder",
        UPLOAD_ERR_CANT_WRITE => "Failed to write to disk",
        UPLOAD_ERR_EXTENSION  => "Upload blocked by PHP extension",
    ];
    http_response_code(400);
    echo json_encode(["error" => $phpErrors[$uploadError] ?? "Unknown upload error: $uploadError"]);
    exit;
}

$category = $_POST["category"];
$caption = $_POST["caption"] ?? ""; // ✅ CAPTION SUPPORT
$allowed = ["professional", "hobbies", "life"];

if (!in_array($category, $allowed)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid category"]);
    exit;
}

$baseDir = realpath(__DIR__ . "/../") . "/uploads/";
$galleryDir = $baseDir . "gallery/";

if (!is_dir($galleryDir)) {
    if (!mkdir($galleryDir, 0777, true)) {
        http_response_code(500);
        echo json_encode(["error" => "Cannot create gallery directory"]);
        exit;
    }
}

if (!is_writable($galleryDir)) {
    http_response_code(500);
    echo json_encode(["error" => "Gallery directory is not writable"]);
    exit;
}

$ext = strtolower(pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION));
$allowedExts = ["jpg", "jpeg", "png", "gif", "webp"];
if (!in_array($ext, $allowedExts)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid file type: $ext"]);
    exit;
}

$filename = uniqid("img_", true) . "." . $ext;
$target = $galleryDir . $filename;

if (!move_uploaded_file($_FILES["image"]["tmp_name"], $target)) {
    http_response_code(500);
    // Return detailed debug info to help diagnose
    echo json_encode([
        "error" => "move_uploaded_file failed",
        "tmp_name" => $_FILES["image"]["tmp_name"],
        "tmp_exists" => file_exists($_FILES["image"]["tmp_name"]),
        "target" => $target,
        "gallery_dir_exists" => is_dir($galleryDir),
        "gallery_dir_writable" => is_writable($galleryDir),
    ]);
    exit;
}

// ✅ UPDATE JSON WITH {src, caption} STRUCTURE
$contentPath = __DIR__ . "/content.json";
$content = json_decode(file_get_contents($contentPath), true);

if (!isset($content["gallery"][$category])) {
    $content["gallery"][$category] = [];
}

$content["gallery"][$category][] = [
    "src" => "/uploads/gallery/" . $filename,
    "caption" => $caption
];

file_put_contents(
    $contentPath,
    json_encode($content, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
);

echo json_encode([
    "success" => true,
    "path" => "/uploads/gallery/" . $filename,
    "caption" => $caption
]);
?>
