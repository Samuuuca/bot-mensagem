const path = require('path');
const fs = require('fs/promises');
const process = require('process');
const { google } = require('googleapis');
const {authenticate} = require('@google-cloud/local-auth');


const SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.metadata.readonly'];

const TOKEN_PATH = path.resolve(__dirname, './credencials/token.json');
const CREDENTIALS_PATH = path.resolve(__dirname, './credencials/credencial.json');
const SPREADSHEET_ID = '1r8i2BTXvqZX8s8RaEEYDjx4ewkpwv5salsEbKpqKYwk'; //  1ztgYzsHmNzsM_pkhPuLAjWcgXqZ5HJx6YHcFvSkZVWU

async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {

  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);

  const key = keys.installed || keys.web;

  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });


  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {

  let client = await loadSavedCredentialsIfExist();

  if (client) {
    return client;
  }
  
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  if (client.credentials) {
    await saveCredentials(client);
  }

  return client;
}

async function planilhaEspecifica(authClient) {
  
  let csvFormat = '';
  const sheet = google.sheets({ version: 'v4', auth: authClient });
  try {
    const response = await sheet.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `A1:Z`
    })
    const linhas = response.data.values

    linhas.forEach((linha) => {
      csvFormat += linha.join(',') + '\n';
    })
    const caminhoArquivo = `./src/csv/contatosParaAvisar.csv`
    fs.writeFile(caminhoArquivo, csvFormat)

    return caminhoArquivo

  } catch (err) {

    throw err
  }
}

async function updatePlanilha(authClient , data) {

  const sheet = google.sheets({version: 'v4', auth: authClient});
  
  const resource = {
    data,
    valueInputOption: 'USER_ENTERED',
  };
  try{
    const result = await sheet.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      resource,
    })
    console.log('%d cells updated.', result.data.updatedCells);
  }
  catch (err){
    console.log(err)
  }

}

module.exports = {
  authorize,
  planilhaEspecifica,
  updatePlanilha
}


