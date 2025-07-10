const fs = require('fs').promises;
const path = require('path');

const getFilePath = (filename) => path.join(__dirname, filename);

async function readJSON(filename) {
  try {
    const data = await fs.readFile(getFilePath(filename), 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeJSON(filename, data) {
  await fs.writeFile(getFilePath(filename), JSON.stringify(data, null, 2));
}

module.exports = { readJSON, writeJSON }; 