const express = require("express");
const app = express();
const bodyParser = require('body-parser');
//const fileUpload = require("express-fileupload");
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const mongoose = require("mongoose"),
  User = require("./models/user")

const port = process.env.PORT || 3000;
const userRoutes = require('./routes/user')

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    req.header('Access-Control-Allow-Methods', 'PUT,POST,GET,PATCH,DELETE,')
    return res.status(200).json({});
  }
  next();
});
app.use(express.json());
//app.use(fileUpload())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: '*'
}));

const url = process.env.DB
console.log(url)
mongoose
  .connect(url, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    //useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Db connected');
  })
  .catch((e) => {
    console.log(e, 'Failed to connect Db');
  });

  app.use('/api/v1/user', userRoutes);

app.listen(port, () => {
  console.log("server running on ", port);
})