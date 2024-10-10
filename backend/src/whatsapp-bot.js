const {Client} = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const {ReadySendMessage} = require('../index.js')


const client = new Client()

client.on('qr', (qr)=>{
    qrcode.generate(qr, {small: true});
})

client.on('ready',async ()=>{
    console.log('Conexão com o whatsapp bem sucedida')
    await ReadySendMessage()
})

async function enviarMensagem(numero, mensagem){
    client.sendMessage(`${numero}@c.us`, mensagem)
}

function iniciarWebWhatsapp(){
    client.initialize()


}


module.exports = {
    iniciarWebWhatsapp,
    enviarMensagem
}