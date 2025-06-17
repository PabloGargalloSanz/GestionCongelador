<?php
session_start();
require_once('../includes/database.php');

$usuario = $_POST['usuario'] ?? '';
$contrasena = $_POST['contrasena'] ?? '';

//evita inserciones
$stmt = $conn->prepare("SELECT * FROM usuarios WHERE usuario = ? AND contrasena = ?");
$stmt->bind_param("ss", $usuario, $contrasena);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
        
    header("Location: http://localhost/GestionCongelador/frontend/views/dashboard.php");
    exit;

} else {
    echo "Usuario o contraseña incorrectos.";
    
}

$stmt->close(); 
$conn->close();

