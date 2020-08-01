// All the necessary imports. yadayada you get it
const express = require('express');

const app = express();
const server = require('http').createServer(app);
const { Database } = require('sqlite3');
const port = process.env.PORT;
const databasePath = process.env.DATABASEPATH;
const io = require('socket.io')(server);
const path = require('path');

// Import assets
app.use(express.static(path.join(__dirname + '/public')));

// Initialise the server with the counter value
let counter = 0;

// Database Connection
const db = new Database(databasePath, (error) => {
    if (error) {
        console.log('Exception detected.');
        throw error;
    }
    console.log('Connected to the in-memory SQLite database.');
});

db.serialize(() => {
    db.get('SELECT counter FROM main_counter', [], (error, row) => {
        if (!row || row.counter === undefined) {
            db.run('INSERT INTO main_counter (counter) VALUES ( 0 )');
            return console.log('Counter not found. Inserted a default value.');
        }
        counter = row.counter;
        return console.log('Connected to Main Counter');
    });
});

function updateCounter(updatedCounter) {
    db.run('UPDATE main_counter SET counter = ?', updatedCounter);
}

// Socket.io Webserver
io.on('connection', socket => {
    socket.emit('realValue', counter);
    socket.on('click', () => {
        counter+=1;
        updateCounter(counter);
        socket.broadcast.emit('realValue', counter);
        socket.emit('realValue', counter); 
    });
});

server.listen(port, () => {
    console.log('Server running');
});