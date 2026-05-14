const fs = require('fs');
const path = require('path');

const replacements = {
  '#14B0B0': '#0192c6',
  '14B0B0': '0192c6',
  '#14b0b0': '#0192c6',
  '14b0b0': '0192c6',
  '#1CDBDB': '#4abbee',
  '1CDBDB': '4abbee',
  '#1cdbdb': '#4abbee',
  '1cdbdb': '4abbee',
  '#21F8F8': '#aae1f6',
  '21F8F8': 'aae1f6',
  '#21f8f8': '#aae1f6',
  '21f8f8': 'aae1f6',
  '#AFFFFF': '#e6f6fb',
  'AFFFFF': 'e6f6fb',
  '#afffff': '#e6f6fb',
  'afffff': 'e6f6fb',
  '#0E9090': '#016a91',
  '0E9090': '016a91',
  '#0e9090': '#016a91',
  '0e9090': '016a91',
  '#D4EFEF': '#d1ecf7',
  'D4EFEF': 'd1ecf7',
  '#d4efef': '#d1ecf7',
  'd4efef': 'd1ecf7',
  '#E0FAFA': '#e6f6fb',
  'E0FAFA': 'e6f6fb',
  '#e0fafa': '#e6f6fb',
  'e0fafa': 'e6f6fb',
  '#0D2B2B': '#0a1c2b',
  '0D2B2B': '0a1c2b',
  '#0d2b2b': '#0a1c2b',
  '0d2b2b': '0a1c2b',
  '#061D1D': '#05131d',
  '061D1D': '05131d',
  '#061d1d': '#05131d',
  '061d1d': '05131d',
  'rgba(20, 176, 176': 'rgba(1, 146, 198',
  'rgba(20,176,176': 'rgba(1,146,198'
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.css') || file.endsWith('.js') || file.endsWith('.cjs')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');

let updatedFiles = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  
  for (const [oldVal, newVal] of Object.entries(replacements)) {
    newContent = newContent.split(oldVal).join(newVal);
  }
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    updatedFiles++;
    console.log('Updated: ' + file);
  }
});
console.log('Total files updated: ' + updatedFiles);
