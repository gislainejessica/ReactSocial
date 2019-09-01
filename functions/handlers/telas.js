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

exports.getTela = (req, res) => {
    let telaDados = {}
    admin.firestore().doc(`/telas/${req.params.telaId}`).get()
    .then(doc => {
        if (!doc.exists){
            return res.status(404).json({erro: "Tela não encontrada"})
        }
        telaDados = doc.data()
        telaDados.telaId = doc.id;
        return admin.firestore().collection('comments')
            .where('telaId', '==', req.params.telaId)
            .orderBy('createAt', 'desc')
            .get()
    })
    .then(data => {
        telaDados.comments = []
        data.forEach(doc => {
            telaDados.comments.push(doc.data())
        })
        return res.json(telaDados)
    })
    .catch(erro => {
        console.log(erro)
        return res.status(500).json({error: erro.code})
    })
};

exports.comentarNaTela = (req, res) => {
    if (req.body.body === '') return res.status(400).json({ erro: "Escreva alguma coisa, Porfa! "})
    const comentario = {
        body: req.body.body,
        telaId: req.params.telaId,
        userHandle: req.user.handle,
        createAt: new Date().toISOString(),
        userImage : req.user.imageUrl
    }
    // Verificar se a tela ainda existe para não fazer comentário no vazio
    admin.firestore().doc(`/telas/${req.params.telaId}`).get()
    .then(doc =>{
        if (!doc.exists)
            return res.status(404).json({errado: "Não encontrado"})
        return admin.firestore().collection('comments').add(comentario)
    })
    .then(() => {
        return res.json(comentario)
    })
    .catch( erro => {
        console.error(erro)
        return res.status(500).json({errrr: erro.code})
    })
};