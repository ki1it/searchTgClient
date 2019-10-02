var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


const { Client } = require('telegram-client')



async function main() {
  const client = new Client({
    apiId: process.env.apiId,
    apiHash: process.env.apiHash
  })

  try {
    await client.connect('user', process.env.phone)

    client.on('__updateNewMessage', (res) => {
      if (res.message.chat_id !== process.env.sendTo) {
        if (res.message.content.text.text.search('Mi 9') !== -1 ||
            res.message.content.text.text.search('Redmi Note 8 Pro') !== -1) {
          client.sendMessage(process.env.sendTo, res.message.content.text.text);
          console.log(res.message.content.text.text)
        }
      }
    })

  } catch(e) {
    console.error('ERROR', e)
  }
}
main()
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
