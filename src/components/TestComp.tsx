import React, {useState, useEffect} from 'react';

const TestComp = () => {
    const [tester, setTester] = useState('test');

    const clickTest = () => {
        setTester('toast');
        console.log('tester: ', tester);
    }
    return (
        <>
            <h1 onClick={() => clickTest()}>Testing</h1>
            <h3>{tester}</h3>
        </>
    )
}

export default TestComp;