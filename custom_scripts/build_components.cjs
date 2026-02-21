const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');
const {optimize} = require('svgo');
const pcp = require('picocolors');

// Command line arguments parsing
const args = process.argv.slice(2);
const overwrite = args.includes('--overwrite') || args.includes('-o');

// Filter out options from arguments to get positional parameters
const positionalArgs = args.filter(arg => !arg.startsWith('-'));

const svgsDir = positionalArgs[0] || 'svg';
const componentsBaseDir = positionalArgs[1] || 'src/icons/components';

if (!fs.existsSync(svgsDir)) {
    console.error(pcp.red(`Source SVG directory does not exist: ${svgsDir}`));
    process.exit(1);
}

function getRelativeImportPath(componentDir, importPath) {
    const relativePath = path.relative(componentDir, importPath);
    // Ensure the path uses forward slashes and starts with './' if necessary
    const normalizedPath = relativePath.split(path.sep).join('/');
    return normalizedPath.startsWith('.') ? normalizedPath : `./${normalizedPath}`;
}

async function generateIconComponent(svgPath, targetDir) {
    const svgContent = await fsPromises.readFile(svgPath, 'utf-8');
    const filename = path.basename(svgPath, '.svg');
    const componentName = filename.replace(/[^a-zA-Z0-9]+/g, ''); // Basic sanitization
    const componentFilePath = path.join(targetDir, `${componentName}.tsx`);

    // Check if the component file already exists
    if (fs.existsSync(componentFilePath) && !overwrite) {
        console.log(pcp.yellow(`Skipping ${componentName}.tsx as it already exists.`));
        return;
    }

    if (!fs.existsSync(targetDir)) {
        await fsPromises.mkdir(targetDir, {recursive: true});
    }

    console.log(pcp.blue(`${overwrite && fs.existsSync(componentFilePath) ? 'Overwriting' : 'Processing'} SVG: ${filename}`));

    const optimizedSvg = optimize(svgContent.toString(), { /* svgo config */});
    const svgElement = optimizedSvg.data.match(/<svg[^>]*>([\s\S]*)<\/svg>/)?.[0] || '';

    const propsImportPath = getRelativeImportPath(targetDir, "src/icons/props");

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

    await fsPromises.writeFile(componentFilePath, componentCode.trim() + '\n', 'utf-8');
    console.log(pcp.green(`Generated ${componentName}.tsx`));
    await addToIndexFile(componentName, targetDir);
}

// function to add the component to the index file
async function addToIndexFile(componentName, targetDir) {
    const indexPath = "src/index.ts";
    const importPathInIndex = getRelativeImportPath("src", targetDir);
    const exportStatement = `export { default as ${componentName} } from '${importPathInIndex}/${componentName}';\n`;
    
    let indexContent = "";
    if (fs.existsSync(indexPath)) {
        indexContent = await fsPromises.readFile(indexPath, 'utf-8');
    }

    if (indexContent.includes(exportStatement)) {
        return;
    }

    await fsPromises.appendFile(indexPath, exportStatement, 'utf-8');
    console.log(pcp.green(`Added ${componentName} to index.ts`));
}

async function processDirectory(currentSvgDir, currentTargetDir) {
    const files = await fsPromises.readdir(currentSvgDir, { withFileTypes: true });
    
    for (const file of files) {
        const fullPath = path.join(currentSvgDir, file.name);
        if (file.isDirectory()) {
            await processDirectory(fullPath, path.join(currentTargetDir, file.name));
        } else if (file.name.endsWith('.svg')) {
            await generateIconComponent(fullPath, currentTargetDir);
        }
    }
}

async function generateAllIcons() {
    console.log(pcp.blue('Starting SVG to component generation...'));
    await processDirectory(svgsDir, componentsBaseDir);
    console.log(pcp.green('All components processed successfully!'));
}

generateAllIcons().catch((error) => console.error(pcp.bgRed(` Error: ${error.message} `)));
