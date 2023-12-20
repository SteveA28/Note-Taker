document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const noteList = document.getElementById('note-list');
    const noteForm = document.getElementById('note-form');
    const saveNoteBtn = document.getElementById('save-note');
    const clearFormBtn = document.getElementById('clear-form');
  
    // Function to fetch and display notes
    const fetchNotes = () => {
      fetch('/api/notes')
        .then((response) => response.json())
        .then((data) => {
          noteList.innerHTML = '';
          data.forEach((note) => {
            const noteItem = document.createElement('a');
            noteItem.classList.add('list-group-item', 'list-group-item-action');
            noteItem.setAttribute('data-id', note.id);
            noteItem.innerText = note.title;
            noteList.appendChild(noteItem);
          });
        });
    };
  
    // Function to save a new note
    const saveNote = () => {
      const title = document.getElementById('note-title').value;
      const text = document.getElementById('note-text').value;
  
      if (title && text) {
        const newNote = {
          title,
          text,
        };
  
        fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newNote),
        })
          .then((response) => response.json())
          .then(() => {
            fetchNotes();
            clearForm();
          });
      } else {
        alert('Please enter both title and text before saving.');
      }
    };
  
    // Function to clear the form
    const clearForm = () => {
      document.getElementById('note-title').value = '';
      document.getElementById('note-text').value = '';
    };
  
    // Event listeners
    saveNoteBtn.addEventListener('click', saveNote);
    clearFormBtn.addEventListener('click', clearForm);
  
    // Initial fetch and display notes
    fetchNotes();
  });
  