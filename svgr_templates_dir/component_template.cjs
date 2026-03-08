function defaultTemplate(
  { template },
  opts,
  { componentName, jsx }
) {
  const typeScriptTpl = template.smart({ plugins: ['typescript'] });
  return typeScriptTpl.ast`
    import * as React from 'react';
    
    interface IconProps extends React.SVGProps<SVGSVGElement> {
      size?: number | string;
      color?: string;
      ariaLabel?: string;
    }

    export const ${componentName} = ({ size = 24, color = 'currentColor', ariaLabel, ...props }: IconProps) => {
      const isDecorative = !ariaLabel;
      return ${jsx}
    };
  `;
}

module.exports = defaultTemplate;