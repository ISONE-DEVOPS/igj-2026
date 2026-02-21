'use strict';

const { format } = require('util');

var admin = require("firebase-admin");

const getStream = use('get-stream')


var pdf = require('html-pdf');
const puppeteer = require("puppeteer");



const pdfCreater = async (data) => {
  let promise = new Promise(async (resolve, reject) => {
    let browser;

    // pdf.create(data.content, { "format": "A4", "border": "0", "type": "pdf" }).toBuffer(function (err, buffer) {
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();

      // Viewport A4 a 96dpi
      await page.setViewport({ width: 794, height: 1123 });

      // Load HTML
      await page.setContent(data.content, {
        waitUntil: "networkidle0",
      });

      // Create PDF buffer - formato A4 com margens normais
      const buffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' },
      });

      await browser.close();


      const bucket = admin.storage().bucket();

      let newname = "" + data.tipo

      const blob = bucket.file("pdf-generator" + (Math.random() * (9999999999999999 + 9999999999999999) - 9999999999999999) + "-" + newname.replace(/[^a-z0-9.]/gi, ''))
      const blobStream = blob.createWriteStream(
        {
          contentType: "application/pdf",
        }
      );


      blobStream.on('error', err => {

        reject({ status: false, type: err, url: null })

      });


      blobStream.on('finish', () => {
        // The public URL can be used to directly access the file via HTTP.
        const publicUrl = format(

          `https://firebasestorage.googleapis.com/v0/b/igj-sgigj.firebasestorage.app/o/${blob.name}`

        );

        resolve({ status: true, type: "ok", url: publicUrl })

        console.log(publicUrl)

      });

      //const fileContents = await getStream.buffer(file.stream)

      blobStream.end(buffer)




      //console.log('This is a buffer:', Buffer.isBuffer(buffer));


      // });
    } catch (err) {
      if (browser) await browser.close();
      reject({ status: false, type: err, url: null });
    }

  })

  return promise




}





module.exports = pdfCreater;