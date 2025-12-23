INSERT INTO usuarios (email, pass) VALUES
('admin@admin.com', 'admin'),
('estudiante@daw.es', '1234'),
('chef@cocina.com', 'chefpass'),
('usuario_prueba@gmail.com', 'user123'),
('maria.garcia@outlook.com', 'maria2025');

INSERT INTO alimentos (alimento_nombre, alimento_tipo) VALUES
('Pechuga de Pollo', 'Carne'),
('Lomo de Salmón', 'Pescado'),
('Guisantes Tiernos', 'Verdura'),
('Espinacas Frescas', 'Verdura'),
('Carne Picada Vacuno', 'Carne');

INSERT INTO recetas (receta_nombre, descripcion) VALUES
('Pollo al Horno', 'Pechuga asada con especias y limón.'),
('Salmón a la Plancha', 'Lomo de salmón con un toque de sal y pimienta.'),
('Crema de Guisantes', 'Guisantes triturados con cebolla y nata.'),
('Espinacas con Ajo', 'Espinacas salteadas con ajos tiernos.'),
('Hamburguesa Casera', 'Carne picada a la parrilla con pan artesano.');

INSERT INTO almacenamientos (id_usuario, almacenamiento_nombre, localizacion) VALUES
(1, 'Congelador Principal', 'Cocina'),
(1, 'Arcón Supletorio', 'Garaje'),
(2, 'Nevera Mini', 'Habitación'),
(3, 'Congelador Industrial', 'Restaurante'),
(5, 'Congelador Vertical', 'Despensa');

INSERT INTO cajones (id_almacenamiento, posicion, tamano) VALUES
(1, 1, 500.00),
(1, 2, 500.00),
(2, 1, 1000.00),
(3, 1, 200.00),
(4, 1, 2000.00);

SELECT insertar_lote_cajon(1, 1, 2, 'unidades', 50, '2025-12-31'); 
SELECT insertar_lote_cajon(1, 2, 1, 'paquete', 30, '2025-06-15'); 
SELECT insertar_lote_cajon(2, 3, 500, 'gramos', 40, '2026-01-20'); 
SELECT insertar_lote_cajon(3, 4, 3, 'bolsas', 60, '2025-08-10');   
SELECT insertar_lote_cajon(5, 5, 1, 'kg', 100, '2025-05-05');      

INSERT INTO receta_alimentos (id_receta, id_alimento, cantidad, unidad_medida) VALUES
(1, 1, 1, 'unidad'),
(2, 2, 1, 'lomo'),
(3, 3, 200, 'gramos'),
(4, 4, 2, 'manojos'),
(5, 5, 250, 'gramos');

INSERT INTO recetas_favoritas (id_usuario, id_receta) VALUES
(1, 1),
(1, 5),
(2, 3),
(3, 2),
(5, 4);