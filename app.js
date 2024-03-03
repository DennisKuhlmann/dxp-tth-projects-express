const express = require('express');
const favicon = require('serve-favicon')
const session = require('express-session');
const path = require('path');
const helmet = require('helmet');
const crypto = require('crypto');
let app = express();

// Set view engine to ejs
app.set("view engine", "ejs");

// set sessionSecret
const sessionSecret = crypto.randomBytes(256).toString('hex');

// set Helmet CSP
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'https://code.jquery.com', 'https://cdn.jsdelivr.net', 'https://cdn.datatables.net']
        },
    },
    hidePoweredBy: true,
}));


// MIDDLEWARE
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(session({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true,
    cookie: {
        sameSite: 'strict',
        secure: false, // später auf true setzen, da wir das ganze über HTTPS setzen
    },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Router
const indexRouter = require("./routes/indexRouter");
const todolistRouter = require("./routes/todolistRouter");



app.use("/", indexRouter);
app.use("/todolist", todolistRouter);


// CREATE A SERVER
const port = 1138;
app.listen(port, () => {
    console.log(`May the code be with you on the Startrack to development excellence! 🌟🚀 The Server is running at: http://localhost:${port}`);
});
