# Build RPG Terminal Project

Compila el proyecto TypeScript y copia los assets públicos al directorio `dist/`.

## Comandos
```bash
npm run build
# Ejecuta: tsc && node copy-public.mjs
```

Esto genera los archivos compilados en `dist/` manteniendo la misma estructura que `src/`.

Para build + ejecución en terminal:
```bash
npm run dev
```

Para build + ejecución en web:
```bash
npm run dev:web
```

## Verificación
- Revisar que no haya errores de TypeScript en la compilación
- Verificar que `dist/web/public/` contenga `index.html`, `styles.css`, `app.js`
- Verificar que `dist/terminal/index.js` exista
