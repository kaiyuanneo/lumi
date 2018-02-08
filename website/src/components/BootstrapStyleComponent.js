import React from 'react';

import * as constants from '../static/constants';


const BootstrapStyleComponent = () => (
  <link
    rel="stylesheet"
    href={constants.BOOTSTRAP_CSS_URL}
    integrity={constants.BOOTSTRAP_CSS_HASH}
    crossOrigin="anonymous"
  />
);

export default BootstrapStyleComponent;
