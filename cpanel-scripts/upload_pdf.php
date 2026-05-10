<?php
// =============================================================
// upload_pdf.php — Little Beginnings cPanel PDF Upload Handler
// Upload this file to: /uploads/upload_pdf.php on your cPanel host
// =============================================================

// ── CORS Headers ──────────────────────────────────────────────
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
$upload_dir  = __DIR__ . '/pdfs/';
$public_base = 'https://www.little-beginnings.org/uploads/pdfs/';
$max_size_mb = 20;
$max_size_b  = $max_size_mb * 1024 * 1024;

// ── Validate request ───────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
    exit();
}

if (!isset($_FILES['pdf']) || $_FILES['pdf']['error'] !== UPLOAD_ERR_OK) {
    $upload_errors = [
        UPLOAD_ERR_INI_SIZE   => 'File exceeds server upload limit.',
        UPLOAD_ERR_FORM_SIZE  => 'File exceeds form size limit.',
        UPLOAD_ERR_PARTIAL    => 'File was only partially uploaded.',
        UPLOAD_ERR_NO_FILE    => 'No file was uploaded.',
        UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder.',
        UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk.',
        UPLOAD_ERR_EXTENSION  => 'Upload blocked by server extension.',
    ];
    $err_code = $_FILES['pdf']['error'] ?? UPLOAD_ERR_NO_FILE;
    http_response_code(400);
    echo json_encode(['error' => $upload_errors[$err_code] ?? 'Upload error.']);
    exit();
}

$file      = $_FILES['pdf'];
$mime_type = mime_content_type($file['tmp_name']);

// Validate PDF MIME type
if ($mime_type !== 'application/pdf') {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid file type. Only PDF files are allowed.']);
    exit();
}

// Validate file size
if ($file['size'] > $max_size_b) {
    http_response_code(400);
    echo json_encode(['error' => "File too large. Maximum size is {$max_size_mb} MB."]);
    exit();
}

// ── Save file ──────────────────────────────────────────────────
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

$original_name = pathinfo($file['name'], PATHINFO_FILENAME);
$safe_name     = preg_replace('/[^a-zA-Z0-9_-]/', '_', $original_name);
$unique_name   = time() . '_' . $safe_name . '.pdf';
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
