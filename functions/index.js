const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase')
// const db = admin.firestore() //&& req.headers.authorization.startWith("Bearer ")
const app = require('express')()

const firebaseConfig = {
    apiKey: "AIzaSyBp5xEiAOvtlhmy6LwMEt3UcSnysYk_trg",
    authDomain: "meufirstproject.firebaseapp.com",
    databaseURL: "https://meufirstproject.firebaseio.com",
    projectId: "meufirstproject",
    storageBucket: "meufirstproject.appspot.com",
    messagingSenderId: "990480027010",
    appId: "1:990480027010:web:4ffe42a49333ed56"
    };

firebase.initializeApp(firebaseConfig)
admin.initializeApp();

// Vericar se variavel de requisicão está vazia 
const isEmpty = (string) => {
    if (string.trim() === '') return true 
    else return false
}

const isEmail = (email) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(emailRegEx)) return true
    else return false
}

const FBAuth = (req, res, next) => {
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

}

app.get('/telas', (req, res) => {
    admin.firestore().collection('telas')
      .orderBy('createAt', 'desc')
      .get()
      .then( (data) => {
         let telas = [];
         data.forEach( (doc) => {
            telas.push({
            telaId : doc.id,
            body : doc.data().body,
            userHandle : doc. data().userHandle,
            createAt : doc.data().createAt,
            })
        });
    return res.json(telas);
    })
        .catch( (erro => console.error(erro) ))
})

// MiddleWare para verificar se usuario está logado no sistema (FBauth)
app.post('/tela', FBAuth, (req, res) => {
    const novaTela = {
        body: req.body.body,
        userHandle: req.user.handle, 
        createAt: new Date().toISOString()
    }
    admin.firestore().collection('telas')
      .add(novaTela)
      .then(doc => {
        res.json({message:  `Documento ${doc.id} criado com sucesso`})
      })
      .catch( erro => {
        res.status(500).json({erro : 'Algo deu muito errrado'})
        console.error(erro) 
      })
})

let token;
let userId;
// Rota de registro
app.post('/registrar', (req, res) => {
    const novoUser = {
        email: req.body.email,
        senha: req.body.senha,
        confirmSenha: req.body.confirmSenha,
        handle: req.body.handle,
    }
    let erros = {}
    // Verifica validade do email
    if (isEmpty(novoUser.email))
        erros.email = "Não pode ser vazio"
    else if (!isEmail(novoUser.email))
        erros.email = "Informe um email válido"
    // Verifica se Senha foi digitada
    if (isEmpty(novoUser.senha))
        erros.senha = "Não pode ser vazio"
    if (novoUser.confirmSenha !== novoUser.senha) 
        erros.confirmSenha = "Senhas devem ser iguais"
    // Handle not empty
    if (isEmpty(novoUser.handle))
        erros.handle = "Não pode ser vazio"
    // Vericar se algum erro foi encontrado nas entradas
    if (Object.keys(erros).length > 0) 
        return res.status(400).json(erros)

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

})

// Rota de login
app.post('/login', (req, res) => {
    const user = {
        email: req.body.email,
        senha: req.body.senha
    }
    let erros = {}
    // Verifica validade do email
    if (isEmpty(user.email))
        erros.email = "Não pode ser vazio"
    // Verifica se Senha foi digitada
    if (isEmpty(user.senha))
        erros.senha = "Não pode ser vazio"
    // Vericar se algum erro foi encontrado nas entradas
    if (Object.keys(erros).length > 0) 
        return res.status(400).json(erros)
    
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
})

exports.api = functions.https.onRequest(app);
