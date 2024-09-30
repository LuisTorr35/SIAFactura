<?php
$host = "localhost";
$usuario = "root";  // O tu usuario de MySQL
$contraseña = "YsoyRebelde01";   // Si tienes contraseña en MySQL, agrégala aquí
$base_de_datos = "facturasia";

$conexion = new mysqli($host, $usuario, $contraseña, $base_de_datos);

if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}
?>
