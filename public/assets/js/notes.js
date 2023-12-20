// DOM elements
let noteForm, noteTitle, noteText, saveNoteBtn, newNoteBtn, clearBtn, noteList;

// Function to show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Function to hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// Keeps track of the active note in the textarea
let activeNote = {};

// Fetch and render notes from the server
const getAndRenderNotes = async () => {
  try {
    const response = await getNotes();
    if (response.ok) {
      const notes = await response.json();
      renderNoteList(notes);
    } else {
      console.error('Failed to fetch notes');
    }
  } catch (error) {
    console.error('Error fetching notes:', error);
  }
};

// Fetch notes from the server
const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

// Save a new note
const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

// Delete a note by ID
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

// Render the active note in the UI
const renderActiveNote = () => {
  hide(saveNoteBtn);
  hide(clearBtn);

  if (activeNote.id) {
    show(newNoteBtn);
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    hide(newNoteBtn);
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

// Save a new note and update the UI
const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete a note and update the UI
const handleNoteDelete = (e) => {
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    const deletedNoteElement = note.parentElement;
    deletedNoteElement.remove();
  });
};

// View a note and render it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Set up a new note view
const handleNewNoteView = (e) => {
  activeNote = {};
  show(clearBtn);
  renderActiveNote();
};

// Handle rendering of buttons based on input fields
const handleRenderBtns = () => {
  show(clearBtn);
  if (!noteTitle.value.trim() && !noteText.value.trim()) {
    hide(clearBtn);
  } else if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of notes
const renderNoteList = (notes) => {
  try {
    if (window.location.pathname === '/notes') {
      noteList.innerHTML = '';

      if (notes.length === 0) {
        const noNotesLi = document.createElement('li');
        noNotesLi.classList.add('list-group-item');
        noNotesLi.innerText = 'No saved notes';
        noteList.appendChild(noNotesLi);
      } else {
        notes.forEach((note) => {
          const li = document.createElement('li');
          li.classList.add('list-group-item');

          const spanTitle = document.createElement('span');
          spanTitle.classList.add('list-item-title');
          spanTitle.innerText = note.title;
          spanTitle.addEventListener('click', handleNoteView);
          li.appendChild(spanTitle);

          const delBtn = document.createElement('i');
          delBtn.classList.add('fas', 'fa-trash-alt', 'float-right', 'text-danger', 'delete-note');
          delBtn.addEventListener('click', handleNoteDelete);
          li.appendChild(delBtn);

          li.dataset.note = JSON.stringify({ id: note.id, title: note.title, text: note.text });

          noteList.appendChild(li);
        });
      }
    }
  } catch (error) {
    console.error('Error rendering notes:', error);
  }
};

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname === '/notes') {
    noteForm = document.querySelector('.note-form');
    noteTitle = document.querySelector('.note-title');
    noteText = document.querySelector('.note-textarea');
    saveNoteBtn = document.querySelector('.save-note');
    newNoteBtn = document.querySelector('.new-note');
    clearBtn = document.querySelector('.clear-btn');
    noteList = document.querySelector('.list-container .list-group');

    // Check if elements are found
    console.log(noteForm, noteTitle, noteText, saveNoteBtn, newNoteBtn, clearBtn, noteList);

    // Add event listeners after ensuring elements exist
    saveNoteBtn.addEventListener('click', handleNoteSave);
    newNoteBtn.addEventListener('click', handleNewNoteView);
    clearBtn.addEventListener('click', renderActiveNote);
    noteForm.addEventListener('input', handleRenderBtns);
  }

  // Fetch and render notes when the app is initialized
  getAndRenderNotes();
});
