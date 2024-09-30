<?php
header('Content-Type: application/json');
include 'conexion.php'; // Asegúrate de que la conexión a la base de datos esté bien configurada

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Verifica si el parámetro está definido
    if (!isset($_GET['ruc_cliente'])) {
        echo json_encode(["error" => "El RUC del cliente es requerido."]);
        exit;
    }

    $ruc_cliente = $_GET['ruc_cliente'];

    // Preparar la consulta
    $sql = "SELECT * FROM Cliente WHERE ruc = ?";
    $stmt = $conexion->prepare($sql);

    if (!$stmt) {
        echo json_encode(["error" => "Error en la preparación de la consulta: " . $conexion->error]);
        exit;
    }

    // Enlaza el parámetro y ejecuta la consulta
    $stmt->bind_param("s", $ruc_cliente); // Asegúrate de que el tipo sea correcto
    $stmt->execute();
    $result = $stmt->get_result();

    // Verifica el resultado
    if ($result->num_rows > 0) {
        $cliente = $result->fetch_assoc();
        echo json_encode($cliente);
    } else {
        echo json_encode(["error" => "Cliente no encontrado"]);
    }

    // Cierra la declaración y la conexión
    $stmt->close();
    $conexion->close();
} else {
    echo json_encode(["error" => "Método no permitido"]);
}
?>
