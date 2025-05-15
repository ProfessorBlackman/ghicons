const React = require("react");

function template({ componentName, jsx }, { tpl }) {
  const { openingElement, children } = jsx;
  const svgProps = openingElement.attributes.reduce((acc, attr) => {
    if (attr.type === 'JSXAttribute') {
      acc[attr.name.name] = attr.value.type === 'StringLiteral' ? `"${attr.value.value}"` : `{${attr.value.expression.name}}`;
    }
    return acc;
  }, {});

  return tpl`
    import * as React from "react";
    import { type IconProps, trueSize } from "../props";

    /**
     * ${componentName.name} is a functional React component that renders an SVG icon.
     *
     * It uses \`IconProps\` to accept properties for customization such as size, color,
     * and any additional properties. The component defaults to a size of 24 and a color
     * of 'currentColor', ensuring it adapts to the inherited text color by default.
     */
    const ${componentName}: React.FC<IconProps> = ({ size = 24, color = 'currentColor', ...props }) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={trueSize(size)}
        height={trueSize(size)}
        fill={color}
        {...props}
        ${Object.entries(svgProps)
          .map(([key, value]) => `${key}=${value}`)
          .join(' ')}
      >
        ${children}
      </svg>
    );

    export default ${componentName};
  `;
}

module.exports = template;