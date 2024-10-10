const csvtojson = require('csvtojson')
const fs = require('fs/promises');
const path = require('path');

async function gerarJson() {
    
  try{

    const CSV_PATH = path.resolve(__dirname,'./csv/contatosParaAvisar.csv');
    await fs.stat(CSV_PATH)
    let contatos = await csvtojson().fromFile(CSV_PATH);

    return contatos;
  
  }catch(err){
    
    console.log(err)
  }
}

module.exports={
  gerarJson
}