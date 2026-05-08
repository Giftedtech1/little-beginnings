<?php
// ============================================================
// Little Beginnings — Video Upload Endpoint
// ============================================================
// SETUP INSTRUCTIONS:
//   1. Upload this file to your cPanel, e.g.:
//      /public_html/uploads/upload_video.php
//   2. Create the destination folder:
//      /public_html/uploads/videos/
//   3. Make sure the videos/ folder is writable (chmod 755)
//   4. Update ALLOWED_ORIGINS below with your actual domains
// ============================================================

// ── Config ───────────────────────────────────────────────────
define('UPLOAD_DIR',  __DIR__ . '/videos/');
define('UPLOAD_URL',  'https://www.little-beginnings.org/uploads/videos/');
define('MAX_SIZE_MB', 25);
define('MAX_SIZE_B',  MAX_SIZE_MB * 1024 * 1024);

$ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://www.little-beginnings.org',
];

$ALLOWED_TYPES = [
    'video/mp4',
    'video/quicktime',
    'video/webm',
    'video/x-msvideo',
    'video/mpeg',
];

// ── CORS ─────────────────────────────────────────────────────
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $ALLOWED_ORIGINS)) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle pre-flight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── Only accept POST ──────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// ── Validate file present ─────────────────────────────────────
if (!isset($_FILES['video']) || $_FILES['video']['error'] !== UPLOAD_ERR_OK) {
    $code = $_FILES['video']['error'] ?? -1;
    http_response_code(400);
    echo json_encode(['error' => "No valid file received (code $code)"]);
    exit;
}

$file = $_FILES['video'];

// ── Validate size ─────────────────────────────────────────────
if ($file['size'] > MAX_SIZE_B) {
    http_response_code(413);
    echo json_encode(['error' => 'File exceeds ' . MAX_SIZE_MB . ' MB limit']);
    exit;
}

// ── Validate MIME type ────────────────────────────────────────
$finfo    = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mimeType, $ALLOWED_TYPES)) {
    http_response_code(415);
    echo json_encode(['error' => 'Invalid file type. Only MP4, MOV, WebM, AVI allowed.']);
    exit;
}

// ── Generate unique filename ──────────────────────────────────
$ext      = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$safeName = preg_replace('/[^a-zA-Z0-9._-]/', '_', pathinfo($file['name'], PATHINFO_FILENAME));
$safeName = substr($safeName, 0, 60);
$fileName = date('Ymd_His') . '_' . $safeName . '.' . $ext;
$destPath = UPLOAD_DIR . $fileName;

// ── Ensure upload directory exists ────────────────────────────
if (!is_dir(UPLOAD_DIR)) {
    if (!mkdir(UPLOAD_DIR, 0755, true)) {
        http_response_code(500);
        echo json_encode(['error' => 'Could not create upload directory']);
        exit;
    }
}

// ── Move file ─────────────────────────────────────────────────
if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save file']);
    exit;
}

// ── Return public URL ─────────────────────────────────────────
echo json_encode([
    'url'       => UPLOAD_URL . $fileName,
    'file_name' => $fileName,
    'size'      => $file['size'],
]);
