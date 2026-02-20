'use strict';

const {format} = require('util');

var admin = require("firebase-admin");

const getStream = use('get-stream')



class FileController {

    async upload ({ request, response }) { 


        response.implicitEnd = false

      
        await request.multipart.file('file', {}, async (file) => {
  
            file.size = file.stream.byteCount;
            await file._validateFile();

            const bucket = admin.storage().bucket();

            let newname = ""+file.stream.filename

            const blob = bucket.file(""+(Math.random() * (9999999999999999 + 9999999999999999) - 9999999999999999)+"-"+newname.replace(/[^a-z0-9.]/gi,''))
            const blobStream = blob.createWriteStream();


            blobStream.on('error', err => {
              response.status(500).json({status:"500 error"})
            });

          
            blobStream.on('finish', () => {
              // The public URL can be used to directly access the file via HTTP.
              const publicUrl = format(
                  
                `https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/${blob.name}`
              );

              response.send(publicUrl)

            });

            const fileContents = await getStream.buffer(file.stream)

            blobStream.end(fileContents)


    
      });
   


      await request.multipart.process();





    }

}

module.exports = FileController;