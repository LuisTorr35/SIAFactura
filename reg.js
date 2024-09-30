function mostrarCampos() {
    const metodoSeleccionado = document.getElementById("metodoPago").value;
    const efectivoDiv = document.getElementById("efectivo");
    const tarjetaDiv = document.getElementById("tarjeta");
    const yapeDiv = document.getElementById("yape");
    const plinDiv = document.getElementById("plin");

    // Ocultar todos los métodos de pago
    if (efectivoDiv) efectivoDiv.style.display = "none";
    if (tarjetaDiv) tarjetaDiv.style.display = "none";
    if (yapeDiv) yapeDiv.style.display = "none";
    if (plinDiv) plinDiv.style.display = "none";

    // Mostrar el método seleccionado
    if (metodoSeleccionado === "efectivo") {
        if (efectivoDiv) efectivoDiv.style.display = "block";
    } else if (metodoSeleccionado === "tarjeta") {
        if (tarjetaDiv) tarjetaDiv.style.display = "block";
    } else if (metodoSeleccionado === "yape") {
        if (yapeDiv) {
            yapeDiv.style.display = "block";
            document.getElementById("codigoYape").value = "123456789"; // Código Yape por defecto
        }
    } else if (metodoSeleccionado === "plin") {
        if (plinDiv) {
            plinDiv.style.display = "block";
            document.getElementById("codigoPlin").value = "987654321"; // Código Plin por defecto
        }
    }
}


document.getElementById('metodoPago').addEventListener('change', function () {
    const metodoSeleccionado = document.getElementById('metodoPago').value;
    const campoYape = document.getElementById('campoYape');
    const campoPlin = document.getElementById('campoPlin');
    
    // Mostrar campo de carga de archivo solo si se selecciona Yape o Plin
    if (metodoSeleccionado === 'yape') {
        campoYape.style.display = 'block';
        campoPlin.style.display = 'none';
    } else if (metodoSeleccionado === 'plin') {
        campoPlin.style.display = 'block';
        campoYape.style.display = 'none';
    } else {
        campoYape.style.display = 'none';
        campoPlin.style.display = 'none';
    }
});

// Validación para asegurar que solo se acepten archivos .png
function validarArchivo(archivoInput) {
    const archivo = archivoInput.files[0];
    const resultado = document.getElementById("resultadoArchivo");
    
    if (archivo) {
        const extension = archivo.name.split('.').pop().toLowerCase();
        if (extension !== 'png') {
            resultado.textContent = "Solo se permiten archivos .png.";
            archivoInput.value = ""; // Limpiar el campo de archivo
        } else {
            resultado.textContent = "Archivo cargado correctamente.";
        }
    }
}

function calcularVuelto() {
    const monto = parseFloat(document.getElementById("monto").value);
    const pagado = parseFloat(document.getElementById("pagado").value);
    const resultado = document.getElementById("resultadoEfectivo");

    if (!isNaN(monto) && !isNaN(pagado) && pagado >= monto) {
        const vuelto = pagado - monto;
        resultado.textContent = "Vuelto: S/ " + vuelto.toFixed(2);
    } else {
        resultado.textContent = "El monto pagado no es suficiente.";
    }
}

function pagar() {
    //registrarDatos();
    generarPDF();
}

function registrarDatos() {
    const ruc = document.getElementById("ruc_cliente").value;
    const metodoPago = document.getElementById("metodoPago").value;
    const idArticulo = document.getElementById("id_articulo").value;
    const cantidad = document.getElementById("cantidad").value;
    
    // Validar entradas
    if (!ruc || !metodoPago || !idArticulo || !cantidad) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Crear un objeto para enviar con los datos
    const data = {
        ruc_cliente: ruc,
        forma_pago: metodoPago,
        id_articulo: idArticulo,
        cantidad: cantidad
    };

    // Enviar los datos a PHP mediante fetch API
    fetch('registro_factura.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text()) // Cambia a text() para inspeccionar la respuesta
    .then(text => {
        console.log("Respuesta del servidor:", text); // Muestra la respuesta en la consola
        try {
            const result = JSON.parse(text); // Intenta convertir a JSON
            if (result.error) {
                throw new Error(result.error); // Maneja el error si existe
            }
            alert("Factura registrada exitosamente. ID: " + result.id_factura);
            generarPDF(result.cliente); // Pasa los datos del cliente para generar el PDF
        } catch (e) {
            console.error('Error de análisis JSON:', e);
            alert('Error al procesar la respuesta del servidor: ' + e.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function generarPDF(cliente) {
    if (!cliente) {
        console.error("No se recibió información del cliente.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Datos del formulario
    const rucElement = document.getElementById("ruc_cliente");
    const metodoPagoElement = document.getElementById("metodoPago");

    const ruc = rucElement.value;
    const metodoPago = metodoPagoElement.value;

    // Aquí obtén los códigos de pago según el método
    let codigoPago = "";
    if (metodoPago === "yape") {
        const codigoYapeElement = document.getElementById("codigoYape");
        codigoPago = codigoYapeElement ? codigoYapeElement.value : "";
    } else if (metodoPago === "plin") {
        const codigoPlinElement = document.getElementById("codigoPlin");
        codigoPago = codigoPlinElement ? codigoPlinElement.value : "";
    }

    const montoElement = document.getElementById("monto");
    const pagadoElement = document.getElementById("pagado");

    const monto = montoElement ? parseFloat(montoElement.value) : 0;
    const pagado = pagadoElement ? parseFloat(pagadoElement.value) : 0;
    const vuelto = pagado - monto;

    // Añadir el título y la cabecera
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 128);
    doc.text("Factura de Pago", 105, 20, null, null, "center");

    // Añadir los datos de la empresa
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Razón Social: Materiales de Construcción S.A.C.", 20, 40);
    doc.text("RUC: 1234567890", 20, 45);
    doc.text("Dirección: Av. Constructores 123, Lima", 20, 50);
    doc.text("Teléfono: +51 987654321", 20, 55);
    doc.text("Correo: ContrucE@gmail.com", 20, 60);

    // Separador
    doc.setLineWidth(0.5);
    doc.line(20, 65, 190, 65);

    // Sección de datos del cliente
    doc.setFontSize(16);
    doc.text("Datos del Cliente", 20, 75);
    
    doc.setFontSize(12);
    doc.text(`RUC: ${cliente.ruc}`, 20, 90);
    doc.text(`Nombre: ${cliente.nombre}`, 20, 95); // Agregar nombre
    doc.text(`Dirección: ${cliente.direccion}`, 20, 100); // Agregar dirección
    doc.text(`Método de Pago: ${metodoPago}`, 20, 110);
    if (metodoPago === "yape" || metodoPago === "plin") {
        doc.text(`Código de pago: ${codigoPago}`, 20, 115);
    }

    // Separador
    doc.setLineWidth(0.5);
    doc.line(20, 120, 190, 120);

    // Detalle del pago
    doc.setFontSize(16);
    doc.text("Detalle del Pago", 20, 130);
    
    doc.setFontSize(12);
    doc.autoTable({
        startY: 140,
        head: [['Descripción', 'Monto (S/)', 'Pagado (S/)', 'Vuelto (S/)']],
        body: [
            ['Pago de Artículos', monto.toFixed(2), pagado.toFixed(2), vuelto.toFixed(2)]
        ],
        theme: 'striped',
        headStyles: { fillColor: [0, 0, 128] },
        styles: { halign: 'center' }
    });

    // Footer
    doc.setFontSize(10);
    doc.text("Gracias por su compra.", 105, doc.internal.pageSize.height - 10, null, null, 'center');

    // Generar el PDF
    doc.save('factura.pdf');
}


function buscarProducto() {
    const idArticulo = document.getElementById("id_articulo").value;
    
    // Verificar que se ingresa un ID
    if (idArticulo) {
        fetch(`buscar_producto.php?id=${idArticulo}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    document.getElementById("nombreProducto").textContent = `Nombre: ${data.nombre}`;
                    document.getElementById("precioProducto").textContent = `Precio: S/ ${data.precio}`;
                    document.getElementById("unidadProducto").textContent = `Unidad: ${data.unidad}`;
                    document.getElementById("detalleProducto").style.display = "block";
                } else {
                    alert("Producto no encontrado.");
                    document.getElementById("detalleProducto").style.display = "none";
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } else {
        document.getElementById("detalleProducto").style.display = "none";
    }
}
function registrarDatos() {
    const ruc = document.getElementById("ruc_cliente").value.trim(); // Trim para eliminar espacios
    const metodoPago = document.getElementById("metodoPago").value;
    const idArticulo = document.getElementById("id_articulo").value;
    const cantidad = document.getElementById("cantidad").value;

    // Validar entradas
    if (!ruc || !metodoPago || !idArticulo || !cantidad) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const data = {
        ruc_cliente: ruc,
        forma_pago: metodoPago,
        id_articulo: idArticulo,
        cantidad: cantidad
    };

    fetch('registro_factura.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la respuesta de la red');
        }
        return response.json();
    })
    .then(result => {
        console.log(result);
        alert("Factura registrada exitosamente. ID: " + result.id_factura);
        return fetch(`obtener_cliente.php?ruc_cliente=${ruc}`); // Asegúrate de usar el nombre correcto del parámetro
    })
    .then(response => response.json())
    .then(cliente => {
        if (cliente.error) {
            console.error(cliente.error);
            alert("Error al recuperar los datos del cliente.");
            return;
        }
        generarPDF(cliente); // Asegúrate de que se pase el cliente correctamente
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
