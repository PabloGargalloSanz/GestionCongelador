# ❄️ FreezerManager (Gestión de Congeladores)

Un sistema integral de gestión de inventario doméstico diseñado para administrar múltiples unidades de almacenamiento en frío, optimizar el consumo de alimentos y generar menús semanales mediante Inteligencia Artificial.

---

## ✨ Características Principales

* **Gestión Multialmacén:** Control y organización de diferentes unidades físicas (ej. Congelador Principal, Arcón del sótano) divididas por cajones para una localización exacta del producto.
* **Menú Semanal Inteligente (IA):** Integración con modelo de IA local (Gemma 2 vía Ollama) para diseñar menús basados en dieta mediterránea utilizando el stock disponible. Incluye alertas dinámicas de descongelación para el día siguiente y generación de listas de la compra sugeridas.
* **Alimentos Imprescindibles:** Sistema de reglas personalizables para establecer el stock mínimo requerido de productos clave, con alertas visuales de estado ("Stock ideal", "Al límite", "Faltan").
* **Estadísticas Avanzadas:** Análisis visual del consumo histórico mediante gráficos (Chart.js), mostrando el desglose por categorías y la evolución interanual.
* **Seguridad y Autenticación:** Sistema de login seguro con JSON Web Tokens (JWT), uso de Argon2id para hacer hash de contraseás y validación estricta de contraseñas robustas en el backend.
* **Diseño 100% Responsive:** Interfaz "Mobile-First" construida con Vanilla JavaScript y CSS moderno (Flexbox/Grid), optimizada para su uso en smartphones.

---

## 🛠️ Stack Tecnológico

El proyecto está construido bajo una arquitectura de microservicios contenerizados:

**Frontend**
* Vanilla JavaScript (ES6 Modules) - *Arquitectura sin frameworks para un control absoluto del DOM y el rendimiento.*
* HTML5 & CSS3
* Chart.js (Visualización de datos)

**Backend & IA**
* Node.js con Express
* Inteligencia Artificial: Ollama (Modelo base: `gemma2:9b`)
* JWT (JSON Web Tokens) & Argon2id

**Base de Datos & Infraestructura**
* PostgreSQL
* Nginx (Proxy Inverso y servidor de estáticos)
* Docker & Docker Compose (Orquestación de contenedores)

---

## 📂 Estructura del proyecto

GestionCongelador/ <br>
├── frontend/             # Archivos estáticos servidos por Nginx <br>
│   ├── index.html        # Punto de entrada (Single Page Application) <br>
│   ├── nginx.conf        # Configuración de Nginx <br>
│   ├── Dockerfile <br>
│   ├── img/              # Imagenes de la aplicación <br>
│   ├── fonts/            # Fuentes de texto <br>
│   ├── styles/           # Estilos modulares (_responsive.css, styles.css) <br>
│   ├── js/ <br>
│   │   ├── core/         # Lógica central (UI, router, auth) <br>
│   │   └── views/        # Controladores de vista (Estadísticas, Menú, Inventario) <br>
├── backend/              # API RESTful en Node.js <br>
│   ├── controllers/      # Lógica de negocio y validaciones <br>
│   ├── db/               # Scripts de inicialización de PostgreSQL <br>
│   ├── services/         # Consultas a la BD y llamadas a IA <br>
│   ├── routes/           # Endpoints de la API <br>
│   ├── utils/            # Cargador de variables del .env <br>
│   ├── jobs/             # Cron automático de creación de menú para los usuarios <br>
│   ├── .env              # Variables de entorno <br>
│   ├── Dockerfile <br>
│   └── app.js            # Archivo principal <br>
└── docker-compose.yml    # Orquestación de servicios (Nginx, Node, Postgres, Ollama) <br>

---

## 🚀 Instalación y Despliegue

El proyecto está preparado para desplegarse fácilmente utilizando Docker.

### 1. Requisitos Previos
* Tener instalado [Docker](https://www.docker.com/) y Docker Compose en tu máquina o servidor.
* Contar con al menos 8GB de RAM recomendados para la ejecución local del modelo de IA (Ollama).

### 2. Clonar el repositorio
```bash
git clone https://github.com/PabloGargalloSanz/GestionCongelador.git
```

### 3. Configuración del entorno

Crear archivo .env dentro de la carpeta de ./backend y rellenar con el ejemplo de .env.example

Ejemplo de variables en ./backend/.env <br>
DB_USER=tu_usuario <br>
DB_PASSWORD=tu_password <br>
DB_HOST=congeladores_db <br>
DB_PORT=5432 <br>
DB_NAME=freezermanager <br>
JWT_SECRET=clave_super_segura <br>
PEPPER=clave_segura_2 <br>

### 4. Levantar contenedores

docker compose --env-file ./backend/.env up -d --build

---

## Imágenes 

### 1. Acceso
<img width="1915" height="907" alt="image" src="https://github.com/user-attachments/assets/bc5e7e93-ca2b-4b90-a2ba-8bbbf7713db2" />

### 2. Menú principal
<img width="1900" height="902" alt="image" src="https://github.com/user-attachments/assets/e012767d-4a6b-4381-b0a5-66a0b738b7f1" />

### 3. Inventario
<img width="1900" height="903" alt="image" src="https://github.com/user-attachments/assets/ad2f1f02-db6e-4be0-b8ae-ca8525105502" />

### 4. Alimentos imprescindibles
<img width="1916" height="900" alt="image" src="https://github.com/user-attachments/assets/f4d0512e-fd15-446c-b8b2-7fd1d12e3819" />

### 5. Estadísticas
<img width="1903" height="903" alt="image" src="https://github.com/user-attachments/assets/899ee7aa-4807-4fe5-9917-87bbbfffcaa7" />

### 6. Menú semanal
<img width="1917" height="906" alt="image" src="https://github.com/user-attachments/assets/0c9180f4-5955-4ba1-a1d1-82e121d68be9" />

### 7. Modales
<img width="481" height="512" alt="image" src="https://github.com/user-attachments/assets/4cc00f05-2f9b-4d84-a555-c4230220c450" />
<img width="525" height="555" alt="image" src="https://github.com/user-attachments/assets/aeb88ee9-b69a-4d40-b312-afde48c45a39" />




---

## ✍️ Próximos pasos
* Implementar sistema de notificaciones de lista de la compra por email.
* Personalización más profunda de menú.
* Facilitar la introducción y extracción mediante fotos.
