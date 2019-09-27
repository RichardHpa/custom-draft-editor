import React from 'react';
import './App.css';
import CustomDraft from './components/Draft/CustomDraft';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Custom Draft JS Editor</h1>
          <CustomDraft
            editorID="1"
          />
      </header>

    </div>
  );
}

export default App;
