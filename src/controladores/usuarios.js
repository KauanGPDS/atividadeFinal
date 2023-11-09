const conexao = require('../conexao')
const bcrypt = require('bcrypt')
const token =  require('jsonwebtoken')
const senhaJWt = require('../senhajwt')
const now = require('date-now');
const timestamp = now();

const cadastraUsuario = async (req,res) =>{
    const {nome,email,senha} = req.body

    try{
        const query = 'insert into usuarios(nome, email, senha) values($1,$2,$3) returning id,nome,email'
        
        const criptografaSenha = await bcrypt.hash(senha,10)
        const ativa = await conexao.query(query,[nome,email,criptografaSenha])
        return res.status(200).json(ativa)

    }catch(error){
        console.log(error.message)
    }
} 

const login = async (req,res)=>{
    const {email,senha} = req.body

    try{
       const usuario = 'select *from usuarios where email = $1'
       const executa = await conexao.query(usuario,[email])
       if(executa.rowCount <1){
        return res.status.json({mensagem:'Email ou Senha Invalido'})
       }
       const senhaValida = await bcrypt.compare(senha,executa.rows[0].senha)
       if(!senhaValida){
        return res.status.json({mensagem:'Email ou Senha Invalido'})
       }
      
       const tokenParaLogin =  token.sign({id:executa.rows[0].id},senhaJWt,{expiresIn:'8h'})
       const {senha:_,...usarioLogado} = executa.rows[0]
       

       return res.json({Usuario_Logado:usarioLogado,tokenParaLogin})
    }catch(eror){
        console.log(eror.message)
    }
}

const pegaDadosUsuario = async (req,res) =>{
    const { authorization } = req.headers;
    const token1 = authorization.split(' ')[1];
    const {id} =token.verify(token1,senhaJWt)
    
    try{
       const query = 'select id,nome,email from usuarios where id = $1'
       
       const executado = await conexao.query(query,[id])
       if(executado.rowCount < 1){
        return res.json({mensagem:"usuario não encontrado"})
       }
       
       res.status(200).json({Usuario:executado.rows})
    }catch(error){
        console.log(error.message)
    }
}

const atualizaDados = async (req,res) =>{
    const { authorization } = req.headers;
    const token1 = authorization.split(' ')[1];
    const {id} =token.verify(token1,senhaJWt)
    const {nome,email,senha} = req.body

    try{
       
        const verificarEmail = 'select * from usuarios where email = $1'
        const executado2 = await conexao.query(verificarEmail,[email])
        if(executado2.rowCount != 0){
            return res.json({mensamge:"email ja existe "})
        }
        const criptografaSenha = await bcrypt.hash(senha,10)
        const query = 'update usuarios set nome = $1, email = $2,senha = $3 where id = $4 returning *'
        const executado = await conexao.query(query,[nome,email,criptografaSenha,id])
        res.status(200).json({Usuario:executado.rows})
        
    }catch(error){
        console.log(error.message)
    }

}

const retornaCategorias = async (req,res) =>{
    try{
       const query = 'select * from categorias'
       const executa = await conexao.query(query)
       return res.json({Categorias:executa.rows})
    }catch(error){
        console.log(error.message)
    }
}

const retornaTransacoes = async (req,res) =>{
    try{
        const query = 'select * from transcoes'
        const exeuta = await conexao.query(query)
        return res.json({Transacoes:exeuta.rows})

    }catch(error){
        console.log(error.mesage)
    }

}

const encontraTransacao = async (req,res) =>{
    const {id} = req.params
    try{
      const query = 'select * from transcoes where id = $1'
      const executa = await conexao.query(query,[id])
      if(executa.rowCount < 1){
        return res.json({mensagem:'Não Encontrado'})
      }
      return res.status(200).json({Transacoes:executa.rows})
    }catch(error){
        console.log(error.message)
    }
}

const lancaTransacao = async (req,res) =>{
    const {descricao,valor,data,categoria_id,usuario_id,tipo} = req.body
    try{
        const query = 'insert into transacoes(descricao,valor,categoria_id,tipo,data,usuario_id) values($1,$2,$3,$4,$5,$6) returning *'
        const executa = await conexao.query(query,[descricao,valor,categoria_id,tipo,data,usuario_id])
        return res.status(200).json({transacoes:executa.rows})

    }catch(error){
         console.log(error.message)
    }
}

const atualizaTransacoes = async (req,res) =>{
    const {id} = req.params
    const {descricao,valor,data,categoria_id,tipo} = req.body
    try{
    const query = 'UPDATE transacoes SET descricao = $1,valor = $2,data = $3,categoria_id = $4,tipo = $5 WHERE id = $6 returning *';
    const executa = await conexao.query(query,[descricao,valor,data,categoria_id,tipo,id])

    res.json({Transacao_Atualizada:executa.rows})
    }catch(error){
        console.log(error.message)
    }
}

const deleta = async (req,res) =>{
   const {id} = req.params
   try{
    const query = 'delete from transacoes where id = $1'

    const executa = conexao.query(query,[id])

    return res.status(204).json({})

   }catch(error){
    console.log(error.message)
   }
}
const extrato = async (req,res) =>{
    const {id} = req.params
    try{
        const query = 'select tipo from transacoes where usuario_id = $1'
        const cexecuta = await conexao.query(query,[id])
        const mostra = {
            
        }

        return res.json({Extrato:cexecuta.rows})
    }catch(error){
            console.log(error.message)
    }
}
module.exports = {cadastraUsuario,login,pegaDadosUsuario,atualizaDados,retornaCategorias,retornaTransacoes,encontraTransacao,lancaTransacao,atualizaTransacoes,deleta,extrato}