const { readFile, writeFile } = require('fs').promises;

(async () => {
  let tokens = await readFile('./data/tranformed.json');
  console.log(JSON.parse(tokens));
})();
