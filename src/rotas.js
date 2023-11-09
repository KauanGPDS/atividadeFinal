const express = require('express')
const { cadastraUsuario, login, pegaDadosUsuario, atualizaDados, retornaCategorias, retornaTransacoes, encontraTransacao, lancaTransacao, atualizaTransacoes, deleta, extrato} = require('./controladores/usuarios')
const verificarLogin = require('./autentificacao')

const rotas = express()

rotas.post('/usuario',cadastraUsuario)
rotas.post('/login',login)
rotas.use(verificarLogin)
rotas.get('/usuario',pegaDadosUsuario)
rotas.put('/usuario',atualizaDados)
rotas.get('/categorias',retornaCategorias)
rotas.get('/transacao',retornaTransacoes)
rotas.get('/transacao/:id',encontraTransacao)
rotas.post('/transacao',lancaTransacao)
rotas.put('/transacao/:id',atualizaTransacoes)
rotas.delete('/transacao/:id',deleta)
rotas.get('/extrato/:id',extrato)
module.exports = rotas