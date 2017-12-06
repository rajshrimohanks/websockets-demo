import * as express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

const app = express();

console.log();

// initialize a simple http server
const server = http.createServer(app);

// initialize the WebSocket server instance
const wss = new WebSocket.Server({ server: server });

wss.on('connection', (ws: WebSocket) => {

  // send immediatly a feedback to the incoming connection
  ws.send('Hi there, I am a WebSocket server. You are client #' + wss.clients.size);

  //connection is up, let's add a simple simple event
  ws.on('message', (message: string) => {

    //log the received message and send it back to the client
    console.log('received: %s', message);

    const broadcastRegex = /^broadcast\:/;

    if (broadcastRegex.test(message)) {
      message = message.replace(broadcastRegex, '');

      //send back the message to the other clients
      wss.clients.forEach(client => {
        if (client != ws) {
          client.send(`Hello, broadcast message -> ${message}`);
        }
      });

    } else {
      ws.send(`Hello, you sent -> ${message}`);
    }
  });
});

// start our server
server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});
