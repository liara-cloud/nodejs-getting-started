const { createServer } = require('http');
const staticHandler = require('serve-handler');
const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;

//serve static folder
const server = createServer((req, res) => {
    return staticHandler(req, res, { public: 'public' })
});

const wss = new WebSocketServer({ server });

wss.on('connection', (client) => {
    console.log('Client connected !')
    client.on('message', (msg) => {
        console.log(`Message:${msg}`);
        broadcast(msg)
    })
})

function broadcast(msg) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(msg)
        }
    });
}

server.listen(process.argv[2] || 8080, () => {
    console.log(`server listening...`);
});
