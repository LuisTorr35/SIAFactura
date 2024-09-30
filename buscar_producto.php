<?php
include 'conexion.php';

if (isset($_GET['id'])) {
    $id_articulo = $_GET['id'];
    
    $sql = "SELECT nombre, precio, unidad FROM Artículo WHERE id = '$id_articulo'";
    $result = $conexion->query($sql);

    if ($result->num_rows > 0) {
        echo json_encode($result->fetch_assoc());
    } else {
        echo json_encode(null);
    }
}

$conexion->close();
?>
