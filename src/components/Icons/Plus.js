import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
const SvgPlus = props => (
  <Svg
    width="24"
    height="24"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M8 4v4m0 0v4m0-4h4M8 8H4"
      // stroke="#ECEBED"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SvgPlus;
