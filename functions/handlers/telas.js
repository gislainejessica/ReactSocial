//     .limite(1) like and unlike

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
                userImage: doc.data().userImage
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
        imageUrl: req.user.imageUrl,
        createAt: new Date().toISOString(),
        likeCount: 0,
        commentCount:  0
    }
    admin.firestore()
    .collection('telas')
    .add(novaTela)
    .then(doc => {
        const resTela = novaTela
        resTela.telaId = doc.id
        res.json(resTela)
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
    // trim()
    if (req.body.body === '') 
        return res.status(400).json({ comment: "Escreva alguma coisa, Porfa! "})
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
        return doc.ref.update({commentCount: doc.data().commentCount + 1})
    })
    .then(()=> {
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

exports.likeTela = (req, res) => {
    const likeComment = admin
        .firestore()
        .collection('likes')
        .where('userHandle', '==', req.user.handle)
        .where('telaId', '==', req.params.telaId)
        .limit(1)

    const telaDoc = admin
        .firestore()
        .doc(`/telas/${req.params.telaId}`)
    
        let telaDado;

    telaDoc
        .get()
        .then(doc => {
            if (doc.exists){
                telaDado = doc.data()
                telaDado.telaId = doc.id
                return likeComment.get()
            }else{
                return res.status(404).json({ erro: 'not found' })
            }
        })
        .then(data => {
            if (data.empty){
                return admin.firestore().collection('likes').add({
                    telaId: req.params.telaId,
                    userHandle: req.user.handle
                })
                .then(()=> {
                    telaDado.likeCount++
                    return telaDoc.update({likeCount: telaDado.likeCount})
                })
                .then(()=> {
                    return res.json(telaDado)
                })
            }else{
                return res.status(400).json({erro: 'Já gostou'})
            }
        })
        .catch(erro => {
            console.error(erro)
            res.status(500).json({error: erro.code})
        })
};

exports.unlikeTela = (req, res) => {
    
    const unlikeComment = admin
    .firestore()
    .collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('telaId', '==', req.params.telaId)
    .limit(1)

const telaDoc = admin
    .firestore()
    .doc(`/telas/${req.params.telaId}`)
    let telaDado;

    telaDoc
        .get()
        .then(doc => {
            if (doc.exists){
                telaDado = doc.data()
                telaDado.telaId = doc.id
                return unlikeComment.get()
            }else{
                return res.status(404).json({ erro: 'not found' })
            }
        })
        .then(data => {
            if (data.empty){
                return res.status(400).json({erro: 'Não gostou ainda'})
            }else{
                admin.firestore().doc(`/likes/${data.docs[0].id}`).delete()
                .then(()=> {
                    telaDado.likeCount--
                    return telaDoc.update({likeCount: telaDado.likeCount})
                })
                .then(()=> {
                    res.json(telaDado)
                })
            }
        })
        .catch(erro => {
            console.error(erro)
            res.status(500).json({error: erro.code})
        })
};

exports.deletaTela = (req, res) => {
    const documento = admin.firestore().doc(`/telas/${req.params.telaId}`)
    documento.get()
    .then(doc => {
        if (!doc.exists)
            return res.status(404).json({erro: "Não encontrei a tela amigão"})
        if (doc.data().userHandle !== req.user.handle)
            return res.status(403).json({erro: "Não tá autorizado a deletar"})
        else
            return documento.delete()
    })
    .then(() => {
        res.json({message: "Deletada com sucesso"})
    })
    .catch((erro => {
        console.error(erro)
        return res.status(500).json({errorr: erro.code})
    }))
};
