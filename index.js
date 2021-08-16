const express = require("express")
const app = express()
const wsServer = require("express-ws")(app)
const aWss = wsServer.getWss()

const port = process.env.PORT || 5000

app.ws("/", (ws) => {
    ws.on("message", msg => {
        msg = JSON.parse(msg)
        connectionHandler(ws, msg)
        console.log(msg)
    })
})

function connectionHandler(ws, msg) {
    ws.id = msg.id
    broadcastConnection(ws, msg)
}

function broadcastConnection(ws, msg) {
    aWss.clients.forEach(client => {
        if(client.id === msg.id) {
            client.send(JSON.stringify(msg))
        }
    })
}

app.listen(port, () => console.log(`Server started on port ${port}`))
