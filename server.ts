import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { Voter, Election, Candidate, Vote, DbSchema, ResultsData } from './src/types';

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'db_store.json');

app.use(express.json());

// Helper function to hash passwords securely using Node.js crypto (SHA-256)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Initial/default Database State
const initialDb: DbSchema = {
  voters: [
    {
      voter_id: 1,
      name: 'Kushal Mohan',
      email: 'kushal@gmail.com',
      dob: '2004-03-12',
      aadhar: '123456789012',
      is_voted: 1,
      created_at: new Date('2026-05-10T10:00:00Z').toISOString(),
      password_hash: hashPassword('kushal123')
    },
    {
      voter_id: 2,
      name: 'Golu Chaudhary',
      email: 'golu@gmail.com',
      dob: '2003-08-22',
      aadhar: '987654321098',
      is_voted: 1,
      created_at: new Date('2026-05-11T12:00:00Z').toISOString(),
      password_hash: hashPassword('golu123')
    }
  ],
  elections: [
    {
      election_id: 1,
      election_name: 'BCA Student Council Election 2026',
      description: 'Annual election to nominate student representatives for the BCA division at Advance Institute of Science and Technology.',
      start_date: '2026-05-01',
      end_date: '2026-06-30',
      status: 'active',
      created_at: new Date('2026-05-01T08:00:00Z').toISOString()
    },
    {
      election_id: 2,
      election_name: 'Dehradun Municipal Senate Polls 2026',
      description: 'Elections for the municipal ward student council delegates under local administration curriculum.',
      start_date: '2026-05-15',
      end_date: '2026-06-15',
      status: 'active',
      created_at: new Date('2026-05-14T09:00:00Z').toISOString()
    },
    {
      election_id: 3,
      election_name: 'University Sports Committee 2026',
      description: 'Biennial sports council coordinator election representing various athletic sports disciplines.',
      start_date: '2026-06-10',
      end_date: '2026-07-10',
      status: 'inactive',
      created_at: new Date('2026-05-20T10:00:00Z').toISOString()
    }
  ],
  candidates: [
    // BCA Student Council (Election ID: 1)
    {
      candidate_id: 1,
      election_id: 1,
      name: 'Amit Sharma',
      party: 'Modern Tech Alliance',
      symbol: '💻 Laptop',
      vote_count: 1
    },
    {
      candidate_id: 2,
      election_id: 1,
      name: 'Priyanka Rawat',
      party: 'Youth Progress Party',
      symbol: '⚡ Flash',
      vote_count: 1
    },
    {
      candidate_id: 3,
      election_id: 1,
      name: 'Rahul Bhatt',
      party: 'Student Forward Union',
      symbol: '📚 Book',
      vote_count: 0
    },
    // Dehradun Municipal Senate Polls (Election ID: 2)
    {
      candidate_id: 4,
      election_id: 2,
      name: 'Dr. Rakesh Negi',
      party: 'Garhwal Development Front',
      symbol: '🏔️ Mountain',
      vote_count: 1
    },
    {
      candidate_id: 5,
      election_id: 2,
      name: 'Sunita Dobhal',
      party: 'Dehradun Heritage Party',
      symbol: '🌲 Pine Tree',
      vote_count: 1
    },
    // University Sports Committee (Election ID: 3)
    {
      candidate_id: 6,
      election_id: 3,
      name: 'Vicky Negi',
      party: 'Sports United',
      symbol: '⚽ Football',
      vote_count: 0
    },
    {
      candidate_id: 7,
      election_id: 3,
      name: 'Sneha Dobhal',
      party: 'Athletics First',
      symbol: '🏆 Trophy',
      vote_count: 0
    }
  ],
  votes: [
    {
      vote_id: 1,
      voter_id: 1,
      candidate_id: 1,
      election_id: 1,
      voted_at: new Date('2026-05-15T10:15:00Z').toISOString()
    },
    {
      vote_id: 2,
      voter_id: 1,
      candidate_id: 4,
      election_id: 2,
      voted_at: new Date('2026-05-15T10:20:00Z').toISOString()
    },
    {
      vote_id: 3,
      voter_id: 2,
      candidate_id: 2,
      election_id: 1,
      voted_at: new Date('2026-05-16T14:30:00Z').toISOString()
    },
    {
      vote_id: 4,
      voter_id: 2,
      candidate_id: 5,
      election_id: 2,
      voted_at: new Date('2026-05-16T14:35:00Z').toISOString()
    }
  ],
  admins: [
    {
      admin_id: 1,
      username: 'admin',
      email: 'admin@votingsystem.com',
      created_at: new Date().toISOString()
    }
  ]
};

// Helper: Read database from file, fallback to initialDb
function loadDb(): DbSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data) as DbSchema;
    }
  } catch (error) {
    console.error('Error loading database, resetting to template:', error);
  }
  saveDb(initialDb);
  return initialDb;
}

// Helper: Save database to file
function saveDb(data: DbSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving database to file:', error);
  }
}

// Admin Password hash simulation
// Default password specified in the PDF project report is: Admin@123
const ADMIN_PASSWORD_HASH = hashPassword('Admin@123');

// Memory voter-password registry (simulate bcrypt hash storage)
// For simplicity in our demo database we store voter passwords as hashed values. Let's create a default set
const passwordRegistry: Record<string, string> = {
  'kushal@gmail.com': hashPassword('kushal123'),
  'golu@gmail.com': hashPassword('golu123')
};

// --- API ENDPOINTS ---

// 1. Voter Registration
app.post('/api/voter/register', (req, res) => {
  const { name, email, password, dob, aadhar } = req.body;

  if (!name || !email || !password || !dob || !aadhar) {
    return res.status(400).json({ error: 'All fields are strictly required.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  if (!/^[0-9]{12}$/.test(aadhar)) {
    return res.status(400).json({ error: 'Aadhaar number must be exactly 12 numeric digits.' });
  }

  // Calculate age to enforce 18+ eligibility
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  if (age < 18) {
    return res.status(400).json({ error: 'Voter must be at least 18 years old to register.' });
  }

  const db = loadDb();

  // Check unique constraints (Email or Aadhaar already registered)
  const isDuplicateEmail = db.voters.some(v => v.email.toLowerCase() === email.toLowerCase());
  const isDuplicateAadhar = db.voters.some(v => v.aadhar === aadhar);

  if (isDuplicateEmail || isDuplicateAadhar) {
    return res.status(400).json({ error: 'Email address or Aadhaar number is already registered.' });
  }

  // Insert voter
  const nextId = db.voters.length > 0 ? Math.max(...db.voters.map(v => v.voter_id)) + 1 : 1;
  const newVoter: Voter = {
    voter_id: nextId,
    name,
    email: email.toLowerCase(),
    dob,
    aadhar,
    is_voted: 0,
    created_at: new Date().toISOString(),
    password_hash: hashPassword(password)
  };

  db.voters.push(newVoter);
  passwordRegistry[email.toLowerCase()] = hashPassword(password);
  saveDb(db);

  return res.json({ success: true, message: 'Registration successful! You can now log in.' });
});

// 2. Voter Login
app.post('/api/voter/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const db = loadDb();
  const voter = db.voters.find(v => v.email.toLowerCase() === email.toLowerCase());

  if (!voter) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const inputHash = hashPassword(password);
  const storedHash = voter.password_hash || passwordRegistry[email.toLowerCase()];

  // Validate password
  if (storedHash !== inputHash) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Retrieve voting status
  return res.json({
    success: true,
    voter: {
      voter_id: voter.voter_id,
      name: voter.name,
      email: voter.email,
      dob: voter.dob,
      aadhar: voter.aadhar,
      is_voted: voter.is_voted
    }
  });
});

// 3. Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  if (username !== 'admin') {
    return res.status(401).json({ error: 'Invalid admin credentials.' });
  }

  const inputHash = hashPassword(password);
  if (inputHash !== ADMIN_PASSWORD_HASH) {
    return res.status(401).json({ error: 'Invalid admin credentials.' });
  }

  return res.json({
    success: true,
    admin: {
      admin_id: 1,
      username: 'admin',
      email: 'admin@votingsystem.com'
    }
  });
});

// 4. Get Elections
app.get('/api/elections', (req, res) => {
  const db = loadDb();
  res.json(db.elections);
});

// 5. Admin Create Election
app.post('/api/elections', (req, res) => {
  const { election_name, description, start_date, end_date, status } = req.body;

  if (!election_name || !start_date || !end_date) {
    return res.status(400).json({ error: 'Election name, start date, and end date are required.' });
  }

  const db = loadDb();
  const nextId = db.elections.length > 0 ? Math.max(...db.elections.map(e => e.election_id)) + 1 : 1;
  
  const newElection: Election = {
    election_id: nextId,
    election_name,
    description: description || '',
    start_date,
    end_date,
    status: status || 'inactive',
    created_at: new Date().toISOString()
  };

  db.elections.push(newElection);
  saveDb(db);
  res.json({ success: true, election: newElection });
});

// 6. Admin Update Election
app.put('/api/elections/:id', (req, res) => {
  const electionId = parseInt(req.params.id);
  const { election_name, description, start_date, end_date, status } = req.body;

  const db = loadDb();
  const electionIndex = db.elections.findIndex(e => e.election_id === electionId);

  if (electionIndex === -1) {
    return res.status(444).json({ error: 'Election not found.' });
  }

  db.elections[electionIndex] = {
    ...db.elections[electionIndex],
    election_name: election_name || db.elections[electionIndex].election_name,
    description: description !== undefined ? description : db.elections[electionIndex].description,
    start_date: start_date || db.elections[electionIndex].start_date,
    end_date: end_date || db.elections[electionIndex].end_date,
    status: status || db.elections[electionIndex].status
  };

  saveDb(db);
  res.json({ success: true, election: db.elections[electionIndex] });
});

// 7. Admin Delete Election
app.delete('/api/elections/:id', (req, res) => {
  const electionId = parseInt(req.params.id);
  const db = loadDb();

  // Check if foreign keys exist (e.g. votes cast in this election)
  const hasVotes = db.votes.some(v => v.election_id === electionId);
  if (hasVotes) {
    return res.status(400).json({ error: 'Cannot delete election. It already has votes recorded.' });
  }

  db.elections = db.elections.filter(e => e.election_id !== electionId);
  // Also cascade delete candidates
  db.candidates = db.candidates.filter(c => c.election_id !== electionId);
  
  saveDb(db);
  res.json({ success: true });
});

// 8. Get Candidates
app.get('/api/candidates', (req, res) => {
  const db = loadDb();
  const electionId = req.query.election_id ? parseInt(req.query.election_id as string) : null;
  
  if (electionId) {
    const filterCandidates = db.candidates.filter(c => c.election_id === electionId);
    return res.json(filterCandidates);
  }
  res.json(db.candidates);
});

// 9. Admin Create Candidate
app.post('/api/candidates', (req, res) => {
  const { election_id, name, party, symbol } = req.body;

  if (!election_id || !name || !party || !symbol) {
    return res.status(400).json({ error: 'All candidate fields are required.' });
  }

  const db = loadDb();
  const nextId = db.candidates.length > 0 ? Math.max(...db.candidates.map(c => c.candidate_id)) + 1 : 1;

  const newCandidate: Candidate = {
    candidate_id: nextId,
    election_id: parseInt(election_id),
    name,
    party,
    symbol,
    vote_count: 0
  };

  db.candidates.push(newCandidate);
  saveDb(db);
  res.json({ success: true, candidate: newCandidate });
});

// 10. Admin Delete Candidate
app.delete('/api/candidates/:id', (req, res) => {
  const candidateId = parseInt(req.params.id);
  const db = loadDb();

  // Prevent deletion if votes already cast
  const hasVotes = db.votes.some(v => v.candidate_id === candidateId);
  if (hasVotes) {
    return res.status(400).json({ error: 'Cannot delete candidate. They already have votes cast in their favor.' });
  }

  db.candidates = db.candidates.filter(c => c.candidate_id !== candidateId);
  saveDb(db);
  res.json({ success: true });
});

// 11. Cast Vote (Voter Action) - Implementing strict atomic transaction with rollback simulation
app.post('/api/voter/vote', (req, res) => {
  const { voter_id, candidate_id, election_id } = req.body;

  if (!voter_id || !candidate_id || !election_id) {
    return res.status(400).json({ error: 'Incomplete vote information.' });
  }

  const db = loadDb();

  // Validate Election status (must be active)
  const election = db.elections.find(e => e.election_id === parseInt(election_id));
  if (!election || election.status !== 'active') {
    return res.status(400).json({ error: 'Voting closed/unavailable for this election.' });
  }

  // Duplicate vote check (application layer)
  const alreadyVoted = db.votes.some(
    v => v.voter_id === parseInt(voter_id) && v.election_id === parseInt(election_id)
  );

  if (alreadyVoted) {
    return res.status(400).json({ error: 'Duplicate Vote Blocked: You have already voted in this election.' });
  }

  // Transaction block simulation
  try {
    // 1. Insert Vote Transaction Record
    const nextVoteId = db.votes.length > 0 ? Math.max(...db.votes.map(v => v.vote_id)) + 1 : 1;
    const newVote: Vote = {
      vote_id: nextVoteId,
      voter_id: parseInt(voter_id),
      candidate_id: parseInt(candidate_id),
      election_id: parseInt(election_id),
      voted_at: new Date().toISOString()
    };
    db.votes.push(newVote);

    // 2. Increment Candidate Vote Count
    const candIndex = db.candidates.findIndex(c => c.candidate_id === parseInt(candidate_id));
    if (candIndex === -1) {
      throw new Error('Eligible candidate not found');
    }
    db.candidates[candIndex].vote_count += 1;

    // 3. Mark Voter as Voted globally
    const voterIndex = db.voters.findIndex(v => v.voter_id === parseInt(voter_id));
    if (voterIndex !== -1) {
      db.voters[voterIndex].is_voted = 1;
    }

    // Save atomicity commit
    saveDb(db);
    res.json({ success: true, message: 'Vote cast successfully! Thank you for participating in democracy.' });
  } catch (err: any) {
    console.error('Vote Transaction Rollback triggered:', err);
    res.status(500).json({ error: 'Voting transaction failed. Your vote was not recorded. Please try again.' });
  }
});

// 12. Check Voter's Vote in specific election
app.get('/api/voter/:voterId/status/:electionId', (req, res) => {
  const voterId = parseInt(req.params.voterId);
  const electionId = parseInt(req.params.electionId);

  const db = loadDb();
  const index = db.votes.findIndex(v => v.voter_id === voterId && v.election_id === electionId);
  
  if (index !== -1) {
    const vote = db.votes[index];
    const candidate = db.candidates.find(c => c.candidate_id === vote.candidate_id);
    return res.json({ voted: true, candidate });
  }

  res.json({ voted: false });
});

// 13. Get Voters (Admin Access)
app.get('/api/voters', (req, res) => {
  const db = loadDb();
  // Safe sanitize password (passwords aren't loaded here anyway but let's send neat structure)
  res.json(db.voters);
});

// 14. Get Results for an Election
app.get('/api/results/:election_id', (req, res) => {
  const electionId = parseInt(req.params.election_id);
  const db = loadDb();

  const election = db.elections.find(e => e.election_id === electionId);
  if (!election) {
    return res.status(404).json({ error: 'Election not found.' });
  }

  // Fetch candidates nominated for this election
  const electionCandidates = db.candidates.filter(c => c.election_id === electionId);
  
  // Calculate total votes in this election
  const totalVotesCast = db.votes.filter(v => v.election_id === electionId).length;

  const results: ResultsData[] = electionCandidates.map(c => {
    // Audit check: calculate dynamically from real votes table
    const actual_votes = db.votes.filter(v => v.candidate_id === c.candidate_id).length;
    return {
      candidate_id: c.candidate_id,
      name: c.name,
      party: c.party,
      symbol: c.symbol,
      actual_votes,
      percentage: totalVotesCast > 0 ? Math.round((actual_votes / totalVotesCast) * 100 * 10) / 10 : 0
    };
  });

  // Sort descending by votes to rank position
  results.sort((a, b) => b.actual_votes - a.actual_votes);

  const winner = results.length > 0 && results[0].actual_votes > 0 ? results[0] : null;

  res.json({
    election_name: election.election_name,
    status: election.status,
    total_votes: totalVotesCast,
    results,
    winner
  });
});

// 15. Server Quick Dashboard Stats (Admin Panels)
app.get('/api/stats', (req, res) => {
  const db = loadDb();
  res.json({
    total_elections: db.elections.length,
    active_elections: db.elections.filter(e => e.status === 'active').length,
    total_voters: db.voters.length,
    total_votes: db.votes.length,
    total_candidates: db.candidates.length
  });
});


// --- INTEGRATING VITE DEV SERVER (OR STATIC PRODUCTION SERVING) ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
