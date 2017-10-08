import * as React from 'react';
import { render } from 'react-dom';
import DrivetrainPage from './DrivetrainPage';

const renderApp = (App:any = DrivetrainPage) => 
    render(<App/>, document.getElementById('root'));

addEventListener('DOMContentLoaded', () => renderApp());

if (module.hot) {
    module.hot.accept(
        "./DrivetrainPage", 
        () => renderApp(require('./DrivetrainPage').default)
    );
} 