const express = require('express');
const database = require('./config/database');
require('dotenv').config();

database.connect();
const route = require('./routes/client/index.route');

const app = express();
const port = process.env.PORT;

app.set('views', './views');
app.set('view engine', 'pug');

//nhúng file tĩnh
app.use(express.static('public'));

//route
route(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
