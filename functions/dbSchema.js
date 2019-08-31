// Esquema do como está armazenado os dados no banco de dadod 
const db = {
    telas: [{
        userHandle: 'user',
        body: 'O corpo da tela',
        createAt: '2019-08-28T18:25:08.345Z',
        likeCount: 3,
        comentCount: 2,
    }],

    users: [{
        userId:'zYjFLLOGotPDpCXn1gXxBDCse9N2',
        email:'u@email.com',
        handle: 'u',
        createAt: '2019-08-28T18:25:08.345Z',
        imageUrl: 'image/something/somenthing',
        bio: 'Alguma informação do usuario',
        website: 'www.vamosfazervaler.com.br',
        location:'São Paulo, BR'
    }]
};

const userDetails = {
    credencials: {
        userId: 'zYjFLLOGotPDpCXn1gXxBDCse9N2',
        email: 'u@email.com',
        handle: 'u',
        createAt: '2019-08-28T18:25:08.345Z',
        imageUrl: 'image/something/somenthing',
        bio: 'Alguma informação do usuario',
        website: 'www.vamosfazervaler.com.br',
        location:'São Paulo, BR'

    },
    likes: [{
        userHandle: 'jessica',
        telaId:'dkasoxcmoasjda'    
    },
    {
        userHandle: 'jessica',
        telaId:'dkhgfhedsfssa'  
    }]
}