const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// In-memory data store (replace with a database in production)
let leaderboard = [];

// TODO: Implement XMCOM authentication middleware
// This middleware will verify the user's XMCOM token
// and attach the user's information to the request object.

// Endpoint to get the leaderboard
app.get('/leaderboard', (req, res) => {
  res.json(leaderboard.sort((a, b) => b.score - a.score));
});

// Endpoint to update a user's score
app.post('/score', (req, res) => {
  const { user, score } = req.body;

  if (!user || score === undefined) {
    return res.status(400).json({ error: 'User and score are required' });
  }

  const existingEntryIndex = leaderboard.findIndex(entry => entry.user === user);

  if (existingEntryIndex !== -1) {
    leaderboard[existingEntryIndex].score = score;
  } else {
    leaderboard.push({ user, score });
  }

  res.status(201).json({ message: 'Score updated successfully' });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
