const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require('firebase')
// const db = admin.firestore()
const app = require('express')()
const firebaseConfig = {
    apiKey: "AIzaSyBp5xEiAOvtlhmy6LwMEt3UcSnysYk_trg",
    authDomain: "meufirstproject.firebaseapp.com",
    databaseURL: "https://meufirstproject.firebaseio.com",
    projectId: "meufirstproject",
    storageBucket: "meufirstproject.appspot.com",
    messagingSenderId: "990480027010",
    appId: "1:990480027010:web:7cfcaa5e0a8a9fbd"
  };

firebase.initializeApp(firebaseConfig)
admin.initializeApp();

app.get('/telas', (req, res) => {
    admin.firestore().collection("telas")
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

app.post('/tela', (req, res) => {
    const novaTela = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createAt: new Date().toISOString()
    };
    admin.firestore().collection("telas")
      .add(novaTela)
      .then(doc => {
        res.json({message:  `Documento ${doc.id} criado com sucesso`})
      })
      .catch( erro => {
        res.status(500).json({erro : 'Algo deu errrado'})
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

    // Proxima etapa validar entrada (Next)

})

exports.api = functions.https.onRequest(app);

// Testes 
{
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
/** Teste de conexão com o firebase sem o uso do express, para testar conexão com o data base 
    exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello Jessica!");
    });

    exports.getScreems = functions.https.onRequest((req, res) => {
        admin.firestore()
            .collection("telas")
            .get()
            .then( (data) => {
                let telas = [];
                data.forEach( (doc) => {
                    telas.push(doc.data())
                });
            return res.json(telas);
            })
            .catch( (erro => console.error(erro) ))
    });

    exports.createScreem = functions.https.onRequest((req, res) => {
        if (req.method !== "POST")
            return res.status(400).json({erro : "Metodo não permitido"})
        const novaTela = {
            body: req.body.body,
            userHandle: req.body.userHandle,
            createAt: admin.firestore.Timestamp.fromDate(new Date())
        };

        admin.firestore()
            .collection('telas')
            .add(novaTela)
            .then(doc => {
                res.json({message:  `Documento ${doc.id} criado com sucesso`})
            })
            .catch( erro => {
                res.status(500).json({erro : 'Algo deu errrado'})
                console.error(erro) 
            })
    })
    ///////////////////////
        firebase
        .auth()
        .createUserWithEmailAndPassword(novoUser.email, novoUser.senha)
        .then(data => {
            return res.status(201).json({message : `Usuário ${data.user.uid} criado com sucesso!`})
        })
        .catch(erro => {
            console.error(erro)
            return res.status(500).json({ wrong: erro.code})
        })
 */
}