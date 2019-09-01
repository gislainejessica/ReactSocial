const functions = require('firebase-functions');
const app = require('express')();
const { getAllTelas, postOneTela, getTela, comentarNaTela, likeTela, unlikeTela, deletaTela } = require('./handlers/telas');
const { registrar, login, upLoadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users');
const FBAuth = require('./util/FBAuth');

// Rota de telas // MiddleWare para verificar se usuario está logado no sistema (FBauth)
app.get('/telas', getAllTelas);
app.post('/tela', FBAuth, postOneTela);
app.get('/tela/:telaId', getTela);
app.post('/tela/:telaId/comment', FBAuth, comentarNaTela);

app.get('/tela/:telaId/like', FBAuth, likeTela);
app.get('/tela/:telaId/unlike', FBAuth, unlikeTela);
// Deletar tela
app.delete('/tela/:telaId', FBAuth, deletaTela);

// Rota de usuarios
app.post('/registrar', registrar);
app.post('/login', login);
app.post('/user/image',FBAuth, upLoadImage);

app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser)

exports.api = functions.https.onRequest(app);
// https://us-central1-meufirstproject.cloudfunctions.net/api/