import React from 'react';

function App() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <button onClick={handleClick}>Click Me</button>
    </div>
  );
}

export default App;
