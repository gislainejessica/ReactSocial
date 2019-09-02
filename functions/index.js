const functions = require('firebase-functions');
const app = require('express')();
const {admin} = require('./util/admin');
const FBAuth = require('./util/FBAuth');

const { getAllTelas,
        postOneTela, 
        getTela, 
        comentarNaTela, 
        likeTela, 
        unlikeTela, 
        deletaTela } = require('./handlers/telas');

const { registrar, 
        login, 
        upLoadImage, 
        addUserDetails, 
        getAuthenticatedUser,
        getUserDetails,
        marcarNotesLidos } = require('./handlers/users');

// Rota de telas // MiddleWare para verificar se usuario está logado no sistema (FBauth)
app.post('/tela', FBAuth, postOneTela);
app.post('/tela/:telaId/comment', FBAuth, comentarNaTela);
app.get('/tela/:telaId', getTela);
app.get('/tela/:telaId/like', FBAuth, likeTela);
app.get('/tela/:telaId/unlike', FBAuth, unlikeTela);
app.get('/telas', getAllTelas);
// Deletar tela
app.delete('/tela/:telaId', FBAuth, deletaTela);

// Rota de usuarios
app.post('/notifications', FBAuth, marcarNotesLidos)
app.post('/registrar', registrar);
app.post('/login', login);
app.post('/user', FBAuth, addUserDetails);
app.post('/user/image',FBAuth, upLoadImage);
app.get('/user/:handle', getUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);

// Notificações sairão da "rota principal" "/" camada mais alta pra monitorar os likes e comentarios processados
exports.createNotificationsOnLike = functions.firestore.document('likes/{id}').onCreate((snapshot) => {
        admin
        .firestore()
        .doc(`/telas/${snapshot.data().telaId}`)
        .get()
        .then( doc => {
            if (doc.exists){
                return admin
                    .firestore()
                    .doc(`/notifications/${snapshot.id}`)
                    .set({
                        createAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type:'like',
                        read:false,
                        telaId: doc.id
                    })
            }
        })
        .then(()=>{
            return
        })
        .catch(erro => {
            console.error(erro)
            return
        })
});
exports.createNotificationsOnUnlike = functions.firestore.document('likes/{id}').onDelete((snapshot) => {
    admin
    .firestore()
    .doc(`/notifications/${snapshot.id}`)
    .delete()
    .then(()=>{
        return
    })
    .catch(erro=>{
        console.error(erro)
        return
    })
});
exports.createNotificationsOnComment = functions.firestore.document('comments/{id}').onCreate((snapshot) => {
        admin
        .firestore()
        .doc(`/telas/${snapshot.data().telaId}`)
        .get()
        .then( doc => {
            if (doc.exists){
                return admin
                    .firestore()
                    .doc(`/notifications/${snapshot.id}`)
                    .set({
                        createAt: new Date().toISOString(),
                        recipient: doc.data().userHandle,
                        sender: snapshot.data().userHandle,
                        type:'comment',
                        read:false,
                        telaId: doc.id
                    })
            }
        })
        .then(()=>{
            return
        })
        .catch(erro => {
            console.error(erro)
            return
        })
});
