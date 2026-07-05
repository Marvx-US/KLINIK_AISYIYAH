const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const targetDirs = [
  path.join(__dirname, '..', 'src', 'app', '(public)'),
  path.join(__dirname, '..', 'src', 'components', 'sections'),
  path.join(__dirname, '..', 'src', 'components', 'layout')
];

let replacedCount = 0;

targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    walkDir(dir, function(filePath) {
      if (filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('max-w-7xl mx-auto')) {
          content = content.replace(/max-w-7xl mx-auto /g, 'w-full ');
          // Juga antisipasi kalau spasi di belakang tidak ada
          content = content.replace(/"max-w-7xl mx-auto"/g, '"w-full"');
          
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Replaced in ${filePath}`);
          replacedCount++;
        }
      }
    });
  }
});

console.log(`Total files updated: ${replacedCount}`);
