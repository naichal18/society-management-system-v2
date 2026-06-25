const fs = require('fs');
const file = 'c:/Users/admin/Desktop/society management system/index.html';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\/\* function doLogin_old\(\)\{[\s\S]*?localStorage\.setItem\('role','admin'\);\s*\n\s*\n/, '');

fs.writeFileSync(file, content);
console.log('Fixed');
