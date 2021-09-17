const mongoose = require("mongoose"),
    express = require("express"),
    passport = require("passport"),
    path = require('path'),
    LocalStrategy = require("passport-local"),
    expressSession = require("express-session"),
    cookieParser = require('cookie-parser'),
    methodOverride = require("method-override"),
    User = require("./models/userModel"),
    Blog = require("./models/blogModel"),
    List = require("./models/toDoListModel"),
    Cv = require("./models/cvModel"),
    Message = require("./models/messageModel"),
    Conversation = require("./models/conversation"),
    socket = require("socket.io"),
    moment = require('moment'),
    React = require('react'),
    mongoClient = require('mongodb').MongoClient,
    formidable = require('formidable'),
    http = require('http'),
    util = require('util');
    bodyParser = require("body-parser"),
    multer = require("multer"),
    
    chatCollection = 'messages'; //tüm sohbetleri saklamak için toplama
    
    dbname = 'MyBlogApp';
userCollection = 'onlineUsers'; //Şu anda çevrimiçi olan kullanıcıların listesini tutmak için toplama
database = 'mongodb://localhost:27017/';
app = express();



//ROUTES

const appRoutes = require("./routes/appRoutes");
adminRoutes = require("./routes/adminRoutes");
blogRoutes = require("./routes/blogRoutes");
listRoutes = require("./routes/toDoListRoutes");
cvRoutes = require("./routes/cvRoutes");
messagesRoutes = require("./routes/messagesRoutes");
conversationRoutes = require("./routes/conversationRoutes");

moment.locale('tr');

const formatMessage = (data) => {
    msg = {
        date:moment().format("DD-MM-YYYY"),
        time:moment().format("LTS"),
        sender: data.senderId,
        receiverid: data.receiverId,
        text: data.msg
       
       }
    return msg;
}




//App Config
mongoose.connect("mongodb://localhost/MyBlogApp");
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

//passport config
app.use(cookieParser());
app.use(require("express-session")({
    secret: "Bu Güvenli Cümledir",
    resave: false,
    saveUninitialized: true
}));



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//share current user info within all routes

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});


//Routes Using


app.use(appRoutes);
app.use(adminRoutes);
app.use(blogRoutes);
app.use(listRoutes);
app.use(cvRoutes);
app.use("/messages", messagesRoutes);
app.use("/conversations", conversationRoutes);




const server = app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    }
    console.log("3000 Portu Açıldı", server.address().port);
});



var io = socket(server);


app.get('/messenger', function (req, res) {

    User.find( (err, users) => {
        Message.find((err, messages) => {
            Cv.find((err, cv) => {
                Conversation.find((err,room)=>{               
                res.render("chat/messenger", {
                    foundUsers: users,
                    foundMessages: messages,
                    foundCv: cv,
                    userInfo:req.user,
                    room:room
                    
                });
 });
            });
        });
    });
});



io.sockets.on("connection", (socket) => {

    socket.on("chatMessage", (data) => {

        console.log(data);


        var dataElement = formatMessage(data);

        
        mongoClient.connect(database, (err,db) => {
            if (err)
                throw err;
            else {
                var onlineUsers = db.db(dbname).collection(userCollection);
                var chat = db.db(dbname).collection(chatCollection);
                
                chat.insertOne(dataElement, (err,res) => { //veritabanına mesaj ekler

                    if(err) throw err;
                    socket.emit('message',dataElement); //görüntülenmesi için kullanıcıya geri mesaj yayar
                    
                });
                onlineUsers.findOne({"name":data.toUser}, (err,res) => { //mesajın alıcısının çevrimiçi olup olmadığını kontrol eder
                    if(err) throw err;
                    if(res!=null) //alıcı çevrimiçi bulunursa, mesaj kendisine gönderilir.

                        socket.to(res.ID).emit('message',dataElement);
                });
            }
            db.close();
        });

    });

    socket.on('userDetails',(data) => { //yeni bir kullanıcının oturum açıp açmadığını kontrol eder ve yerleşik sohbet ayrıntılarını alır
        mongoClient.connect(database, (err,db) => {
            if(err)
                throw err;
            else {
                var onlineUser = { //kullanıcı ayrıntıları için JSON nesnesi oluşturur

                    "ID":socket.id,
                    "name":user.id
                };
                var currentCollection = db.db(dbname).collection(chatCollection);
                var online = db.db(dbname).collection(userCollection);
                online.insertOne(onlineUser,(err,res) =>{ //oturum açmış kullanıcıyı çevrimiçi kullanıcılar koleksiyonuna ekler
                    if(err) throw err;
                    console.log(onlineUser.name + " is online...");
                });
                currentCollection.find({ //iki kişi arasındaki tüm sohbet geçmişini bulur

                    members : { "$in": [data.senderId,data.receiverId] },
                    
                },{projection: {_id:0}}).toArray((err,res) => {
                    if(err)
                        throw err;
                    else {
                        //console.log(res);
                        socket.emit('output',res); //tüm sohbet geçmişini istemciye yayar

                    }
                });
            }
            db.close();
        });   
    });  
    var userId = socket.id;
    socket.on('disconnect', () => {
        mongoClient.connect(database, function(err, db) {
            if (err) throw err;
            var onlineUsers = db.db(dbname).collection(userCollection);
            var myquery = {"ID":userId};
            onlineUsers.deleteOne(myquery, function(err, res) { //bir kullanıcının bağlantısı kesilirse, çevrimiçi kullanıcı koleksiyonundan çıkarılır

              if (err) throw err;
              console.log("User " + userId + " went offline...");
              db.close();
            });
          });
    });
});

app.use(express.static(path.join(__dirname,'front')));
 



// var io = socket(server);


// app.get("/messenger", function (req, res) {
//     res.render("chat/messenger");
// });

// var users =[];

// io.on('connection',(socket)=>{

//     console.log("User socket id: ",socket.id);

//     socket.on("user_connected",(username)=>{

//         users[username] = socket.id;

//         io.emit("user_connected",username);

//         console.log("username: " + username);

//     });

//     socket.on('chat',data=>{
//         io.sockets.emit('chat',data)
//     })

//     socket.on('typing',data=>{
//         socket.broadcast.emit('typing',data)
//     })

// })


