const express = require("express");
const socketio = require("socket.io");
const path = require("path");

const http = require("http");


const app = express();
const server = http.createServer(app);
const io = socketio(server);


app.set('view engine','ejs');
app.use(express.static(path.join(__dirname,'public')));


io.on("connection",function(socket){
    console.log("User connected");
    socket.on("send-location",function(data){
        io.emit("receive-location",{id:socket.id,...data});
    });

    socket.on("dissconnect",function(){
        io.emit("user-disconnected",socket.id);
    })

    
})


app.get("/",(req,res)=>{
    res.render('index');
});

server.listen(3000,(req,res)=>{
    console.log("server is running on 3000 Port");
})

