const { authorize, planilhaEspecifica } = require('./googleapi-conecct.js');
const {gerarJson} = require('./gerarcsv.js');

async function ReadySendMessage() {
    try {
        await authorize().then(planilhaEspecifica).catch(console.error)
        const contatos = await gerarJson();

        return contatos
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    ReadySendMessage
}
