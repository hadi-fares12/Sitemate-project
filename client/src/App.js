// src/App.js
import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [issues, setIssues] = useState([]);
  const [issue, setIssue] = useState({ id: '', title: '', description: '' });
  const [error, setError] = useState('');

  // Create Issue
  const createIssue = async () => {
    try {
      const id = parseInt(issue.id);
      if (!id || !issue.title || !issue.description) {
        setError('Issue ID, title, and description are required.');
        return;
      }
      if (isNaN(id)) {
        setError('Issue ID must be a number.');
        return;
      }
      const response = await axios.post('http://localhost:3000/issues', { id, title: issue.title, description: issue.description });
      setIssues([...issues, response.data]);
      setIssue({ id: '', title: '', description: '' });
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating issue.');
      console.error('Error creating issue:', error.response ? error.response.data : error.message);
    }
  };

  // Read Issue
  const fetchIssue = async (id) => {
    try {
      if (isNaN(id)) {
        setError('Issue ID must be a number.');
        return;
      }
      const response = await axios.get(`http://localhost:3000/issues/${id}`);
      setIssues([response.data]);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching issue.');
      console.error('Error fetching issue:', error.response ? error.response.data : error.message);
    }
  };

  // Update Issue
  const updateIssue = async () => {
    try {
      const id = parseInt(issue.id);
      if (!id) {
        setError('Issue ID is required.');
        return;
      }
      if (isNaN(id)) {
        setError('Issue ID must be a number.');
        return;
      }
      const response = await axios.put(`http://localhost:3000/issues/${id}`, issue);
      setIssues(issues.map(i => (i.id === id ? response.data : i)));
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating issue.');
      console.error('Error updating issue:', error.response ? error.response.data : error.message);
    }
  };

  // Delete Issue
  const deleteIssue = async (id) => {
    try {
      if (isNaN(id)) {
        setError('Issue ID must be a number.');
        return;
      }
      await axios.delete(`http://localhost:3000/issues/${id}`);
      setIssues(issues.filter(i => i.id !== id));
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Error deleting issue.');
      console.error('Error deleting issue:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Issue Tracker</h1>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.form}>
        <input
          type="number"
          placeholder="ID"
          value={issue.id}
          onChange={e => setIssue({ ...issue, id: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Title"
          value={issue.title}
          onChange={e => setIssue({ ...issue, title: e.target.value })}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Description"
          value={issue.description}
          onChange={e => setIssue({ ...issue, description: e.target.value })}
          style={styles.input}
        />
        <div style={styles.buttonContainer}>
          <button onClick={createIssue} style={styles.button}>Create</button>
          <button onClick={updateIssue} style={styles.button}>Update</button>
          <button onClick={() => fetchIssue(parseInt(issue.id))} style={styles.button}>Read</button>
          <button onClick={() => deleteIssue(parseInt(issue.id))} style={styles.button}>Delete</button>
        </div>
      </div>
      <h2 style={styles.subheading}>Issue List</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>ID</th>
            <th style={styles.tableHeader}>Title</th>
            <th style={styles.tableHeader}>Description</th>
          </tr>
        </thead>
        <tbody>
          {issues.map(i => (
            <tr key={i.id}>
              <td style={styles.tableCell}>{i.id}</td>
              <td style={styles.tableCell}>{i.title}</td>
              <td style={styles.tableCell}>{i.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
  },
  heading: {
    textAlign: 'center',
    color: '#333'
  },
  subheading: {
    color: '#555',
    marginTop: '20px',
    marginBottom: '10px'
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px'
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px'
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px'
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#007BFF',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  },
  buttonHover: {
    backgroundColor: '#0056b3'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    backgroundColor: '#007BFF',
    color: '#fff',
    padding: '10px',
    textAlign: 'left'
  },
  tableCell: {
    padding: '10px',
    borderBottom: '1px solid #ddd'
  }
};

export default App;
