// Vericar se variavel de requisicão está vazia 
// /&& req.headers.authorization.startWith("Bearer ")

const isEmpty = (string) => {
    if (string.trim() === '') return true 
    else return false
};

const isEmail = (email) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(emailRegEx)) return true
    else return false
};

exports.validarRegistroDados = (data) => {
    let erros = {}
    // Verifica validade do email
    if (isEmpty(data.email))
        erros.email = "Não pode ser vazio"
    else if (!isEmail(data.email))
        erros.email = "Informe um email válido"
    // Verifica se Senha foi digitada
    if (isEmpty(data.senha))
        erros.senha = "Não pode ser vazio"
    if (data.confirmSenha !== data.senha) 
        erros.confirmSenha = "Senhas devem ser iguais"
    // Handle not empty
    if (isEmpty(data.handle))
        erros.handle = "Não pode ser vazio"

    return{
        erros,
        valid: Object.keys(erros).length === 0 ? true : false
    }
};

exports.validarLoginDados = (data) => {
    let erros = {}
    // Verifica validade do email
    if (isEmpty(data.email))
        erros.email = "Não pode ser vazio"
    // Verifica se Senha foi digitada
    if (isEmpty(data.senha))
        erros.senha = "Não pode ser vazio"
    return{
        erros,
        valid: Object.keys(erros).length === 0 ? true : false
    }
};