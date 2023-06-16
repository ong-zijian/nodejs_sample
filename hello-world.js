// this imports the http module using require. 
//This helps create the http server and making http request
// If using https: use `require('https)` and get the 
const http = require('node:http');

// can set your hostname and port 
// for hosted apps, e.g. Heroku, they will provide the hostname
const hostname = '127.0.0.1';
const port = 3000;

// Creates the server method. There is a callback function as argument.
const server = http.createServer((req, res) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World!\n');
});

// listen to the server and make it listen for incoming request
server.listen(port, hostname, ()=> {
    console.log(`Server running at http://${hostname}:${port}/`);
});