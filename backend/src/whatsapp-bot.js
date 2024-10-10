const {Client} = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const {ReadySendMessage} = require('./ReadySensMessage')


const client = new Client()

client.on('qr', (qr)=>{
    qrcode.generate(qr, {small: true});
})

client.on('ready',async ()=>{
    console.log('Conexão com o whatsapp bem sucedida')
    enviarMensagem( await ReadySendMessage())
})

async function enviarMensagem(contatos){

    for (let i = 0; i < contatos.length; i++) {
        let mensagem = `Olá ${contatos[i].NOME}, se vc recebeu essa mensagem significa que o teste deu certo seu contato é ${contatos[i].NUMERO}`;
        await client.sendMessage(`${contatos[i].NUMERO}@c.us`, mensagem);
    }
    
}

function iniciarWebWhatsapp(){
    client.initialize()
}


module.exports = {
    iniciarWebWhatsapp,
    enviarMensagem
}