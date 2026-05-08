<?php
/**
 * PDF Upload Endpoint for Little Beginnings
 * Needs to be placed in public_html/uploads/upload_pdf.php
 * Create the directory public_html/uploads/pdfs/ and give it 755 permissions.
 */

// Configuration
define('UPLOAD_DIR', __DIR__ . '/pdfs/');
define('UPLOAD_URL', 'https://www.little-beginnings.org/uploads/pdfs/');
define('MAX_SIZE_MB', 20); // 20 MB max for PDFs
define('MAX_SIZE_B', MAX_SIZE_MB * 1024 * 1024);

// CORS Configuration
$ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://www.little-beginnings.org',
    'https://little-beginnings.org'
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $ALLOWED_ORIGINS)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Response helper
function sendResponse($status, $data) {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit();
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(405, ['error' => 'Method not allowed. Use POST.']);
}

// Check if file is uploaded
if (!isset($_FILES['pdf']) || $_FILES['pdf']['error'] !== UPLOAD_ERR_OK) {
    sendResponse(400, ['error' => 'No file uploaded or upload error occurred. Code: ' . (isset($_FILES['pdf']) ? $_FILES['pdf']['error'] : 'missing')]);
}

$file = $_FILES['pdf'];

// Validate file size
if ($file['size'] > MAX_SIZE_B) {
    sendResponse(400, ['error' => 'File exceeds maximum allowed size of ' . MAX_SIZE_MB . 'MB.']);
}

// Validate MIME type (must be PDF)
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if ($mimeType !== 'application/pdf') {
    sendResponse(400, ['error' => 'Invalid file type. Only PDF files are allowed.']);
}

// Ensure upload directory exists
if (!is_dir(UPLOAD_DIR)) {
    if (!mkdir(UPLOAD_DIR, 0755, true)) {
        sendResponse(500, ['error' => 'Failed to create upload directory.']);
    }
}

// Generate unique, safe filename
$ext = '.pdf';
$safeName = preg_replace('/[^a-zA-Z0-9_-]/', '_', basename($file['name'], $ext));
$uniqueName = time() . '_' . uniqid() . '_' . $safeName . $ext;
$targetPath = UPLOAD_DIR . $uniqueName;

// Move file
if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    chmod($targetPath, 0644); // readable by web server
    sendResponse(200, [
        'success' => true,
        'message' => 'PDF uploaded successfully',
        'url' => UPLOAD_URL . $uniqueName,
        'file_name' => $file['name'],
        'size' => $file['size']
    ]);
} else {
    sendResponse(500, ['error' => 'Failed to save the uploaded file to disk.']);
}
