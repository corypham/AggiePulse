import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconStudySpacesProps {
  width: number;
  height: number;
  fill: string;
}

const IconStudySpaces: React.FC<IconStudySpacesProps> = ({ width, height, fill }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 18 15" fill="none">
      <Path d="M16.8 0C14.2646 0.010875 12.3799 0.36 11.016 0.963375C9.99825 1.41338 9.6 1.75387 9.6 2.90737V15C11.1589 13.5938 12.5422 13.2 18 13.2V0H16.8ZM1.2 0C3.73538 0.010875 5.62013 0.36 6.984 0.963375C8.00175 1.41338 8.4 1.75387 8.4 2.90737V15C6.84113 13.5938 5.45775 13.2 0 13.2V0H1.2Z" fill={fill}/>
    </Svg>
  );
};

export default IconStudySpaces;
