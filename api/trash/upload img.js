'use strict';

const Helpers = use('Helpers');
const {format} = require('util');

var admin = require("firebase-admin");

const getStream = use('get-stream')

var fs = require('fs');

var streamToBuffer = require('stream-to-buffer')

var toArray = require('stream-to-array')



class FileController {
    async upload ({ request }) {
        const validationOptions = {
            
        };

        const bucket = admin.storage().bucket();

        const fileUploaded = request.file('custom-param-name', validationOptions);

        const blob = bucket.file(fileUploaded.stream.filename)
        const blobStream = blob.createWriteStream();


        blobStream.on('error', err => {
            console.log(err);
          });
        
          blobStream.on('finish', () => {
            // The public URL can be used to directly access the file via HTTP.
            const publicUrl = format(
                
              `https://storage.googleapis.com/${bucket.name}/${blob.name}`
            );
            return(publicUrl);
          });

          const fileContents = await getStream.buffer(fileUploaded.stream)
        
          blobStream.end(fileContents);

          console.log(fileUploaded)
        
          

        console.log(await toArray(fileUploaded)
  .then(function (parts) {
    const buffers = parts
      .map(part => util.isBuffer(part) ? part : Buffer.from(part));
    return Buffer.concat(buffers);
  }))


  



        await fileUploaded.move(Helpers.tmpPath('uploads'), {
            name:  ""+(Math.random() * (9999999999999999 + 9999999999999999) - 9999999999999999)+"-"+fileUploaded.clientName,
            overwrite: true,
        });

        if (!fileUploaded.moved()) {
            return fileUploaded.error();
        }
        return 'File uploaded';
    }
}

module.exports = FileController;