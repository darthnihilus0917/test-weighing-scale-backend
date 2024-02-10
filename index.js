const WebSocket = require('ws');
const net = require('net');

const TCP_SERVER_IP = '127.0.0.1'; // Replace with your TCP server IP address
const TCP_SERVER_PORT = 3002;

const WS_SERVER_PORT = 3001;

const wss = new WebSocket.Server({ port: WS_SERVER_PORT });

const tcpClient = net.createConnection({ host: TCP_SERVER_IP, port: TCP_SERVER_PORT }, () => {
    console.log('Connected to TCP server');
});

tcpClient.on('data', data => {
    const weight = parseFloat(data.toString().trim());
    console.log('Received weight from TCP server:', weight);

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(weight.toFixed(2));
        }
    });
});

tcpClient.on('end', () => {
    console.log('Disconnected from TCP server');
});

wss.on('connection', ws => {
    console.log('WebSocket client connected');

    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });
});
