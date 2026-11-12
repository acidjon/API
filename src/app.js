const express= require("express");
const {engine}= require("express-handlebars");
const myConnection= require("express-myconnection");
const mysql= require("mysql");
const session= require("express-session");
const bodyParser= require("body-parser");
const app= express();
const loginRoutes= require("./routes/login.js");

app.set("port", 4000);

app.set("views", __dirname+"/views");

app.engine(".hbs", engine({
    extname: ".hbs"
}));

app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json());

app.use(myConnection(mysql, {
    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
    database: "login_node"
}));

app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));

app.listen(app.get("port"), ()=>{
    console.log("Listen on port: ", app.get("port"));
})

app.use("/", loginRoutes);

app.use(express.static("public"));

app.get("/", (req, res)=>{
    if(req.session.loggedin){
        res.render("home", {name: req.session.name});
    } else {
        res.redirect("/login");
    }
});