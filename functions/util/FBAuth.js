const { admin } = require('../util/admin');

module.exports = (req, res, next) => {
    let idToken;
    if (req.headers.authorization ){
        idToken = req.headers.authorization.split("Bearer ")[1]
    }else{
        console.error('No token found (Cadê o token)')
        return res.status(402).json({error: 'Autorização negada'})
    }
    // Verificar se token tem um usuario identificado pelo sistema
    admin.auth().verifyIdToken(idToken)
    .then( decodedToken => {
        req.user = decodedToken
        console.log(decodedToken)
        return admin.firestore().collection('users')
        .where("userId","==", req.user.uid)
        .limit(1)
        .get()
    })
    .then(data => {
        req.user.handle =  data.docs[0].data().handle
        console.log(req)
        return next()
    })
    .catch(erro => {
        console.error('Erro durante a verificação', erro)
        return res.status(402).json({errou: 'Deu ruim na verificação'})
    })
};