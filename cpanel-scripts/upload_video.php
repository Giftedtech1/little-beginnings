<?php
// =============================================================
// upload_video.php — Little Beginnings cPanel Video Upload Handler
// Upload this file to: /uploads/upload_video.php on your cPanel host
// =============================================================

// ── CORS Headers ──────────────────────────────────────────────
// Allow requests from your Vercel app and local dev
$allowed_origins = [
    'https://little-beginnings.vercel.app',
    'https://www.little-beginnings.org',
    'http://localhost:5173',
    'http://localhost:3000',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: https://little-beginnings.vercel.app");
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ── Config ─────────────────────────────────────────────────────
$upload_dir  = __DIR__ . '/videos/';        // Physical path on server
$public_base = 'https://www.little-beginnings.org/uploads/videos/'; // Public URL
$max_size_mb = 100;                          // Max file size in MB
$max_size_b  = $max_size_mb * 1024 * 1024;

$allowed_types = [
    'video/mp4',
    'video/quicktime',   // .mov
    'video/x-msvideo',  // .avi
    'video/webm',
    'video/ogg',
    'video/3gpp',
];

// ── Validate request ───────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
    exit();
}

if (!isset($_FILES['video']) || $_FILES['video']['error'] !== UPLOAD_ERR_OK) {
    $upload_errors = [
        UPLOAD_ERR_INI_SIZE   => 'File exceeds server upload limit.',
        UPLOAD_ERR_FORM_SIZE  => 'File exceeds form size limit.',
        UPLOAD_ERR_PARTIAL    => 'File was only partially uploaded.',
        UPLOAD_ERR_NO_FILE    => 'No file was uploaded.',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder.',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk.',
        UPLOAD_ERR_EXTENSION  => 'Upload blocked by server extension.',
    ];
    $err_code = $_FILES['video']['error'] ?? UPLOAD_ERR_NO_FILE;
    http_response_code(400);
    echo json_encode(['error' => $upload_errors[$err_code] ?? 'Upload error.']);
    exit();
}

$file      = $_FILES['video'];
$mime_type = mime_content_type($file['tmp_name']);

// Validate MIME type
if (!in_array($mime_type, $allowed_types)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid file type. Only video files are allowed.']);
    exit();
}

// Validate file size
if ($file['size'] > $max_size_b) {
    http_response_code(400);
    echo json_encode(['error' => "File too large. Maximum size is {$max_size_mb} MB."]);
    exit();
}

// ── Save file ──────────────────────────────────────────────────
// Create directory if it doesn't exist
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Generate a unique safe filename
$original_name = pathinfo($file['name'], PATHINFO_FILENAME);
$extension     = pathinfo($file['name'], PATHINFO_EXTENSION);
$safe_name     = preg_replace('/[^a-zA-Z0-9_-]/', '_', $original_name);
$unique_name   = time() . '_' . $safe_name . '.' . $extension;
$dest_path     = $upload_dir . $unique_name;

if (!move_uploaded_file($file['tmp_name'], $dest_path)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save the uploaded file.']);
    exit();
}

// ── Return success ─────────────────────────────────────────────
$public_url = $public_base . $unique_name;

echo json_encode([
    'url'       => $public_url,
    'file_name' => $unique_name,
    'size'      => $file['size'],
]);
