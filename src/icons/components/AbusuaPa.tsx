import * as React from "react";
import {type IconProps, trueSize} from "../props";


/**
 * AbusuaPa is a functional React component that renders an SVG icon.
 *
 * It uses `IconProps` to accept properties for customization such as size, color,
 * and any additional properties. The component defaults to a size of 24 and a color
 * of 'currentColor', ensuring it adapts to the inherited text color by default.
 */
const AbusuaPa: React.FC<IconProps> = ({size = 24, color = 'currentColor', ...props}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={trueSize(size)}
        height={trueSize(size)}
        fill={color}
        {...props}
    >
        <path
            fillRule="evenodd"
            d="M16.5 5.5a4.5 4.5 0 1 0-9 0h-2v2a4.5 4.5 0 0 0 0 9v2h2a4.5 4.5 0 0 0 9 0h2v-2a4.5 4.5 0 1 0 0-9v-2zm-11 8.828V9.673a2.328 2.328 0 0 0 0 4.655m13.721-.115a2.3 2.3 0 0 1-.721.115V9.673a2.327 2.327 0 0 1 .721 4.54M14.328 18.5H9.673a2.327 2.327 0 1 0 4.655 0M9.788 4.779a2.3 2.3 0 0 0-.115.721h4.655a2.327 2.327 0 0 0-4.54-.721M8.832 7.5h.834v.833h-.834zm0 1.333h.834v.834h-.834zm-.5-1.333v.833H7.5V7.5zm0 1.333H7.5v.834h.833zm2.667 0h-.833v.834H11zm0-.5h-.833V7.5H11zM7.5 11h.833v-.833H7.5zm1.333 0h.834v-.833h-.834zm1.334 0H11v-.833h-.833zM13 13v.833h.833V13zm0 1.333v.834h.833v-.834zm0 1.334v.833h.833v-.833zM13 11v-.833h.833V11zm-5.5 2v.833h.833V13zm1.333 0v.833h.834V13zm1.334 0v.833H11V13zM11 14.333h-.833v.834H11zm0 1.334h-.833v.833H11zm5.5-5.5V11h-.833v-.833zm-1.333 0V11h-.834v-.833zm.5 2.833h.833v.833h-.833zm-1.334 0h.834v.833h-.834zM13 9.667h.833v-.834H13zm0-1.334h.833V7.5H13zm1.333-.833h.834v.833h-.834zm0 1.333h.834v.834h-.834zm2.167 0h-.833v.834h.833zm-.833-.5h.833V7.5h-.833zm-.5 6h-.834v.834h.834zm.5 0h.833v.834h-.833zm-.5 1.334h-.834v.833h.834zm.5.833v-.833h.833v.833zm-6.834-2.167h.834v.834h-.834zm-.5 0H7.5v.834h.833zM7.5 15.667h.833v.833H7.5zm1.333 0h.834v.833h-.834z"
            clipRule="evenodd"
        />
    </svg>
);

export default AbusuaPa;
