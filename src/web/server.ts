import express from 'express'
import { createServer } from 'node:http'
import { WebSocketServer } from 'ws'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { GameSession } from './GameSession.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const BASE_PORT = parseInt(process.env.PORT || '3000', 10)
const MAX_ATTEMPTS = 10

app.use(express.static(join(__dirname, 'public')))

function startServer(attempt: number = 0): void {
  const port = BASE_PORT + attempt
  const server = createServer(app)

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE' && attempt < MAX_ATTEMPTS - 1) {
      console.log(`  Puerto ${port} ocupado → probando ${port + 1}`)
      startServer(attempt + 1)
    } else {
      console.error(`\n  ❌ Error: No se pudo iniciar en puerto ${port}`)
      console.error(`
  Para liberar el puerto en Windows:
     netstat -ano | findstr :3000
     taskkill /PID <PID> /F

  O usa otro puerto:
     set PORT=8080 && npm run web
`)
      process.exit(1)
    }
  })

  server.listen(port, () => {
    const wss = new WebSocketServer({ server })

    wss.on('connection', (ws) => {
      console.log('🔌 Cliente conectado')
      new GameSession(ws)
    })

    console.log(`
╔══════════════════════════════════════════╗
║     ⚔  TERMINAL RPG — WEB  ⚔            ║
║                                          ║
║  Servidor corriendo en:                  ║
║  http://localhost:${port}                  ║
╚══════════════════════════════════════════╝
`)
  })
}

startServer()
