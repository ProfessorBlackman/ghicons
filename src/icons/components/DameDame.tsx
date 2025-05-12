import * as React from "react";
import {type IconProps, trueSize} from "../props";

/**
 * DameDame is a functional React component that renders an SVG icon.
 *
 * It uses `IconProps` to accept properties for customization such as size, color,
 * and any additional properties. The component defaults to a size of 24 and a color
 * of 'currentColor', ensuring it adapts to the inherited text color by default.
 */
const DameDame: React.FC<IconProps> = ({size = 24, color = 'currentColor', ...props}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={trueSize(size)}
        height={trueSize(size)}
        fill={color}
        {...props}
    >
        <path
            d="M12 1a11 11 0 1 0 0 22 11 11 0 0 0 0-22m9.505 10.669h-2.806V10.18h-3.225V8.445h-1.737V5.22h-1.489V2.494a9.51 9.51 0 0 1 9.257 9.177zm-3.467-.827v2.316h-2.564v-2.313zm-7.279-2.4V5.878h2.316v2.567zm2.316 7.113v2.564h-2.316v-2.564zm-7.8-10.282a9.45 9.45 0 0 1 6.312-2.776v2.72h-1.488v3.228H8.362v1.737H5.135v1.489h-2.64a9.44 9.44 0 0 1 2.779-6.397zm3.087 5.568v2.316H5.798v-2.312zm-3.226 1.488v1.489h3.226v1.737h1.737v3.226h1.486v2.72a9.51 9.51 0 0 1-9.091-9.172zm13.59 6.395a9.45 9.45 0 0 1-6.477 2.783v-2.726h1.489v-3.226h1.737v-1.737H18.7v-1.489h2.806a9.44 9.44 0 0 1-2.781 6.396z"/>
    </svg>
);

export default DameDame;
