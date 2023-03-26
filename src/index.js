import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Router, Route, Switch, Redirect, withRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import Game from './components/Game';

ReactDOM.render(
    <>
        <Game/>
    </>, document.getElementById('root'));
