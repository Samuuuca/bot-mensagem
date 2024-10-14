const {Client, MessageMedia} = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const {ReadySendMessage} = require('./ReadySensMessage')
const {updatePlanilha,authorize} = require('./googleapi-conecct')



const client = new Client()

client.on('qr', (qr)=>{
    qrcode.generate(qr, {small: true});
})

client.on('ready',async ()=>{
    console.log('Conexão com o whatsapp bem sucedida')
    enviarMensagem( await ReadySendMessage())
})

async function enviarMensagem(contatos){

    let values = [
        [
          'TRUE'
        ],
      ];
    const data = [];

    for (let i = 0; i < contatos.length; i++) {

        if(contatos[i].NUMERO.startsWith('55') || contatos[i].AVISADO != 'TRUE'){
            let mensagem = `Olá ${contatos[i].NOME}, TESTE A BLUEBLUE \n ${contatos[i].NUMERO}`;
            
            data.push({
                range: `C${i+2}`,
                values,
            })
            
            await client.sendMessage(`${contatos[i].NUMERO}@c.us`, MessageMedia.fromFilePath('./src/img/image_name.jpg'))
            await client.sendMessage(`${contatos[i].NUMERO}@c.us`, mensagem);

            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    try {
        const auth = await authorize();
        await updatePlanilha(auth, data);
    } catch (error) {
        console.error(error);
    }
}

function iniciarWebWhatsapp(){
    client.initialize()
}


module.exports = {
    iniciarWebWhatsapp,
    enviarMensagem
}