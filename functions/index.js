const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express')
const app = express()

admin.initializeApp();

app.get('/telas', (req, res) => {
    admin.firestore()
        .collection("telas")
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
    admin.firestore()
        .collection("telas")
        .add(novaTela)
        .then(doc => {
            res.json({message:  `Documento ${doc.id} criado com sucesso`})
        })
        .catch( erro => {
            res.status(500).json({erro : 'Algo deu errrado'})
            console.error(erro) 
        })
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
 */
}