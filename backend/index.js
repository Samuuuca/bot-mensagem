const {authorize,planilhaEspecifica} = require('./src/googleapi-conecct.js')
const {gerarJson} = require('./src/gerarcsv.js')
const {enviarMensagem,iniciarWebWhatsapp} = require('./src/whatsapp-bot.js')


function iniciar(){
    iniciarWebWhatsapp()
}

async function ReadySendMessage(){

    try{

        await planilhaEspecifica(authorize())
        const contatos = await gerarJson()

        for (let i = 0; i < contatos.length; i++) {

            let mensagem = `Olá ${contatos[i].NOME}, se vc recebeu essa mensagem significa que o teste deu certo seu contato é ${contatos[i].NUMERO}`

            enviarMensagem(contatos[i].NUMERO, mensagem)
        }

    }
    catch (err){
        console.error
    }

    
}

iniciar()

module.exports.ReadySendMessage = ReadySendMessage