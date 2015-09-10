/**
 * Created by haojing on 15-9-9.
 */
//    服务器
//    有两个功能一个是添加用户一个是聊天
var express = require('express');
var path = require('path');
var app = express();

app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
  res.render('practice');
})

var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.set('log level', 1);//将socket.io中的debug信息关闭
var usernames = {};
var numUser = 0;
var addMessage = [];

io.on('connection', function (socket) {
  //回调函数socket参数是一个client与服务器连接标示,不同clint会有不同的连接标示

  //不分组，数据传输
  //socket.emit:传输对象是当前socket对用的client,各个client socket互不影响
  //socket.broadcast.emit:信息传输对象为所有client，排除当前socket对应的client。
  //io.sockets.emit:信息传输对象为所有client。
  //分组数据传输
  //of方法用来生成命名空间来管理用户,socket.io可以使用分组方法socket.join(),以及对应socket.leave()

  //test
  socket.emit('news', {mes: 'hello world'});

  //客户端传来name用于加用户到聊天室

  socket.on('add user', function (data) {
    usernames[data.name] = data.name;
    socket.name = data.name;
    numUser++;
    io.sockets.emit('login', {username: socket.name, number:numUser});//发送到所有的客户端
    console.log('添加用户:', data.name, ' 现在用户数是:', numUser);
  });
  socket.on('talking', function (data) {
    if(addMessage.length <= 10) {
      console.log(data.mes)
      addMessage.push({name: socket.name, mes: data.mes, time: new Date().toUTCString()});
    } else {
      console.log(data.mes)
      addMessage[0] = {name: socket.name, mes: data.mes,time: new Date().toUTCString()};
    }
    console.log(addMessage.length);
    io.sockets.emit('talked', {allMes: addMessage});
  })


})
//要注意不要写成app了
server.listen(8080);

