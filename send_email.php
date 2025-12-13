<?php
// ====================================
// Fichier d'envoi d'email pour le portfolio
// ====================================

// Configuration CORS et headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Vérifier que c'est bien une requête POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
    exit;
}

// ====================================
// CONFIGURATION - À PERSONNALISER
// ====================================
$destinataire = 'thylia.brouillard@gmail.com'; // TON EMAIL ICI
$sujet_prefix = '[Portfolio] '; // Préfixe pour le sujet

// ====================================
// Récupération et validation des données
// ====================================
$nom = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validation
$erreurs = [];

if (empty($nom)) {
    $erreurs[] = 'Le nom est requis';
}

if (empty($email)) {
    $erreurs[] = 'L\'email est requis';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $erreurs[] = 'L\'email n\'est pas valide';
}

if (empty($message)) {
    $erreurs[] = 'Le message est requis';
} elseif (strlen($message) < 10) {
    $erreurs[] = 'Le message doit contenir au moins 10 caractères';
}

// Si erreurs, retourner les erreurs
if (!empty($erreurs)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => implode(', ', $erreurs),
        'errors' => $erreurs
    ]);
    exit;
}

// ====================================
// Protection anti-spam simple
// ====================================
// Vérifier le délai entre les soumissions (honeypot temporel)
session_start();
$temps_actuel = time();
$delai_minimum = 3; // secondes

if (isset($_SESSION['derniere_soumission'])) {
    $temps_ecoule = $temps_actuel - $_SESSION['derniere_soumission'];
    if ($temps_ecoule < $delai_minimum) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'message' => 'Veuillez patienter quelques secondes avant de renvoyer un message'
        ]);
        exit;
    }
}

$_SESSION['derniere_soumission'] = $temps_actuel;

// ====================================
// Préparation de l'email
// ====================================
$sujet = $sujet_prefix . 'Nouveau message de ' . $nom;

// Nettoyer les données pour éviter l'injection d'en-têtes
$nom = str_replace(["\r", "\n", "%0a", "%0d"], '', $nom);
$email = str_replace(["\r", "\n", "%0a", "%0d"], '', $email);

// Corps de l'email en HTML
$corps_html = '
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #5B7C99, #7A9AB8);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
            border: 1px solid #ddd;
        }
        .info-row {
            margin: 15px 0;
            padding: 15px;
            background: white;
            border-radius: 5px;
            border-left: 4px solid #5B7C99;
        }
        .label {
            font-weight: bold;
            color: #5B7C99;
            display: block;
            margin-bottom: 5px;
        }
        .message-box {
            background: white;
            padding: 20px;
            border-radius: 5px;
            border: 1px solid #ddd;
            margin-top: 20px;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #5B7C99;
            color: #999;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📨 Nouveau message depuis votre portfolio</h1>
    </div>
    <div class="content">
        <div class="info-row">
            <span class="label">👤 Nom :</span>
            ' . htmlspecialchars($nom, ENT_QUOTES, 'UTF-8') . '
        </div>
        <div class="info-row">
            <span class="label">📧 Email :</span>
            <a href="mailto:' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '">' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '</a>
        </div>
        <div class="info-row">
            <span class="label">📅 Date :</span>
            ' . date('d/m/Y à H:i') . '
        </div>
        <div class="message-box">
            <span class="label">💬 Message :</span>
            ' . nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8')) . '
        </div>
    </div>
    <div class="footer">
        <p>Ce message a été envoyé depuis votre portfolio<br>
        <a href="mailto:' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '">Répondre à ' . htmlspecialchars($nom, ENT_QUOTES, 'UTF-8') . '</a></p>
    </div>
</body>
</html>
';

// Version texte brut (fallback)
$corps_texte = "
Nouveau message depuis votre portfolio
=====================================

Nom : $nom
Email : $email
Date : " . date('d/m/Y à H:i') . "

Message :
---------
$message

---
Pour répondre, envoyez un email à : $email
";

// En-têtes de l'email
$headers = [
    'From: Portfolio <noreply@portfolio.com>',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8'
];

// ====================================
// Envoi de l'email
// ====================================
$envoi_reussi = mail(
    $destinataire,
    $sujet,
    $corps_html,
    implode("\r\n", $headers)
);

// ====================================
// Réponse JSON
// ====================================
if ($envoi_reussi) {
    // Log de succès (optionnel)
    error_log("Email envoyé avec succès de $nom ($email)");
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Message envoyé avec succès !'
    ]);
} else {
    // Log d'erreur
    error_log("Échec de l'envoi d'email de $nom ($email)");
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de l\'envoi du message. Veuillez réessayer.'
    ]);
}
?>