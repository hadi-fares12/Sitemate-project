// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3001' // This should match your React app's URL
}));
app.use(express.json());

// In-memory data store
let issues = [
  { id: 1, title: "Issue 1", description: "This is the first issue" },
  { id: 2, title: "Issue 2", description: "This is the second issue" }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Issue Tracker API');
});

// Create - Accepts a JSON object & returns the object
app.post('/issues', (req, res) => {
  const { id, title, description } = req.body;
  console.log('Received data:', req.body);

  if (!id || !title || !description || isNaN(id)) {
    return res.status(400).json({ message: 'Invalid issue data. Ensure ID is a number and all fields are provided.' });
  }

  const existingIssue = issues.find(i => i.id === parseInt(id));
  if (existingIssue) {
    return res.status(400).json({ message: 'Issue with this ID already exists.' });
  }

  const newIssue = { id: parseInt(id), title, description };
  issues.push(newIssue);
  console.log('Created issue:', newIssue);
  res.status(201).json(newIssue);
});

// Read - Returns a JSON object for the given ID
app.get('/issues/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const issue = issues.find(i => i.id === id);
  if (issue) {
    console.log('Read:', issue);
    res.json(issue);
  } else {
    res.status(404).json({ message: 'Issue with the given ID not found.' });
  }
});

// Update - Accepts a JSON object & returns the updated object
app.put('/issues/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description } = req.body;
  const issue = issues.find(i => i.id === id);
  if (issue) {
    if (title) issue.title = title;
    if (description) issue.description = description;
    console.log('Update:', issue);
    res.json(issue);
  } else {
    res.status(404).json({ message: 'Issue with the given ID not found.' });
  }
});

// Delete - Returns the deleted object
app.delete('/issues/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = issues.findIndex(i => i.id === id);
  if (index !== -1) {
    const [deletedIssue] = issues.splice(index, 1);
    console.log('Delete:', deletedIssue);
    res.json(deletedIssue);
  } else {
    res.status(404).json({ message: 'Issue with the given ID not found.' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
