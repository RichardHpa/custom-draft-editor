import React from 'react';
import './App.css';
import CustomDraft from './components/Draft/CustomDraft';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Custom Draft JS Editor</h1>
        <div>
          <CustomDraft
            editorID="1"
          />
        </div>
      </header>

    </div>
  );
}

export default App;
