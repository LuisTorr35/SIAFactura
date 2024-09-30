<?php
include 'conexion.php';  // Asegúrate de tener el archivo 'conexion.php' correctamente configurado

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Recibir los datos del formulario
    $ruc = $_POST['ruc'];
    $nombre = $_POST['nombre'];
    $direccion = $_POST['direccion'];

    // Preparar la consulta SQL para insertar los datos del cliente
    $sql = "INSERT INTO Cliente (ruc, nombre, direccion)
            VALUES ('$ruc', '$nombre', '$direccion')";

    // Ejecutar la consulta y verificar si se registró correctamente
    if ($conexion->query($sql) === TRUE) {
        echo "Cliente registrado exitosamente.";
    } else {
        echo "Error: " . $sql . "<br>" . $conexion->error;
    }

    // Cerrar la conexión
    $conexion->close();
}
?>
