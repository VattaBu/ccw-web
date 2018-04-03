// import css of bulma
import 'bulma/css/bulma.css';
import 'react-datepicker/dist/react-datepicker.css';
import './globalStyles.css';

import React from 'react';
import ReactDOM from 'react-dom';
import Routers from './config/Routers';

ReactDOM.render(
  <Routers />,
  document.getElementById('root')
);