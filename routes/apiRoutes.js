const fs = require('fs');
const path = require('path');
const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '../db.json');

router.get('/notes', (req, res) => {
  const notes = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  res.json(notes);
});

router.post('/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();

  const notes = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  notes.push(newNote);

  fs.writeFileSync(dbPath, JSON.stringify(notes), 'utf8');

  res.json(newNote);
});

module.exports = router;
