const express = require('express');
var methodOverride = require('method-override');
const database = require('./config/database');
const systemConfig = require('./config/system');
require('dotenv').config();

database.connect();
const routeAdmin = require('./routes/admin/index.route');
const routeClient = require('./routes/client/index.route');

const app = express();
app.use(methodOverride('_method'));
const port = process.env.PORT;

app.set('views', './views');
app.set('view engine', 'pug');

//nhúng file tĩnh
app.use(express.static('public'));

//App locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

//route
routeAdmin(app);
routeClient(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
