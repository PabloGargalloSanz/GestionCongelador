CREATE DATABASE gestion_congeladores;

\c gestion_congeladores;

DROP TABLE IF EXISTS recetas_favoritas, receta_alimentos, cajon_alimentos, cajones, almacenamientos, recetas, alimentos, usuarios CASCADE;


CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    pass VARCHAR(255) NOT NULL,
    puntuacion NUMERIC(10, 2) DEFAULT 0 
);

CREATE TABLE alimentos (
    id_alimento SERIAL PRIMARY KEY,
    alimento_nombre VARCHAR (50) NOT NULL
);

CREATE TABLE recetas (
    id_receta SERIAL PRIMARY KEY,
    receta_nombre VARCHAR(50) NOT NULL,
    descripcion TEXT
);

CREATE TABLE almacenamientos(
    id_almacenamiento SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    almacenamiento_nombre VARCHAR(50) NOT NULL,
    localizacion VARCHAR(20) NOT NULL
);

CREATE TABLE cajones(
    id_cajon SERIAL PRIMARY KEY,
    id_almacenamiento INT NOT NULL REFERENCES almacenamientos(id_almacenamiento) ON DELETE CASCADE,
    posicion INT NOT NULL,
    tamano NUMERIC(10, 2) DEFAULT 100 CHECK (tamano > 0)
);

CREATE TABLE cajon_alimentos(
    id_cajon_alimentos SERIAL PRIMARY KEY,
    id_cajon INT NOT NULL REFERENCES cajones(id_cajon) ON DELETE CASCADE,
    id_alimento INT NOT NULL REFERENCES alimentos(id_alimento) ON DELETE CASCADE,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    unidad_medida VARCHAR(20) NOT NULL,
    fecha_introducido DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_sacado DATE CHECK (fecha_sacado IS NULL OR fecha_sacado >= fecha_introducido)
);

CREATE TABLE receta_alimentos(
    id_receta_alimento SERIAL PRIMARY KEY,
    id_receta INT NOT NULL REFERENCES recetas(id_receta) ON DELETE CASCADE,
    id_alimento INT NOT NULL REFERENCES alimentos(id_alimento) ON DELETE CASCADE,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    unidad_medida VARCHAR(20) NOT NULL
);

CREATE TABLE recetas_favoritas(
    id_receta_favorita SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_receta INT NOT NULL REFERENCES recetas(id_receta) ON DELETE CASCADE
);