import React from 'react';
import ReactDOM from 'react-dom';
import Container from './components/Container';
import Heading from './components/Heading';
// import TestComp from './components/TestComp';

const App = () => {
    return (
        <div>
            <Heading/>
            <Container />
            {/* <TestComp /> */}
        </div>
    );
};


ReactDOM.render(
    // Note the strict mode, runs in dev only, highlights potential problems
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('insertPoint'));