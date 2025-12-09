CREATE DATABASE gestion_congeladores;

\c gestion_congeladores;

DROP TABLE IF EXISTS logs, recetas_favoritas, receta_alimentos, cajon_alimentos, cajones, almacenamientos, recetas, alimentos, usuarios CASCADE;


CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    pass VARCHAR(255) NOT NULL,
    puntuacion NUMERIC(10, 2) DEFAULT 0 
);

CREATE TABLE alimentos (
    id_alimento SERIAL PRIMARY KEY,
    alimento_nombre VARCHAR (50) NOT NULL,
    alimento_tipo VARCHAR (50) NOT NULL
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

CREATE TABLE cajon_lotes(
    id_cajon_lote SERIAL PRIMARY KEY,
    id_cajon INT NOT NULL REFERENCES cajones(id_cajon) ON DELETE CASCADE,
    id_lote INT NOT NULL REFERENCES lotes(id_lote) ON DELETE CASCADE,
    fecha_introducido DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE lotes(
    id_lote SERIAL PRIMARY KEY,
    id_alimento INT NOT NULL REFERENCES alimentos(id_alimento) ON DELETE CASCADE,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    unidad_medida VARCHAR(20) NOT NULL,
    alimento_tamano INT NOT NULL,
    fecha_caducidad DATE NOT NULL
);

-----
/*TRANSACCIONES*/
/*funcion insertar datos en lotes e insertar el lote en cajon_lotes*/
CREATE FUNCTION insertar_lote_cajon(
    p_id_cajon INT,
    p_id_alimento INT,
    p_cantidad INT,
    p_unidad_medida VARCHAR,
    p_alimento_tamano INT,
    p_fecha_caducidad DATE
)
RETURNS SETOF cajon_lotes AS $$
DECLARE
    v_id_lote INT;
BEGIN
    INSERT INTO lotes (id_alimento, cantidad, unidad_medida, alimento_tamano, fecha_caducidad)
    VALUES (p_id_alimento, p_cantidad, p_unidad_medida, p_alimento_tamano, p_fecha_caducidad)
    RETURNING id_lote INTO v_id_lote;

    RETURN QUERY 
    INSERT INTO cajon_lotes (id_cajon, id_lote)
    VALUES (p_id_cajon, v_id_lote)
    RETURNING *;
    
END;
$$ LANGUAGE plpgsql;



/*eliminar lote completo*/
CREATE FUNCTION eliminar_lote(
    p_id_lote INT
)
RETURNS TABLE (id_lote_eliminado INT) AS $$
BEGIN
    DELETE FROM lotes
    WHERE id_lote = p_id_lote;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Lote no encontrado.', p_id_lote;
    END IF;
    
    RETURN QUERY SELECT p_id_lote;
END;
$$ LANGUAGE plpgsql;

---------------------------------------------------------------------------------------------------------
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

CREATE TABLE logs (
	id_log SERIAL PRIMARY KEY,
	fecha_log DATE NOT NULL,
	hora_log TIME NOT NULL,
	metodo VARCHAR,
	ip VARCHAR,
	direccion VARCHAR
);