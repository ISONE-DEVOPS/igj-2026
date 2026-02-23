'use strict';

const path = require('path');
const fs = require('fs');

// Read logos from local files and convert to base64 data URIs
// This eliminates dependency on Firebase Storage for logos
const logoIgjPath = path.join(__dirname, '..', '..', '..', 'public', 'resources', 'logoigj.jpg');
const logoIgjBuffer = fs.readFileSync(logoIgjPath);
const IGJ_LOGO_DATA_URI = `data:image/jpeg;base64,${logoIgjBuffer.toString('base64')}`;

const logoMinisterioPath = path.join(__dirname, '..', '..', '..', 'public', 'resources', 'logominsterio.png');
const logoMinisterioBuffer = fs.readFileSync(logoMinisterioPath);
const MINISTERIO_LOGO_DATA_URI = `data:image/png;base64,${logoMinisterioBuffer.toString('base64')}`;

// Old Firebase Storage URLs that need to be replaced
const FIREBASE_LOGO_REPLACEMENTS = [
  // Main IGJ logo (sdfsdf.png)
  [/https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/igj-sgigj\.firebasestorage\.app\/o\/-4034664764483451-sdfsdf\.png\?alt=media&token=0/g, IGJ_LOGO_DATA_URI],
  // Alternative IGJ logo upload
  [/https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/igj-sgigj\.firebasestorage\.app\/o\/-2467355902521149-logoigj\.jpg\?alt=media&token=0/g, IGJ_LOGO_DATA_URI],
  // Ministry logo
  [/https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/igj-sgigj\.firebasestorage\.app\/o\/-4358817791332590-logominsterio\.png\?alt=media&token=0/g, MINISTERIO_LOGO_DATA_URI],
];

/**
 * Replace old Firebase logo URLs with embedded base64 data URIs in HTML content
 */
function replaceLogoInHtml(html) {
  if (!html) return html;
  let result = html;
  for (const [regex, replacement] of FIREBASE_LOGO_REPLACEMENTS) {
    result = result.replace(regex, replacement);
  }
  return result;
}

module.exports = { IGJ_LOGO_DATA_URI, MINISTERIO_LOGO_DATA_URI, replaceLogoInHtml };
