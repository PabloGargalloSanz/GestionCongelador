CREATE DATABASE IF NOT EXISTS congelador;
USE congelador;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL,
    contrasena VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE congeladores(
    id INT AUTO_INCREMENT PRIMARY KEY,
    localizacion VARCHAR(30),
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)

);

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_ingreso DATE DEFAULT CURRENT_TIMESTAMP,
    cantidad INT (3),
    id_congelador INT,
    cajon INT (1),
    fecha_caducidad DATE DEFAULT NULL,
    FOREIGN KEY (id_congelador) REFERENCES congeladores(id)
);


CREATE TABLE registro_eliminaciones (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    id_congelador INT,
    nombre_producto VARCHAR(100),
    cantidad INT,
    fecha_evento DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_congelador) REFERENCES congeladores(id)
);

