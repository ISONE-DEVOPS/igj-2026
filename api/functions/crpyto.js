const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = '79769d9c3f591e8fca81932816af92b8';
const iv = crypto.randomBytes(16);

const encrypt = (text) => {

    
    const cipher = crypto.createCipheriv(algorithm, secretKey,  Buffer.from('237f306841bd23a418878792252ff6c8', 'hex'));

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  
    return encrypted.toString('hex')
    
};

const decrypt = (hash) => {

    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from('237f306841bd23a418878792252ff6c8', 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]);

    return decrpyted.toString();
};

module.exports = {
    encrypt,
    decrypt
};