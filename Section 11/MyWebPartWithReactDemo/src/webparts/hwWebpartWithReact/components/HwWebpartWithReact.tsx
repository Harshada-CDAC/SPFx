import * as React from 'react';
import { IHwWebpartWithReactProps } from './IHwWebpartWithReactProps';

const HwWebpartWithReact: React.FC<IHwWebpartWithReactProps> = ({ absoluteurl, sitetitle, relativeurl, username }) => {
  return (
    <div>
      <h1>Hello World</h1>
      <p>Absolute URL: {absoluteurl}</p>
      <p>Site Title: {sitetitle}</p>
      <p>Relative URL: {relativeurl}</p>
      <p>Username: {username}</p>
    </div>
  );
};

export default HwWebpartWithReact;
