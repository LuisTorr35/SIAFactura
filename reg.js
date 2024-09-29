function mostrarCampos() {
    const metodoSeleccionado = document.getElementById("metodoPago").value;
    const efectivoDiv = document.getElementById("efectivo");
    const tarjetaDiv = document.getElementById("tarjeta");
    const yapeDiv = document.getElementById("yape");
    const plinDiv = document.getElementById("plin");

    // Ocultar todos los métodos de pago
    efectivoDiv.style.display = "none";
    tarjetaDiv.style.display = "none";
    yapeDiv.style.display = "none";
    plinDiv.style.display = "none";

    // Mostrar el método seleccionado
    if (metodoSeleccionado === "efectivo") {
        efectivoDiv.style.display = "block";
    } else if (metodoSeleccionado === "tarjeta") {
        tarjetaDiv.style.display = "block";
    } else if (metodoSeleccionado === "yape") {
        yapeDiv.style.display = "block";
        document.getElementById("codigoYape").value = "123456789"; // Código Yape por defecto
    } else if (metodoSeleccionado === "plin") {
        plinDiv.style.display = "block";
        document.getElementById("codigoPlin").value = "987654321"; // Código Plin por defecto
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
    alert("Datos registrados exitosamente.");
}

function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Datos del formulario
    const nombre = document.getElementById("nombre").value;
    const ruc = document.getElementById("ruc").value;
    const direccion = document.getElementById("direccion").value;
    const telefono = document.getElementById("telefono").value;
    const correo = document.getElementById("correo").value;
    const metodoPago = document.getElementById("metodoPago").value;

    let codigoPago = "";
    if (metodoPago === "yape") {
        codigoPago = document.getElementById("codigoYape").value;
    } else if (metodoPago === "plin") {
        codigoPago = document.getElementById("codigoPlin").value;
    }

    const monto = document.getElementById("monto") ? document.getElementById("monto").value : '';
    const pagado = document.getElementById("pagado") ? document.getElementById("pagado").value : '';
    const vuelto = pagado - monto;

    // Añadir el título y la cabecera
    doc.setFontSize(22);
    doc.setTextColor(0, 0, 128);
    doc.text("Factura de Pago", 105, 20, null, null, "center");

    // Añadir los datos de la empresa
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Empresa XYZ S.A.C.", 20, 40);
    doc.text("RUC: 20512345678", 20, 45);
    doc.text("Dirección: Calle Ejemplo 123, Ciudad", 20, 50);
    doc.text("Teléfono: +51 987654321", 20, 55);
    doc.text("Correo: contacto@empresa.com", 20, 60);

    // Separador
    doc.setLineWidth(0.5);
    doc.line(20, 65, 190, 65);

    // Sección de datos del cliente
    doc.setFontSize(16);
    doc.text("Datos del Cliente", 20, 75);
    
    doc.setFontSize(12);
    doc.text(`Nombre: ${nombre}`, 20, 85);
    doc.text(`RUC: ${ruc}`, 20, 90);
    doc.text(`Dirección: ${direccion}`, 20, 95);
    doc.text(`Teléfono: ${telefono}`, 20, 100);
    doc.text(`Correo: ${correo}`, 20, 105);
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
            ['Pago de Artículos', monto, pagado, vuelto.toFixed(2)]
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

