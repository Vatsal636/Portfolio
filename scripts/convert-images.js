/**
 * Image Conversion Utility
 * Converts images to modern formats (AVIF, WebP) for better performance
 */

const fs = require('fs');
const path = require('path');

const projectsDir = path.join(__dirname, '../assets/images/projects');

console.log('🖼️  Image Conversion Utility');
console.log('==========================\n');

// Check if the projects directory exists
if (!fs.existsSync(projectsDir)) {
    console.error('❌ Error: Projects directory not found!');
    console.log(`Expected path: ${projectsDir}`);
    process.exit(1);
}

// List all image files in the projects directory
const files = fs.readdirSync(projectsDir);
const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext);
});

console.log(`Found ${imageFiles.length} image(s) in the projects folder:\n`);

imageFiles.forEach((file, index) => {
    const filePath = path.join(projectsDir, file);
    const stats = fs.statSync(filePath);
    const sizeInKB = (stats.size / 1024).toFixed(2);
    console.log(`  ${index + 1}. ${file} (${sizeInKB} KB)`);
});

if (imageFiles.length === 0) {
    console.log('  No images found. Please add project images to:');
    console.log(`  ${projectsDir}\n`);
} else {
    console.log('\n✅ Image inventory complete!');
    console.log('\n💡 Tip: To convert images to AVIF or WebP format, use:');
    console.log('   - Online tools like Squoosh (https://squoosh.app/)');
    console.log('   - Command-line tools like sharp-cli or imagemagick');
    console.log('   - Or install sharp: npm install sharp\n');
}

// Expected project images
const expectedImages = [
    'dayflow.avif',
    'ecommerce.avif',
    'hostel.avif',
    'jobportal.avif',
    'library.avif',
    'mototrack.avif',
    'pft.avif',
    'tbms.avif',
    'urban.avif'
];

console.log('📋 Expected project images:');
expectedImages.forEach(img => {
    const exists = fs.existsSync(path.join(projectsDir, img));
    const status = exists ? '✅' : '❌';
    console.log(`  ${status} ${img}`);
});

console.log('\n🎉 Done!');
