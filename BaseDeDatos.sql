CREATE TABLE IF NOT EXISTS `FacturaCabecera` (
	`id_factura` int AUTO_INCREMENT NOT NULL UNIQUE,
	`ruc_empresa` int NOT NULL,
	`ruc_cliente` int NOT NULL,
	`fecha_emision` date NOT NULL,
	`fecha_vencimiento` date NOT NULL,
	`forma_pago` text NOT NULL,
	`vendedor` int NOT NULL,
	`guia_remision` int NOT NULL,
	`id_detalle` int NOT NULL,
	`valor_venta` double NOT NULL,
	`igv` double NOT NULL,
	`precio_venta` double NOT NULL,
	PRIMARY KEY (`id_factura`)
);

CREATE TABLE IF NOT EXISTS `FacturaDetalle` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`id_articulo` int NOT NULL,
	`cantidad` int NOT NULL,
	`total` double NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `Cliente` (
	`ruc` int AUTO_INCREMENT NOT NULL UNIQUE,
	`nombre` text NOT NULL,
	`direccion` text NOT NULL,
	PRIMARY KEY (`ruc`)
);

CREATE TABLE IF NOT EXISTS `Artículo` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`nombre` text NOT NULL,
	`precio` double NOT NULL,
	`unidad` text NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `Empresa` (
	`ruc` int AUTO_INCREMENT NOT NULL UNIQUE,
	`direccion` text NOT NULL,
	`razon_social` text NOT NULL,
	`localidad` text NOT NULL,
	PRIMARY KEY (`ruc`)
);

ALTER TABLE `FacturaCabecera` ADD CONSTRAINT `FacturaCabecera_fk1` FOREIGN KEY (`ruc_empresa`) REFERENCES `Empresa`(`ruc`);
ALTER TABLE `FacturaCabecera` ADD CONSTRAINT `FacturaCabecera_fk2` FOREIGN KEY (`ruc_cliente`) REFERENCES `Cliente`(`ruc`);
ALTER TABLE `FacturaCabecera` ADD CONSTRAINT `FacturaCabecera_fk8` FOREIGN KEY (`id_detalle`) REFERENCES `FacturaDetalle`(`id`);
ALTER TABLE `FacturaDetalle` ADD CONSTRAINT `FacturaDetalle_fk1` FOREIGN KEY (`id_articulo`) REFERENCES `Artículo`(`id`);