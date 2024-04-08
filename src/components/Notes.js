import React, { useEffect, useRef, createRef } from 'react';
import Note from "./Note";

const Notes = ({
  notes = [],
  setNotes = () => {}
}) => {

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    const updatedNotes = notes.map(note => {
      const savedNote = savedNotes.find(n => n?.id == note.id);
      if(savedNote) {
        return {
          ...note,
          position: savedNote?.position
        }  
      }
      const position = getNewPosition();
      return {...note, position}
    });

    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
  }, [notes.length])

  function getNewPosition() {
    const maxX = window.innerWidth - 250;
    const maxY = window.innerHeight - 250;
    return {
      x: Math.floor(Math.random() * maxX),
      y: Math.floor(Math.random() * maxY)
    }
  }

  const noteRefs = useRef([]);

  function handleDragStart(note, event) {
    const {id} = note;
    const noteRef = noteRefs.current[id].current;
    const rect = noteRef.getBoundingClientRect();
    console.log(rect, "rect is::");
    const offSetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const startPosition = note.position;

    const handleMouseMove = (e) => {
      const newX = e.clientX - offSetX;
      const newY = e.clientY - offsetY;
      noteRef.style.left=`${newX}px`;
      noteRef.style.top=`${newY}px`;
    }

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      const finalRect = noteRef.getBoundingClientRect();
      const newPosition = {
        x: finalRect.x,
        y: finalRect.y
      }

      if(checkForOverlap(id)) {
        noteRef.style.left = `${startPosition.x}px`;
        noteRef.style.top = `${startPosition.y}px`;
      } else {
        updateNotePosition(id, newPosition)
      }
    }


    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp)
  }

  function checkForOverlap(id) {
    const currentNoteRef = noteRefs.current[id].current;
    const currentRect = currentNoteRef.getBoundingClientRect();
    return notes.some(note => {
      if(note.id === id) {
        return false
      }

      const otherNoteRef = noteRefs.current[note.id].current;
      const otherRect = otherNoteRef.getBoundingClientRect();
      const overlap = !(
        currentRect.right < otherRect.left || currentRect.left > otherRect.right || currentRect.bottom < otherRect.top || currentRect.top > otherRect.bottom
      );
      return overlap;
    })
  }

  function updateNotePosition(id, newPosition) {
    const updatedNotes = notes.map(note => note.id == id ? {...note, position: newPosition} : note);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  }

  return (
    <div>
      {notes.map(note => (
        <Note key={note?.id} 
        ref={noteRefs.current[note?.id] ? noteRefs.current[note?.id]: noteRefs.current[note.id] = createRef()} 
        initialPosition={note?.position} content={note.text}
        onMouseDown={(e) => handleDragStart(note, e)}
         />
      ))}
    </div>
  )
}

export default Notes