<?php
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(403);
    exit("Accès interdit");
}

// Récupération et validation des données
$name = trim($_POST["name"] ?? "");
$email = filter_var($_POST["email"] ?? "", FILTER_VALIDATE_EMAIL);
$message = trim($_POST["message"] ?? "");

if (!$name || !$email || !$message) {
    http_response_code(400);
    exit("Données manquantes");
}

// Paramètres du mail
$to = "thylia.brouillard@gmail.com";
$subject = "=?UTF-8?B?" . base64_encode("Nouveau message — Portfolio") . "?="; // encodage UTF-8
$from = "Portfolio <no-reply@thyliabrouillard.alwaysdata.net>"; // Alwaysdata domain
$headers = [];
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/plain; charset=UTF-8";
$headers[] = "From: $from";
$headers[] = "Reply-To: no-reply@thyliabrouillard.alwaysdata.net"; // Gmail n'aime pas Reply-To externe
$headers[] = "X-Mailer: PHP/" . phpversion();

// Corps du mail
$body = "Nom : $name\n";
$body .= "Email : $email\n\n";
$body .= "Message :\n$message";

// Envoi
if(mail($to, $subject, $body, implode("\r\n", $headers))) {
    echo "success";
} else {
    http_response_code(500);
    echo "Erreur lors de l'envoi";
}
?>
