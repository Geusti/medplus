const fs = require('fs');
const path = require('path');

const generateJs = path.join(__dirname, 'generate.js');

// Run generate.js script to re-build index.html smoothly
require('./generate.js');

console.log('Build completed!');
