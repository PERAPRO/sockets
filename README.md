# WebSocket & Express API

Este proyecto implementa un servidor Express junto con WebSockets para manejar datos de usuarios, agentes y clientes. Permite realizar consultas a través de endpoints HTTP y recibir actualizaciones en tiempo real mediante WebSockets.

## Características
- API REST con Express.
- WebSockets para comunicación en tiempo real.
- Filtrado de datos mediante parámetros en las solicitudes.
- CORS habilitado para permitir acceso desde cualquier origen.

## Instalación
1. Clona este repositorio:
   ```sh
   git clone <repo-url>
   ```
2. Accede al directorio del proyecto:
   ```sh
   cd <project-folder>
   ```
3. Instala las dependencias:
   ```sh
   npm install
   ```

## Uso
### Ejecutar el servidor
```sh
node multi-server.js
```
El servidor se ejecutará en `http://localhost:3001`.

### Endpoints disponibles
#### Obtener información del usuario
```sh
GET /user
```

#### Obtener la lista de agentes (opcional: filtrar por estado)
```sh
GET /agents?status=<estado>
```

#### Obtener la lista de clientes (opcional: filtrar por categoría, tiempo de última actualización y estado)
```sh
GET /customers?category=<categoria>&time=<minutos>&status=<estado>
```

### WebSockets
Los clientes pueden conectarse mediante WebSockets y enviar actualizaciones de estado de agentes y clientes. Cada cambio será retransmitido a todos los clientes conectados.

## Dependencias
- express
- http
- ws
- cors

