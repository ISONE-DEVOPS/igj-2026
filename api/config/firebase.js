
var admin = require("firebase-admin");
const Env = use('Env')

try {

    admin.initializeApp({
      credential: admin.credential.cert({
        "type": "service_account",
        "project_id": Env.get('PROJECT_ID',""),
        "private_key_id": Env.get('PRIVATE_KEY_ID',""),
        "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
        "client_email": Env.get('CLIENT_EMAIL',""),
        "client_id": Env.get('CLIENT_ID',""),
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": Env.get('CLIENT_X509_CERT_URL',""),
      }
      ),
      storageBucket:Env.get('STORAGEBUCKET',"")
  });

}catch(err) {
  console.log(err)
}


