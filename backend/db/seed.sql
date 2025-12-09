CREATE DATABASE gestion_congeladores;

\c gestion_congeladores;

DROP TABLE IF EXISTS logs, recetas_favoritas, receta_alimentos, cajon_lotes, lotes, cajones, almacenamientos, recetas, alimentos, usuarios CASCADE;


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

CREATE TABLE lotes(
    id_lote SERIAL PRIMARY KEY,
    id_alimento INT NOT NULL REFERENCES alimentos(id_alimento) ON DELETE CASCADE,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    unidad_medida VARCHAR(20) NOT NULL,
    alimento_tamano INT NOT NULL,
    fecha_caducidad DATE NOT NULL
);

CREATE TABLE cajon_lotes(
    id_cajon_lote SERIAL PRIMARY KEY,
    id_cajon INT NOT NULL REFERENCES cajones(id_cajon) ON DELETE CASCADE,
    id_lote INT NOT NULL REFERENCES lotes(id_lote) ON DELETE CASCADE,
    fecha_introducido DATE NOT NULL DEFAULT CURRENT_DATE
);

-----
/*VISTAS*/
/*inventario usuario*/
CREATE VIEW vista_inventario_usuario AS
SELECT 
    u.id_usuario,
    alm.almacenamiento_nombre,
    c.id_cajon,
    c.posicion AS cajon_posicion,
    a.alimento_nombre,
    l.cantidad,
    l.unidad_medida
FROM usuarios u
JOIN almacenamientos alm ON u.id_usuario = alm.id_usuario
JOIN cajones c ON alm.id_almacenamiento = c.id_almacenamiento
JOIN cajon_lotes cl ON c.id_cajon = cl.id_cajon
JOIN lotes l ON cl.id_lote = l.id_lote
JOIN alimentos a ON l.id_alimento = a.id_alimento;

/*capcidad cajon*/
CREATE VIEW vista_estado_cajones AS
SELECT 
    c.id_cajon,
    c.tamano AS capacidad_maxima,
    COALESCE(SUM(l.alimento_tamano), 0) AS ocupacion_actual,
    (c.tamano - COALESCE(SUM(l.alimento_tamano), 0)) AS espacio_disponible
FROM cajones c
LEFT JOIN cajon_lotes cl ON c.id_cajon = cl.id_cajon
LEFT JOIN lotes l ON cl.id_lote = l.id_lote
GROUP BY c.id_cajon, c.tamano;

/*TRIGGER*/
/*comprobar capacidad*/
CREATE FUNCTION verificar_capacidad_cajon()
RETURNS TRIGGER AS $$
DECLARE
    v_ocupacion_actual INT;
    v_capacidad_maxima INT;
    v_nuevo_tamano INT;
BEGIN
    SELECT tamano INTO v_capacidad_maxima FROM cajones WHERE id_cajon = NEW.id_cajon;
    
    SELECT alimento_tamano INTO v_nuevo_tamano FROM lotes WHERE id_lote = NEW.id_lote;

    SELECT COALESCE(SUM(l.alimento_tamano), 0) INTO v_ocupacion_actual
    FROM cajon_lotes cl
    JOIN lotes l ON cl.id_lote = l.id_lote
    WHERE cl.id_cajon = NEW.id_cajon;

    IF (v_ocupacion_actual + v_nuevo_tamano) > v_capacidad_maxima THEN
        RAISE EXCEPTION 'El cajón no tiene espacio suficiente.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_capacidad
BEFORE INSERT ON cajon_lotes
FOR EACH ROW
EXECUTE FUNCTION verificar_capacidad_cajon();


/*insertar datos en lotes e insertar el lote en cajon_lotes*/
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