<?php include_once(__DIR__ . '/../includes/header.php'); ?>

<h2>Iniciar sesión</h2>
<form action="/GestionCongelador/backend/actions/procesar_login.php" method="post">
    <label>Usuario: <input type="text" name="usuario"></label><br>
    <label>Contraseña: <input type="password" name="contrasena"></label><br>
    <input type="submit" value="Entrar">
</form>

<?php include_once(__DIR__ . '/../includes/footer.php'); ?>
