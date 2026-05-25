# Run RPG Terminal (Modo Web)

Ejecuta el servidor web con interfaz gráfica en el navegador.

## Comandos
```bash
# Compilar e iniciar servidor web
npm run dev:web

# O si ya está compilado
npm run web
```

## Acceso
Abrir navegador en `http://localhost:3000`

Si el puerto 3000 está ocupado, el servidor intenta puertos siguientes (3001, 3002, etc.).

## Notas
- La comunicación es vía WebSocket entre el frontend y el servidor
- Los datos de partida se guardan en `localStorage` del navegador
- El servidor usa Express para servir archivos estáticos y WebSocket para la lógica del juego
