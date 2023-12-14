const path = require('path');
const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const passport = require('passport'); // Fix the import
const session = require('express-session');
const MongoStore= require('connect-mongo')
const morgan = require('morgan');

// Load config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport);

connectDB();

const app = express();
// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

// Method override

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and selete it
    let method= req.body._method
    delete req.body._method
    return method
  }
}))



// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// handlebars helpers
const {formatDate, stripTags, truncate, editIcon, select} = require('./helpers/hbs');
const { isNull } = require('util');

// Explicitly require and configure express-handlebars
const hbs = exphbs.create({helpers: {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
}, defaultLayout: 'main', extname: '.hbs' });
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

// Sessions
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      mongooseConnection: mongoose.connection,
    }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// set global var

app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'))
app.use('/stories' , require('./routes/stories'))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});



// const path = require('path')
// const express = require('express');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');
// const exphbs = require('express-handlebars');
// const passport= require('./config/db') 
// const session= require('express-session')
// const morgan = require('morgan');

// // Load config
// dotenv.config({ path: './config/config.env' });

// // Passport config
// require('./config/passport')(passport)

// connectDB();

// const app = express();

// // Logging
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// // Explicitly require and configure express-handlebars
// const hbs = exphbs.create({ defaultLayout: 'main', extname: '.hbs' });
// app.engine('.hbs', hbs.engine);
// app.set('view engine', '.hbs');

// // Sessions
// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {secure:true}
// }))

// // Passport middleware
// app.use(passport.initialize())
// app.use(passport.session())

// // Static folder
// app.use(express.static(path.join(__dirname, 'public')))

// // Routes
// app.use('/', require('./routes/index'));

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
// });







// const express = require('express')
// const dotenv= require('dotenv')
// const connectDB= require('./config/db')
// const exphbs = require('express-handlebars')
// const morgan= require('morgan')

// //Load config
// dotenv.config({path: './config/config.env'})

// connectDB()

// const app= express()

// // Logging
// if (process.env.NODE_ENV === 'development') {
//     app.use(morgan('dev'))
// }

// app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
// app.set('view engine', '.hbs');

// // Routes
// app.use('/', require('./routes/index'))




// const PORT= process.env.PORT || 3000

// app.listen(
//     PORT,
//     console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
// )
