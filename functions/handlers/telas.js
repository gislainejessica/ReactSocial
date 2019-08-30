const { admin } = require('../util/admin');

exports.getAllTelas =  (req, res) => {
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
};

exports.postOneTela = (req, res) => {
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
};