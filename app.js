const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { connectToDb, getDb } = require('./models/mongodb');
const { v4: uuidv4 } = require('uuid');
const nocache = require('nocache');
const route = require('./routes/route');
const app = express();
const port = 4000;

app.use(nocache());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}));
app.use('/', route)

let db;

connectToDb((err) => {
    if (!err) {
        app.listen(port, () => {
            console.log(`http://localhost:${port}`);
        });
        db = getDb();

    }
});
