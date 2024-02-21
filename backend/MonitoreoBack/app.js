var createError = require('http-errors');
var express = require('express');
const cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(cors({ origin: '*' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/monitoreo', usersRouter);

console.log("Ruta de modelos:", path.resolve(__dirname, 'app', 'models'));
let models = require('./app/models');
models.sequelize.sync({ force: false, logging: false }).then(() => { //drop
  console.log("Se ha sincronizado la base de datos");
}).catch(err => {
  console.log(err, 'Hubo un error al sincronizar la base de datos');
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const cron = require('node-cron');
const { exec } = require('child_process');

// Ruta relativa al script de Python desde el script de Node.js
const rutaAlScriptPython = path.join(__dirname, 'app', 'controls', 'squechule', 'pronostico.py');

// Programa la tarea para las 10:10 PM todos los días
cron.schedule('00 02 * * *', () => {
  console.log("Ejecutando tarea a las 10:10 PM...");
  ejecutarScriptPython(rutaAlScriptPython);
});

function ejecutarScriptPython(scriptPath) {
  const comando = `python "${scriptPath}"`; // Encerrar la ruta en comillas dobles

  exec(comando, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al ejecutar el script: ${stderr}`);
    } else {
      console.log(`Script ejecutado exitosamente:\n${stdout}`);
    }
  });
}


module.exports = app;
