const functions = require('firebase-functions');
const app = require('express')();
const { getAllTelas, postOneTela } = require('./handlers/telas');
const { registrar, login, upLoadImage } = require('./handlers/users');
const FBAuth = require('./util/FBAuth');

// Rota de telas // MiddleWare para verificar se usuario está logado no sistema (FBauth)
app.get('/telas', getAllTelas);
app.post('/tela', FBAuth, postOneTela);
// Rota de usuarios
app.post('/registrar', registrar);
app.post('/login', login);
app.post('/user/image',FBAuth, upLoadImage);

exports.api = functions.https.onRequest(app);
