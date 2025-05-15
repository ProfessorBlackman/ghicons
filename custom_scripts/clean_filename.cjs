const fs = require('fs');
const path = require('path');

// Get the folder path from the command-line argument
const svgFolder = process.argv[2];

if (!svgFolder) {
    console.error('Please provide a folder path as a command-line argument.');
    process.exit(1);
}

// Function to capitalize each word
const capitalizeWords = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

// Function to sanitize the filename to match JS variable/React component naming rules
const sanitizeName = (name) => {
    const nameWithSpaces = name.replace("-", ' ').replace("_", ' ');
    const nameList = nameWithSpaces.split(" ");
    // Capitalize each word and join them without spaces
    const capitalizedName = nameList.map((word) => capitalizeWords(word)).join("");
    // Remove invalid characters and ensure the name starts with a valid character
    const sanitized = capitalizedName.replace(/[^a-zA-Z0-9_$]/g, '').replace(/^[^a-zA-Z_$]+/, '');
    return capitalizeWords(sanitized);
};

// Read all files in the specified folder
fs.readdir(svgFolder, (err, files) => {
    if (err) {
        console.error('Error reading the folder:', err);
        return;
    }

    files.forEach((file) => {
        const oldPath = path.join(svgFolder, file);

        // Skip directories
        if (fs.lstatSync(oldPath).isDirectory()) return;

        // Extract the file name and extension
        const ext = path.extname(file).toLowerCase();
        const baseName = path.basename(file, ext);

        // Sanitize the filename and ensure lowercase extension
        const sanitizedBaseName = sanitizeName(baseName);
        const newFileName = `${sanitizedBaseName}${ext}`;
        const newPath = path.join(svgFolder, newFileName);

        // Rename the file
        fs.rename(oldPath, newPath, (err) => {
            if (err) {
                console.error(`Error renaming file ${file}:`, err);
            } else {
                console.log(`Renamed: ${file} -> ${newFileName}`);
            }
        });
    });
});