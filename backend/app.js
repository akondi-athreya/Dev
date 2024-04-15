var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const app = express();
app.use(bodyParser.json());
const cors = require('cors')
app.use(cors())
const mongoose = require('mongoose')
const DB = require('./models/table')

mongoose.connect("mongodb://localhost:27017/2nsStack",{
  useUnifiedTopology:true,
  useNewUrlParser: true
})

const db = mongoose.connection;
db.once('open',function(req,res){
  console.log("database connected successfully");
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//login
app.get("/login",function(req,res){
  res.send("Server Started");
  console.log('opend backend login page');
});
app.post('/login',function(req, res) {
  const userName = req.body.userName;
  const passWord = req.body.passWord;
  console.log('Received username:', userName);
  console.log('Received password:', passWord);
  async function getUser(name , key) {
    try {
      const user = await DB.findOne({user_name:name});
      if (user.user_name === name ) {
        if(user.pass_word === key){
          res.json(true);
          console.log('data found');
        }else if(user.pass_word != key ){
          res.status(996).json({error:'wrong password'});
          console.log('password wrong');
        }
      }else {
        res.json(false);
        console.log('data not found');
      }
    }catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  getUser(userName , passWord);
});

//register
app.get("/register",function(req,res){
  res.send("This is Register Page from Backed");
  console.log("opend register backend page");
});
app.post('/register',async (req,res) => {
  const email = req.body.email;
  const user = req.body.username;
  const pass = req.body.password;
  console.log({email,user,pass});
  const new_entry = [{Email : email,user_name : user,pass_word : pass},];
  DB.insertMany(new_entry)
    .then(() => {
      console.log('Data inserted successfully');
      res.status(200).send('Data inserted successfully');
  })
  .catch((err) => {
      console.error('Error inserting data:', err);
      res.status(500).send('Internal Server Error');
  });
});
//forgot password
let e_mail ="";
app.get('/check-email',function(req,res){
  res.send("This is for forgot password");
  console.log("user has forgotten the password 😂");
})
app.post('/check-email', async (req, res) => {
  const mail = req.body.eemail;
  console.log(mail);
  e_mail = mail;
  try {
    const user = await DB.findOne({ Email: mail });
    if (user) {
      res.send(true);
      console.log('email found');
    } else {
      res.send(false);
      console.log("email not found");
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

//password updation
app.get('/passwordUpdation',function(req,res){
  res.send("This is updation page");
  console.log("upadation page");
})
app.post('/passwordUpdation', async (req, res) => {
  const pass = req.body.pass_word;
  console.log(pass);
  try {
    const user = await DB.findOne({ Email: e_mail });
    if (user) {
      await DB.updateOne({ Email: e_mail }, { $set: { pass_word: pass } });
      console.log(`${e_mail}'s password is updated to ${pass}`);
      res.json("Password updated successfully");
    } else {
      console.error(`~~~ERROR: Email not found in database`);
      res.status(404).json("Email not found in database");
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json("Internal Server Error");
  }
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(2222,function(){
  console.log("Server is running at http://localhost:2222");
  console.log("http://localhost:2222/login");
  console.log("http://localhost:2222/register");
});
module.exports = app;
