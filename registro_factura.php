<?php
include 'conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Lee y decodifica el JSON de la entrada
    $data = json_decode(file_get_contents("php://input"), true);

    // Verifica que los datos no sean nulos
    if (is_null($data) || !isset($data['ruc_cliente'], $data['id_articulo'], $data['cantidad'], $data['forma_pago'])) {
        http_response_code(400); // Código de error 400 para solicitud incorrecta
        echo json_encode(['error' => 'Faltan datos requeridos.']);
        exit; // Termina el script aquí
    }

    $ruc_cliente = $data['ruc_cliente'];
    $id_articulo = $data['id_articulo'];
    $cantidad = $data['cantidad'];
    $forma_pago = $data['forma_pago'];

    // Obtener la fecha actual
    $fecha_emision = date('Y-m-d');
    $fecha_vencimiento = date('Y-m-d', strtotime($fecha_emision . ' + 30 days'));

    // Inicializar la conexión de la base de datos y comenzar una transacción
    $conexion->begin_transaction();

    try {
        // Obtener información del artículo para calcular el total
        $sql_articulo = "SELECT precio FROM Artículo WHERE id = ?";
        $stmt_articulo = $conexion->prepare($sql_articulo);
        $stmt_articulo->bind_param("i", $id_articulo);
        $stmt_articulo->execute();
        $result_articulo = $stmt_articulo->get_result();
        $precio_articulo = 0;

        if ($result_articulo->num_rows > 0) {
            $row = $result_articulo->fetch_assoc();
            $precio_articulo = $row['precio'];
        } else {
            throw new Exception("Artículo no encontrado.");
        }

        $total = $precio_articulo * $cantidad;
        $igv = $total * 0.18; // Ejemplo: IGV del 18%
        $valor_venta = $total - $igv;

        // Insertar en FacturaDetalle
        $sql_detalle = "INSERT INTO FacturaDetalle (id_articulo, cantidad, total) VALUES (?, ?, ?)";
        $stmt_detalle = $conexion->prepare($sql_detalle);
        $stmt_detalle->bind_param("iid", $id_articulo, $cantidad, $total);

        if (!$stmt_detalle->execute()) {
            throw new Exception("Error en registro de detalle: " . $stmt_detalle->error);
        }

        // Obtener el ID del detalle insertado
        $id_detalle = $conexion->insert_id;

        // Insertar en FacturaCabecera
        $sql_factura = "INSERT INTO FacturaCabecera (ruc_empresa, ruc_cliente, fecha_emision, fecha_vencimiento, forma_pago, id_detalle, valor_venta, igv, precio_venta) VALUES (1234567890, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt_factura = $conexion->prepare($sql_factura);
        $stmt_factura->bind_param("ssssdidd", $ruc_cliente, $fecha_emision, $fecha_vencimiento, $forma_pago, $id_detalle, $valor_venta, $igv, $total);
        
        if (!$stmt_factura->execute()) {
            throw new Exception("Error en registro de cabecera: " . $stmt_factura->error);
        }

        // Obtener el ID de la factura insertada
        $id_factura = $conexion->insert_id; // Obtener el ID de la factura

        // Confirmar la transacción
        $conexion->commit();

        // Obtener datos del cliente
        $sql_cliente = "SELECT * FROM Cliente WHERE ruc = ?";
        $stmt_cliente = $conexion->prepare($sql_cliente);
        $stmt_cliente->bind_param("i", $ruc_cliente);
        $stmt_cliente->execute();
        $result_cliente = $stmt_cliente->get_result();
        $datos_cliente = $result_cliente->fetch_assoc();

        // Obtener datos del artículo
        $sql_articulo = "SELECT * FROM Artículo WHERE id = ?";
        $stmt_articulo = $conexion->prepare($sql_articulo);
        $stmt_articulo->bind_param("i", $id_articulo);
        $stmt_articulo->execute();
        $result_articulo = $stmt_articulo->get_result();
        $datos_articulo = $result_articulo->fetch_assoc();

        // Devolver los datos al cliente
        $response = [
            "id_factura" => $id_factura,
            "cliente" => $datos_cliente,
            "articulo" => $datos_articulo,
            "total" => $total
        ];

        echo json_encode($response); // Respuesta JSON

    } catch (Exception $e) {
        // Si hay un error, revertir la transacción
        $conexion->rollback();
        echo json_encode(['error' => 'Error: ' . $e->getMessage()]);
    } finally {
        // Cierra las conexiones
        if (isset($stmt_articulo)) {
            $stmt_articulo->close();
        }
        if (isset($stmt_factura)) {
            $stmt_factura->close();
        }
        if (isset($stmt_detalle)) {
            $stmt_detalle->close();
        }
        if (isset($stmt_cliente)) {
            $stmt_cliente->close();
        }
        $conexion->close();
    }
}
?>
