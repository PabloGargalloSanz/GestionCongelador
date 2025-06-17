<?php
session_start();

// Verificar si el usuario ha iniciado sesión
if (!isset($_SESSION['usuario'])) {
    exit();
}


// Incluir cabecera
include_once(__DIR__ . '/../includes/header.php');
?>


<div class="dashboard-container">
    <h2>Bienvenido, <?php echo htmlspecialchars($_SESSION['usuario']); ?>!</h2>
    <p>Gestionar tus congeladores y productos.</p>

    <nav class="dashboard-nav">
        <ul class="button-list"> <li><a href="ver_congeladores.php" class="nav-button">
                <i class="fas fa-snowflake"></i> Ver Congeladores
            </a></li>
            <li><a href="ver_productos.php" class="nav-button">
                <i class="fas fa-boxes"></i> Ver Productos
            </a></li>
            <li><a href="agregar_producto.php" class="nav-button ag-button">
                <i class="fas fa-plus-circle"></i> Agregar Producto
            </a></li>
            <li><a href="logout.php" class="nav-button logout-button">
                <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
            </a></li>
        </ul>
    </nav>
</div>


<?php
// Incluir pie
include_once(__DIR__ . '/../includes/footer.php');
?>