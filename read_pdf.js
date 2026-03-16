const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('./Manual_Integracio_n_API_2_3.pdf');

pdf(dataBuffer).then(function(data) {
  fs.writeFileSync('getnet_manual_extracted.txt', data.text);
  console.log('PDF extracted successfully. Look at getnet_manual_extracted.txt');
}).catch(err => {
  console.error("Error parsing PDF:", err);
});
