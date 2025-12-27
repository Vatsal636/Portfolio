const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, '..', 'assets', 'images', 'projects');

async function convertImage(file) {
  const ext = path.extname(file).toLowerCase();
  const base = path.basename(file, ext);
  const fullPath = path.join(imagesDir, file);

  try {
    const img = sharp(fullPath);

    // Convert to WebP
    await img.webp({ quality: 80 }).toFile(path.join(imagesDir, `${base}.webp`));

    // Convert to AVIF
    await img.avif({ quality: 50 }).toFile(path.join(imagesDir, `${base}.avif`));

    console.log(`Converted: ${file} -> ${base}.webp, ${base}.avif`);
  } catch (err) {
    console.error(`Failed to convert ${file}:`, err.message);
  }
}

function isRaster(file) {
  return /\.(png|jpe?g)$/i.test(file);
}

async function run() {
  const files = fs.readdirSync(imagesDir).filter(isRaster);
  if (files.length === 0) {
    console.log('No PNG/JPG images found to convert.');
    return;
  }
  for (const f of files) {
    await convertImage(f);
  }
  console.log('Conversion complete.');
}

run();
