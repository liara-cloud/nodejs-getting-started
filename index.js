const { createServer } = require('http');
const staticHandler = require('serve-handler');
const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;

// Serve static folder
const server = createServer((req, res) => {
    return staticHandler(req, res, { public: 'public' });
});

const wss = new WebSocketServer({ server });

wss.on('connection', (client, req) => {
    // Extract username from query parameter
    const urlParams = new URLSearchParams(req.url.slice(1)); // remove leading '/'
    const username = urlParams.get('username') || 'Anonymous';

    // Add username to client object for future use
    client.username = username;

    // Send a welcome message to the newly connected client
    client.send(`Welcome, ${username}!`);

    // Broadcast incoming messages to all clients
    client.on('message', (msg) => {
        const messageToSend = `[${username}]: ${msg}`;
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(messageToSend);
            }
        });
    });

    // Handle client disconnection
    client.on('close', () => {
        console.log(`Client ${username} disconnected`);
    });
});

server.listen(process.argv[2] || 3000, () => {
    console.log(`Server listening...`);
});
