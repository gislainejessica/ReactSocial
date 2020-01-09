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
app.post('/notifications', FBAuth, marcarNotesLidos);
app.post('/registrar', registrar);
app.post('/login', login);
app.post('/user', FBAuth, addUserDetails);
app.post('/user/image',FBAuth, upLoadImage);
app.get('/user/:handle', getUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);

// Notificações sairão da "rota principal" "/" camada mais alta pra monitorar os likes e comentarios processados
exports.createNotificationsOnLike = functions.firestore.document('likes/{id}').onCreate((snapshot) => {
       return admin
        .firestore()
        .doc(`/telas/${snapshot.data().telaId}`)
        .get()
        .then( doc => {
            if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle){
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
        .catch(erro => {
            console.error(erro)
        })
});
exports.createNotificationsOnUnlike = functions.firestore.document('likes/{id}').onDelete((snapshot) => {
   return admin
    .firestore()
    .doc(`/notifications/${snapshot.id}`)
    .delete()
    .catch( erro => { console.error(erro)})
});
exports.createNotificationsOnComment = functions.firestore.document('comments/{id}').onCreate((snapshot) => {
       return admin
        .firestore()
        .doc(`/telas/${snapshot.data().telaId}`)
        .get()
        .then( doc => {
            if (doc.exists  && doc.data().userHandle !== snapshot.data().userHandle){
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
        .catch(erro => {
            console.error(erro)
        })
});
// Se user mudar a foto do perfil a referencia na notificação e comments terão que ser atualizados
exports.onUserImageChange = functions.firestore.document(`users/{userId}`).onUpdate((changed) => {
    console.log(changed.before.data())
    console.log(changed.after.data())
    if (changed.before.data().imageURL !== changed.after.data().imageURL){
        console.log('Imagem foi modificada')
        let batch = admin.firestore().batch()
        return admin.firestore().collection('telas')
            .where("userHandle" ,"==", changed.before.data().userHandle)
            .get()
            .then( data => {
                data.forEach( doc => {
                    const tela = admin.firestore().doc(`/telas/${doc.id}`)
                    batch.update(tela, {imageUser: changed.after.data().imageURL})
                })
                return batch.commit()
            })
    }else{
        return true
    }

});
exports.onTelaDelete = functions.firestore.document(`telas/{telaId}`).onDelete((snapshot, context) => {
    const telaId = context.params.telaId
    const batch = admin.firestore().batch()
    return admin
        .firestore()
        .collection('comments')
        .where("telaId", "==", telaId)
        .get()
        .then(data => {
            data.forEach(doc =>{
                batch.delete(admin.firestore().doc(`/comments/${doc.id}`))
            })
            return admin.firestore().collection('likes').where("telaId", "==", telaId).get()
        })
        .then(data => {
            data.forEach(doc =>{
                batch.delete(admin.firestore().doc(`/likes/${doc.id}`))
            })
            return admin.firestore().collection('notifications').where("telaId", "==", telaId).get()
        })
        .then(data => {
            data.forEach(doc =>{
                batch.delete(admin.firestore().doc(`/notifications/${doc.id}`))
            })
            return batch.commit()
        })
        .catch( erro => {
            console.error(erro)
        })

});
