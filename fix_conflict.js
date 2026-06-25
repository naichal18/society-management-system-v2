const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

// Split into lines
let lines = content.split('\n');

// Find the ======= separator (conflict divider)
const sepIdx = lines.findIndex(l => l.trim() === '=======');

if (sepIdx === -1) {
  console.log('No ======= separator found. Checking for remaining markers...');
} else {
  console.log(`Found ======= at line ${sepIdx + 1}`);
  // Keep only lines AFTER the ======= (the new/other branch version)
  // Drop everything from line 3 (<<<<<<< HEAD) through ======= 
  lines = lines.slice(sepIdx + 1);
  // Prepend the DOCTYPE and html tag
  lines.unshift('<html lang="en">', '<!DOCTYPE html>');
  // Fix order
  lines = ['<!DOCTYPE html>', '<html lang="en">', ...lines.slice(2)];
}

// Remove all remaining conflict markers
lines = lines.filter(l => {
  const t = l.trim();
  return !t.startsWith('<<<<<<<') && 
         !t.startsWith('>>>>>>>') && 
         t !== '=======';
});

const result = lines.join('\n');
fs.writeFileSync(filePath, result, 'utf8');
console.log('✅ Done! index.html conflict markers removed successfully.');
console.log(`Total lines in cleaned file: ${lines.length}`);
