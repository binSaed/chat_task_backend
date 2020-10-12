const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');


const app = express();

app.use(express.json());
app.use(cors());

const server = require('http').createServer(app);
const io = socketIO(server);


let users = [];

io.on('connection', socket => {

	socket.on("user-in", (user) => {
		const newUser = {...user, socket};
		users.push(newUser);
		socket.emit("user-in");
	});

	socket.on("user-left", () => {
		users = users.filter(x => x.socket.id !== socket.id);
	});

	socket.on("disconnect", () => {
		users = users.filter(x => x.socket.id !== socket.id);
	});
	socket.on("send_message", (data) => {
		socket.broadcast.emit("receive_message", data)
	})

	socket.on("typing", (data) => {
		socket.broadcast.emit("typing", data)
	})

	socket.on("stop_typing", (data) => {
		socket.broadcast.emit("stop_typing", data)
	})

});
app.get('/', (req, res) => {
	res.json({message: 'This is a message from the server to verify that is Abdelrahman Saed is the owner'})
})
server.listen('8081', () => {
	console.log("Listening on port 8081");
});