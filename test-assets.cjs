// Test script to verify all asset paths exist
const fs = require('fs');
const path = require('path');

const assetPaths = [
  './public/assets/gorbage-truck-2.png',
  './public/assets/trashbag.jpg',
  './public/assets/binlogo.png',
  './public/assets/intro_bg_new.png',
  './public/assets/ufo.png',
  './public/assets/gorbhouse-cry.png',
  './public/assets/Logo-gor-incinerator.jpg',
  './public/assets/Gorboyconsole.png',
  './public/assets/gorbillions.png',
  './public/assets/4.webp',
  './public/assets/stickerpill.webp',
  './public/assets/sticker3.webp',
  './public/assets/trashbag.png',
  './public/assets/trashcoinlogo.png',
  './public/assets/trashcoin.png',
  './public/assets/gorbagana.jpg',
  './public/assets/gorbagwallet-removebg-preview.png',
  './public/assets/wallet.png',
  './public/assets/incinerator.jpg',
  './public/assets/gorboyconsole.png'
];

console.log('=== ASSET PATH VERIFICATION ===\n');

let missingCount = 0;
let foundCount = 0;

assetPaths.forEach(assetPath => {
  const fullPath = path.join(__dirname, assetPath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    const stats = fs.statSync(fullPath);
    console.log(`✅ ${assetPath} (${(stats.size / 1024).toFixed(2)} KB)`);
    foundCount++;
  } else {
    console.log(`❌ MISSING: ${assetPath}`);
    missingCount++;
  }
});

console.log(`\n=== SUMMARY ===`);
console.log(`Found: ${foundCount}`);
console.log(`Missing: ${missingCount}`);
console.log(`Total: ${assetPaths.length}`);
