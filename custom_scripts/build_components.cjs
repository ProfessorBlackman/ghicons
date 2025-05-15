const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const {optimize} = require('svgo');
const pcp = require('picocolors');

// get the folder path from the command-line argument
const svgsDir = process.argv[2];
const componentsDir = process.argv[3];

if (!svgsDir || !componentsDir) {
    console.error(pcp.red( "Please provide the source SVG directory and the target component directory as arguments."));
    process.exit(1);
}

if (!fs.existsSync(svgsDir)) {
    console.error(pcp.red(`Source SVG directory does not exist: ${svgsDir}0`));
    process.exit(1);
}
if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, {recursive: true});
    console.log(pcp.yellow(`Created target directory: ${componentsDir}`));
}

function getRelativeImportPath(componentDir, importPath) {
    const relativePath = path.relative(componentDir, importPath);
    // Ensure the path uses forward slashes and starts with './' if necessary
    return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

const propsImportPath = getRelativeImportPath(componentsDir, "src/icons/props")

async function generateIconComponent(svgPath) {
    const svgContent = await fsPromises.readFile(svgPath, 'utf-8');
    const filename = path.basename(svgPath, '.svg');
    const componentName = filename.replace(/[^a-zA-Z0-9]+/g, ''); // Basic sanitization
    const componentFilePath = path.join(componentsDir, `${componentName}.tsx`);

    // Check if the component file already exists
    if (fs.existsSync(componentFilePath)) {
        console.log(pcp.yellow(`Skipping ${componentName}.tsx as it already exists.`));
        return;
    }

    console.log(pcp.blue(`Processing SVG: ${filename}`));

    const optimizedSvg = optimize(svgContent.toString(), { /* svgo config */});
    const svgElement = optimizedSvg.data.match(/<svg[^>]*>([\s\S]*)<\/svg>/)?.[0] || '';

    const componentCode = `
    import * as React from "react";
    import { type IconProps, trueSize } from '${propsImportPath}';

    /**
     * ${componentName} is a functional React component that renders an SVG icon.
      *
     * It uses \`IconProps\` to accept properties for customization such as size, color,
     * and any additional properties. The component defaults to a size of 24 and a color
     * of 'currentColor', ensuring it adapts to the inherited text color by default.
     */
    const ${componentName}: React.FC<IconProps> = ({ size = 24, color = 'currentColor', viewBox= "0 0 24 24", ...props }) => (
      ${svgElement.replace(/<svg\b[^>]*>/, " <svg xmlns='http://www.w3.org/2000/svg' width={trueSize(size)} height={trueSize(size)} fill={color} viewBox={viewBox} {...props}>")}
    );

    export default ${componentName};
  `;

    await fsPromises.writeFile(componentFilePath, componentCode, 'utf-8');
    console.log(pcp.green(`Generated ${componentName}.tsx`));
    await addToIndexFile(componentName);
}

// function to add the component to the index file
async function addToIndexFile(componentName) {
    const indexPath = "src/index.ts";
    const exportStatement = `export { default as ${componentName} } from '${getRelativeImportPath("src", componentsDir)}/${componentName}';\n`;
    await fsPromises.appendFile(indexPath, exportStatement, 'utf-8');
    console.log(pcp.green(`Added ${componentName} to index.ts`));
}

async function generateAllIcons() {
    console.log(pcp.blue('Starting SVG to component generation...'));
    const svgFiles = await fsPromises.readdir(svgsDir);
    for (const file of svgFiles) {
        if (file.endsWith('.svg')) {
            await generateIconComponent(path.join(svgsDir, file));
        }
    }
    console.log(pcp.green('All components generated successfully!'));
}

generateAllIcons().catch((error) => console.log(`\\033[0;41m Error: ${error.message}\x1b[0m`));