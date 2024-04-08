import './App.css';
import { useState } from 'react';
import Notes from "./components/Notes"

function App() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      text: "Hello Pd"
    },
    {
      id: 2,
      text: "By Pd"
    }
  ])

  return (
    <div className="App">
      <Notes notes={notes} setNotes={setNotes} />
    </div>
  );
}

export default App;
