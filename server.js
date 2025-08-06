const express = require("express")
const next = require("next")
const http = require("http")
const { Server } = require("socket.io")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const expressApp = express()
  const server = http.createServer(expressApp)
  const io = new Server(server)

  io.on("connection", (socket) => {
    console.log(" Client connected:", socket.id)

    socket.on("disconnect", () => {
      console.log(" Client disconnected:", socket.id)
    })

    socket.on("chat message", (msg) => {
      console.log("📨 Mesaj primit:", msg)
      io.emit("chat message", msg) 
    })
  })

    expressApp.use((req, res) => {
        return handle(req, res)
    })

  const PORT = process.env.PORT || 3000
  server.listen(PORT, () => {
    console.log(` Server on http://localhost:${PORT}`)
  })
})
