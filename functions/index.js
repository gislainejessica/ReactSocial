const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

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