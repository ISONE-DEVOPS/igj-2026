const ImgurStorage = require('multer-storage-imgur');
const multer = require('multer');
require('dotenv').config()

const uploadimg = multer({
    storage: ImgurStorage({ clientId: process.env.IMG_CLIENTID })
})

module.exports = uploadimg;    


