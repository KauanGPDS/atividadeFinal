const token =  require('jsonwebtoken')
const senhaJWt = require('./senhajwt')
const verificarUsuarioLogado = async (req,res,next) =>{
    const { authorization } = req.headers;

    if(!authorization){
        return res.status(401).json({mensagem:'Não Autorizado'})
    }
    const token1 = authorization.split(' ')[1];

    try{
       const tokenUsuario = token.verify(token1,senhaJWt)

       next()
    }catch(error){
        console.error(error.message);
    }
}

module.exports = verificarUsuarioLogado