INSERT INTO usuarios (email, password) VALUES
('admin@admin.com', 'admin'),
('estudiante@daw.es', '1234'),
('chef@cocina.com', 'chefpass'),
('usuario_prueba@gmail.com', 'user123'),
('maria.garcia@outlook.com', 'maria2025');

-- Alimentos
INSERT INTO alimentos (alimento_nombre, alimento_tipo) VALUES
('Pechuga de Pollo', 'Carne'),     -- ID 1
('Lomo de Salmón', 'Pescado'),     -- ID 2
('Espinacas Frescas', 'Verdura'),  -- ID 3
('Helado de Fresa', 'Postre');     -- ID 4

-- Almacenamientos y Cajones para ID 2
INSERT INTO almacenamientos (id_usuario, almacenamiento_nombre, localizacion) VALUES
(2, 'Nevera Principal', 'Cocina'), -- ID 1
(2, 'Arcón Garaje', 'Garaje');     -- ID 2

INSERT INTO cajones (id_almacenamiento, posicion, tamano) VALUES
(1, 1, 500.00), -- ID 1
(2, 1, 1000.00);-- ID 2

-- Lotes (id_cajon, id_alimento, cantidad, unidad, tamaño, fecha)
SELECT insertar_lote_cajon(1, 1, 2, 'unidades', 100, '2026-05-10');
SELECT insertar_lote_cajon(1, 3, 1, 'bolsa', 50, '2026-02-15');
SELECT insertar_lote_cajon(2, 2, 4, 'lomos', 400, '2026-09-20');

-- Recetas y Favoritos para ID 2
INSERT INTO recetas (receta_nombre, descripcion) VALUES ('Cena Ligera', 'Pollo con espinacas.');
INSERT INTO recetas_favoritas (id_usuario, id_receta) VALUES (2, 1);

