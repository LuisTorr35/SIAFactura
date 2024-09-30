<?php
$host = "localhost";
$usuario = "root";  // O tu usuario de MySQL
$contraseña = "root";   // Si tienes contraseña en MySQL, agrégala aquí
$base_de_datos = "siafactura";

$conexion = new mysqli($host, $usuario, $contraseña, $base_de_datos);
    
if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}
?>
