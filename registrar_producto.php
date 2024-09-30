<?php
include 'conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre_producto = $_POST['nombre'] ?? '';
    $codigo_producto = $_POST['id'] ?? null; // O puedes quitar el valor por defecto para que falle si no se proporciona
    $precio = $_POST['precio'] ?? 0; // Establecer un valor por defecto
    $stock = $_POST['unidad'] ?? '';

    // Verifica que el id no esté vacío
    if (empty($codigo_producto)) {
        echo "El código del producto es obligatorio.";
        exit();
    }

    // Preparar la consulta SQL para insertar los datos
    $sql = "INSERT INTO artículo (nombre, id, precio, unidad)
            VALUES ('$nombre_producto', '$codigo_producto', '$precio', '$stock')";

    if ($conexion->query($sql) === TRUE) {
        echo "Producto registrado exitosamente.";
    } else {
        echo "Error: " . $sql . "<br>" . $conexion->error;
    }

    // Cerrar la conexión
    $conexion->close();
}
?>
