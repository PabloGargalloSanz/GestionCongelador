CREATE DATABASE gestion_congeladores IF NOT EXISTS;

\c gestion_congeladores;

DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    pass VARCHAR(20) NOT NULL,
    puntuacion DECIMAL(10, 2) DEFAULT 0 
);

DROP TABLE IF EXISTS alimentos;
CREATE TABLE alimentos (
    id_alimento SERIAL PRIMARY KEY,
    alimento_nombre VARCHAR (50)
);

DROP TABLE IF EXISTS recetas;
CREATE TABLE recetas (
    id_receta SERIAL PRIMARY KEY,
    receta_nombre VARCHAR(50) NOT NULL,
    descripcion TEXT
);

DROP TABLE IF EXISTS almacenamientos;
CREATE TABLE almacenamiento(
    id_almacenamiento SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    almacenamiento_nombre VARCHAR(50) NOT NULL,
    localizacion VARCHAR(20) NOT NULL
);

DROP TABLE IF EXISTS cajones;
CREATE TABLE cajones(
    id_cajon SERIAL PRIMARY KEY,
    id_almacenamiento INT NOT NULL REFERENCES almacenamientos(id) ON DELETE CASCADE,
    posicion INT NOT NULL,
    tamano DECIMAL(10, 2) DEFAULT 100 CHECK (cantidad > 0)
);

DROP TABLE IF EXISTS cajon_alimentos;
CREATE TABLE cajon_alimentos(
    id_cajon_alimentos SERIAL PRIMARY KEY,
    id_cajon INT NOT NULL REFERENCES cajones(id_cajon) ON DELETE CASCADE,
    id_alimento INT NOT NULL REFERENCES alimentos(id_alimento) ON DELETE CASCADE,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    unidad_medida VARCHAR NOT NULL,
    fecha_introducido DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_sacado DATE 
);

DROP TABLE IF EXISTS receta_alimeto;
CREATE TABLE receta_alimeto(
    id_receta_alimento SERIAL PRIMARY KEY,
    id_receta INT NOT NULL REFERENCES recetas(id_receta) ON DELETE CASCADE,
    id_alimento INT NOT NULL REFERENCES alimentos(id_alimento) ON DELETE CASCADE,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    unidad_medida VARCHAR NOT NULL
);

DROP TABLE IF EXISTS recetas_favoritas;
CREATE TABLE recetas_favoritas(
    id_receta_alimento SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_receta INT NOT NULL REFERENCES recetas(id_receta) ON DELETE CASCADE
);