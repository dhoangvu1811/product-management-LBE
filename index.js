const express = require('express');
const path = require('path');
var methodOverride = require('method-override');
const database = require('./config/database');
const systemConfig = require('./config/system');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

database.connect();
const routeAdmin = require('./routes/admin/index.route');
const routeClient = require('./routes/client/index.route');

const app = express();
app.use(methodOverride('_method'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.PORT;

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

/* Flash */
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false, // Không lưu lại session nếu không thay đổi
        saveUninitialized: false, // Chỉ lưu session khi có dữ liệu
        cookie: { maxAge: 60000, secure: false }, // Đặt `secure: true` nếu chạy trên HTTPS
    })
);
app.use(flash());
/* End flash */

/* TinyMCE */
app.use(
    '/tinymce',
    express.static(path.join(__dirname, 'node_modules', 'tinymce'))
);
/* End tinyMCE */

//nhúng file tĩnh
app.use(express.static(`${__dirname}/public`));

//App locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

//route
routeAdmin(app);
routeClient(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
