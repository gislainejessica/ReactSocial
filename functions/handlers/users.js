const {admin} = require('../util/admin');
const firebase = require('firebase');
const config = require('../util/config');
const { validarRegistroDados, validarLoginDados } = require('../util/validadores');

firebase.initializeApp(config);

exports.registrar = (req, res) => {
    const novoUser = {
        email: req.body.email,
        senha: req.body.senha,
        confirmSenha: req.body.confirmSenha,
        handle: req.body.handle,
    }
    const {valid, erros} = validarRegistroDados(novoUser)
    if (!valid) 
        return res.status(400).json({erros})

    admin.firestore().doc(`/users/${novoUser.handle}`).get().then(doc => {
        if (doc.exists)
            return res.status(400).json({handle : "Esse usuário já existe"})
        else{
            return firebase.auth().createUserWithEmailAndPassword(novoUser.email, novoUser.senha)
                .then( data => {
                    userId = data.user.uid
                    return data.user.getIdToken()
                })
                .then( (idToken) => {
                    token = idToken
                    const userCredencial = {
                        handle:novoUser.handle,
                        email:novoUser.email,
                        createAt:new Date().toISOString(),
                        userId
                    }
                    return admin.firestore().doc(`/users/${novoUser.handle}`).set(userCredencial)
                })
                .then(() =>{
                    return res.status(201).json(token)
                })
                .catch(err => {
                    console.error(err)
                    if( err.code === "auth/email-already-in-use" ){
                        return res.status(400).json({ email: "Email já está sendo usado"})
                    }
                    else{
                        return res.status(500).json({error: err.code})
                    }
                })
        }
    })
};

exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        senha: req.body.senha
    }
    const {valid, erros} = validarLoginDados(user)
    if (!valid) 
        return res.status(400).json({erros})

    firebase.auth().signInWithEmailAndPassword(user.email, user.senha)
        .then(data => {
            return data.user.getIdToken()
        })
        .then(token => {
            return res.json({token})
        })
        .catch(erro => {
            console.error(erro)
            if (erro.code === "auth/user-not-found")
                return res.status(403).json({general: "Email ou senha errada, tente novamente!"})
            else
                return res.status(500).json({error: erro.code})
        })
};