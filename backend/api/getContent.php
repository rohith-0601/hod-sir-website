<?php
// -------------------- CORS HEADERS --------------------
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight request
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  exit;
}

// -------------------- CONFIG --------------------
$PASSWORD = "admin123";
$CONTENT_FILE = __DIR__ . "/content.json";

// -------------------- GET (READ CONTENT) --------------------
if ($_SERVER["REQUEST_METHOD"] === "GET") {

  // Admin-only protection
  if (isset($_GET["admin"])) {
    if (
      !isset($_GET["password"]) ||
      $_GET["password"] !== $PASSWORD
    ) {
      echo json_encode(["error" => "Unauthorized"]);
      exit;
    }
  }

  echo file_get_contents($CONTENT_FILE);
  exit;
}

// -------------------- POST (UPDATE CONTENT) --------------------
if ($_SERVER["REQUEST_METHOD"] === "POST") {

  $data = json_decode(file_get_contents("php://input"), true);

  if (
    !isset($data["password"]) ||
    $data["password"] !== $PASSWORD
  ) {
    http_response_code(403);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
  }

  // Remove sensitive fields before saving
  unset($data["password"]);
  unset($data["action"]);

  file_put_contents(
    $CONTENT_FILE,
    json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
  );

  echo json_encode(["success" => true]);
  exit;
}

// -------------------- FALLBACK --------------------
http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
