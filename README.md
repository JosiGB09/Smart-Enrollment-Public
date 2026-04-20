# Smart-Enrollment-Public
Este proyecto es un sistema web para la gestión de la matrícula de estudiantes en una institución escolar, enfocado principalmente en el proceso de inscripción y administración académica. 
## Estado del proyecto

Este proyecto se encuentra **en desarrollo**, por lo que actualmente no incluye todas las funcionalidades planeadas ni representa una versión final del sistema.

## Tecnologías utilizadas

### Frontend
- React
- Vite
- React Router
- Bootstrap

### Backend
- ASP.NET Core 8
- Dapper
- MySQL
- JWT
- MailKit

## Estructura del proyecto

Sistema-de-Matricula/
├── BaseSql/
├── Documentacion/
├── SmartEnrollment-Api/
└── SmartEnrollment-frontend/

## Requisitos
.NET 8 SDK
Node.js
MySQL
Configuración
El backend (por el momento) utiliza User Secrets para almacenar datos sensibles como:

1. cadena de conexión a la base de datos

2. configuración JWT

3. credenciales de correo

Además, CORS debe permitir el origen del frontend en desarrollo, por ejemplo:
"Cors": {
  "AllowedOrigins": [
    "http://localhost:5173"
  ]
}

## Instalación y ejecución
1. Clonar el repositorio
git clone https://github.com/JosiGB09/Smart-Enrollment-Public.git
cd Sistema-de-Matricula
2. Ejecutar el backend
cd SmartEnrollment-Api
dotnet restore
dotnet run
La API se ejecutará normalmente en:
https://localhost:7221


3. Ejecutar el frontend
cd SmartEnrollment-frontend
npm install
npm run dev
La aplicación se ejecutará normalmente en:
http://localhost:5173


## Funcionalidades trabajadas actualmente
Landing page pública

Inicio de sesión con JWT

Recuperación de contraseña

Protección de rutas privadas

Gestión de usuarios

Gestión de estudiantes

Gestión de encargados

Gestión de grados

Gestión de secciones

Base del módulo de matrícula
