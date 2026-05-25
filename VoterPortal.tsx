import React, { useState, useEffect } from 'react';
import { UserCheck, LogIn, UserPlus, KeyRound, CheckCircle2, ShieldCheck, Signpost, LogOut, ArrowRight, ShieldAlert, BadgeInfo } from 'lucide-react';
import { Voter, Election, Candidate } from '../types';

interface VoterPortalProps {
  onLogout: () => void;
}

export default function VoterPortal() {
  const [currentUser, setCurrentUser] = useState<Omit<Voter, 'created_at'> | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regDob, setRegDob] = useState('');
  const [regAadhar, setRegAadhar] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // Dashboard states
  const [elections, setElections] = useState<Election[]>([]);
  const [votedElections, setVotedElections] = useState<Record<number, { voted: boolean; candidate?: Candidate }>>({});
  const [activeVotingElection, setActiveVotingElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);
  const [votingError, setVotingError] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Check LocalStorage Session on component mount
  useEffect(() => {
    const session = localStorage.getItem('ovs_voter_session');
    if (session) {
      setCurrentUser(JSON.parse(session));
    }
  }, []);

  // Fetch active elections
  useEffect(() => {
    fetch('/api/elections')
      .then(res => res.json())
      .then((data: Election[]) => {
        // Show only active/closed elections for voter board
        setElections(data.filter(e => e.status !== 'inactive'));
      })
      .catch(err => console.error('Error fetching elections:', err));
  }, [currentUser]);

  // Fetch Voter status for elections
  useEffect(() => {
    if (!currentUser) return;
    
    // Check voter status across loaded elections
    elections.forEach(elec => {
      fetch(`/api/voter/${currentUser.voter_id}/status/${elec.election_id}`)
        .then(res => res.json())
        .then(data => {
          setVotedElections(prev => ({
            ...prev,
            [elec.election_id]: {
              voted: data.voted,
              candidate: data.candidate
            }
          }));
        })
        .catch(err => console.error('Error checking voting status:', err));
    });
  }, [elections, currentUser]);

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Please fill in all credential fields.');
      return;
    }

    fetch('/api/voter/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: loginEmail, password: loginPassword })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setLoginError(data.error);
        } else if (data.success && data.voter) {
          setCurrentUser(data.voter);
          localStorage.setItem('ovs_voter_session', JSON.stringify(data.voter));
          // Reset fields
          setLoginEmail('');
          setLoginPassword('');
        }
      })
      .catch(err => {
        console.error('Login request failed:', err);
        setLoginError('Authentication server is currently offline.');
      });
  };

  // Handle Register submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regName || !regEmail || !regPassword || !regConfirm || !regDob || !regAadhar) {
      setRegError('All fields are strictly required.');
      return;
    }

    if (regPassword.length < 8) {
      setRegError('Password must be at least 8 characters long.');
      return;
    }

    if (regPassword !== regConfirm) {
      setRegError('Passwords do not match. Please verify.');
      return;
    }

    if (!/^[0-9]{12}$/.test(regAadhar)) {
      setRegError('Aadhaar number must be exactly 12 numeric digits.');
      return;
    }

    // Age validation (18+)
    const birthDate = new Date(regDob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      setRegError('Eligibility Error: You must be at least 18 years old to register as an elector.');
      return;
    }

    fetch('/api/voter/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: regName,
        email: regEmail,
        password: regPassword,
        dob: regDob,
        aadhar: regAadhar
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setRegError(data.error);
        } else if (data.success) {
          setRegSuccess(data.message);
          // Clean forms
          setRegName('');
          setRegEmail('');
          setRegPassword('');
          setRegConfirm('');
          setRegDob('');
          setRegAadhar('');
          // Autocomplete login screen after brief time
          setTimeout(() => {
            setIsRegistering(false);
            setLoginEmail(regEmail);
          }, 2000);
        }
      })
      .catch(err => {
        console.error('Registration failed:', err);
        setRegError('Failure communicating with database servers.');
      });
  };

  // Start Vote flow for an election
  const handleStartVote = (election: Election) => {
    setVotingError('');
    setSelectedCandidateId(null);
    
    // Check duplicate
    if (votedElections[election.election_id]?.voted) {
      setVotingError('Duplicate Vote Blocked: You have already cast a ballot for this election.');
      return;
    }

    // Fetch Candidates for this election
    fetch(`/api/candidates?election_id=${election.election_id}`)
      .then(res => res.json())
      .then((data: Candidate[]) => {
        setCandidates(data);
        setActiveVotingElection(election);
      })
      .catch(err => {
        console.error('Error fetching candidates:', err);
        setVotingError('Failed to fetch nominated candidates.');
      });
  };

  // Trigger modal confirm
  const handleConfirmVoteOpen = () => {
    if (selectedCandidateId === null) {
      setVotingError('Please select a candidate card to cast your vote.');
      return;
    }
    setVotingError('');
    setShowConfirmModal(true);
  };

  // Final confirmation to submit vote
  const handleCastVoteFinal = () => {
    if (!currentUser || !activeVotingElection || selectedCandidateId === null) return;
    
    setShowConfirmModal(false);
    
    fetch('/api/voter/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        voter_id: currentUser.voter_id,
        candidate_id: selectedCandidateId,
        election_id: activeVotingElection.election_id
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(`Voting failed: ${data.error}`);
        } else if (data.success) {
          // Update status locally
          const chosenCand = candidates.find(c => c.candidate_id === selectedCandidateId);
          setVotedElections(prev => ({
            ...prev,
            [activeVotingElection.election_id]: {
              voted: true,
              candidate: chosenCand
            }
          }));
          // Show overlay success
          alert('Success: Your secure vote has been registered and counted in the database.');
          // Return to dashboard
          setActiveVotingElection(null);
          setSelectedCandidateId(null);
        }
      })
      .catch(err => {
        console.error('Error casting vote:', err);
        alert('Transaction failed: No records were edited.');
      });
  };

  // Logout Voter session safely
  const handleLogout = () => {
    localStorage.removeItem('ovs_voter_session');
    setCurrentUser(null);
    setActiveVotingElection(null);
    setSelectedCandidateId(null);
  };

  return (
    <div className="space-y-6" id="voter-portal-root">
      
      {/* 1. NOT LOGGED IN VIEW */}
      {!currentUser ? (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden" id="auth-box">
          
          {/* Header Title toggling */}
          <div className="bg-[#1F4E79] text-white p-6 text-center text-sm font-sans relative">
            <div className="absolute top-3 right-3 opacity-25">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold tracking-tight">OVS Voter Portal</h3>
            <p className="text-slate-300 text-xs mt-1">
              {isRegistering ? 'Elector Registration Form' : 'Authenticate credentials securely'}
            </p>
          </div>

          <div className="p-6 md:p-8">
            {/* REGISTER SCREEN */}
            {isRegistering ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-4" id="voter-reg-form">
                
                {regError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs font-semibold flex items-center gap-1.5" id="reg-error-callout">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}
                {regSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-xs font-bold flex items-center gap-1.5" id="reg-success-callout">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-green-500 animate-bounce" />
                    <span>{regSuccess}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label htmlFor="reg-name" className="text-xs font-bold text-slate-700">Full Legal Name</label>
                  <input
                    type="text"
                    id="reg-name"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="E.g. Kushal Mohan"
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#2E75B6]"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="reg-email" className="text-xs font-bold text-slate-700">Email Address (Login ID)</label>
                  <input
                    type="email"
                    id="reg-email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#2E75B6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="reg-dob" className="text-xs font-bold text-slate-700">Date of Birth</label>
                    <input
                      type="date"
                      id="reg-dob"
                      required
                      value={regDob}
                      onChange={(e) => setRegDob(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#2E75B6] text-slate-700"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="reg-aadhar" className="text-xs font-bold text-slate-700">Aadhaar Number</label>
                    <input
                      type="text"
                      id="reg-aadhar"
                      required
                      maxLength={12}
                      value={regAadhar}
                      onChange={(e) => setRegAadhar(e.target.value.replace(/\D/g, ''))}
                      placeholder="12-digit number"
                      className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#2E75B6]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="reg-pass" className="text-xs font-bold text-slate-700">Password</label>
                    <input
                      type="password"
                      id="reg-pass"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 8 chars"
                      className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#2E75B6]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="reg-confirm" className="text-xs font-bold text-slate-700">Confirm Password</label>
                    <input
                      type="password"
                      id="reg-confirm"
                      required
                      value={regConfirm}
                      onChange={(e) => setRegConfirm(e.target.value)}
                      placeholder="Retype password"
                      className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#2E75B6]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="voter-reg-submit-btn"
                  className="w-full bg-[#1F4E79] hover:bg-[#2E75B6] text-white text-xs font-bold p-3 rounded-lg transition-colors shadow-xs mt-4 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  Create Voter Account
                </button>

                <p className="text-center text-xs text-slate-500 mt-4">
                  Already registered for voting?{' '}
                  <button
                    type="button"
                    id="switch-to-login"
                    onClick={() => { setIsRegistering(false); setRegError(''); }}
                    className="text-[#2E75B6] font-bold hover:underline"
                  >
                    Login here
                  </button>
                </p>
              </form>
            ) : (
              /* LOGIN SCREEN */
              <form onSubmit={handleLoginSubmit} className="space-y-4" id="voter-login-form">
                
                {loginError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs font-semibold flex items-center gap-1.5" id="login-error-callout">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label htmlFor="login-email" className="text-xs font-bold text-slate-700">Registered Email Address</label>
                  <input
                    type="email"
                    id="login-email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter email e.g. kushal@gmail.com"
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#2E75B6]"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="login-pass" className="text-xs font-bold text-slate-700">Password</label>
                  <input
                    type="password"
                    id="login-pass"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your security password"
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#2E75B6]"
                  />
                </div>

                <button
                  type="submit"
                  id="voter-login-submit-btn"
                  className="w-full bg-[#1F4E79] hover:bg-[#2E75B6] text-white text-xs font-bold p-3 rounded-lg transition-colors shadow-xs mt-4 flex items-center justify-center gap-1 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  Secure Sign In
                </button>

                <p className="text-center text-xs text-slate-500 mt-4">
                  New voter from Dehradun?{' '}
                  <button
                    type="button"
                    id="switch-to-register"
                    onClick={() => { setIsRegistering(true); setLoginError(''); }}
                    className="text-[#2E75B6] font-bold hover:underline"
                  >
                    Register Account
                  </button>
                </p>

                {/* Helpful presentation credentials box */}
                <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-lg text-[10px] text-slate-500 mt-6 space-y-1" id="presentation-creds">
                  <p className="font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1 mb-1">
                    <BadgeInfo className="w-3.5 h-3.5 text-[#2E75B6]" />
                    Evaluation Credentials (PDF Seed)
                  </p>
                  <p>• <strong>Kushal Mohan:</strong> kushal@gmail.com | <strong>Pass:</strong> kushal123</p>
                  <p>• <strong>Golu Chaudhary:</strong> golu@gmail.com | <strong>Pass:</strong> golu123</p>
                </div>
              </form>
            )}
          </div>

        </div>
      ) : (
        /* 2. LOGGED IN DASHBOARD VIEW */
        <div className="space-y-6" id="voter-dashboard">
          
          {/* Dashboard Header Bar */}
          <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EBF3FB] text-[#1F4E79] flex items-center justify-center font-bold font-serif shadow-xs">
                {currentUser.name[0].toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1F4E79] flex items-center gap-1.5 leading-none">
                  Welcome, {currentUser.name}
                </h3>
                <p className="text-slate-400 text-xs mt-1.5 font-mono">
                  Aadhaar Registered: {currentUser.aadhar.slice(0,4)}-XXXX-XXXX | Elector status verified.
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              id="voter-logout-btn"
              className="px-4 py-2 border border-rose-100 hover:bg-rose-50 text-rose-600 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
            >
              <LogOut className="w-4 h-4" />
              Secure Logout
            </button>
          </div>

          {/* 2A. ACTIVE BALLOT BOX VOTING VIEW */}
          {activeVotingElection ? (
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs animate-fadeIn" id="ballot-box-active">
              
              {/* Ballot Header Banner */}
              <div className="bg-slate-50 border-b border-slate-100 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="bg-[#1F4E79]/10 text-[#1F4E79] text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Official Ballot Box
                  </span>
                  <h4 className="font-serif font-black text-lg text-slate-800 mt-2">
                    {activeVotingElection.election_name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-2xl">{activeVotingElection.description}</p>
                </div>
                <button
                  onClick={() => { setActiveVotingElection(null); setSelectedCandidateId(null); }}
                  className="text-xs border border-slate-200 hover:bg-slate-50 text-slate-600 px-3 py-1.5 rounded-lg transition"
                >
                  Back to active list
                </button>
              </div>

              {/* Action grid body */}
              <div className="p-6 md:p-8">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                  Nominated Candidates (Cast exactly one response)
                </p>

                {candidates.length === 0 ? (
                  <p className="text-center text-slate-400 py-8 text-xs italic">
                    Awaiting candidate postings for this ballot by system admin.
                  </p>
                ) : (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4" id="candidate-cards-grid">
                    {candidates.map((cand) => (
                      <div
                        key={cand.candidate_id}
                        id={`cand-card-${cand.candidate_id}`}
                        onClick={() => setSelectedCandidateId(cand.candidate_id)}
                        className={`border rounded-xl p-5 text-center cursor-pointer transition relative flex flex-col justify-between h-48 group ${
                          selectedCandidateId === cand.candidate_id
                            ? 'border-[#1F4E79] bg-[#EBF3FB]/50 shadow-xs'
                            : 'border-slate-150 hover:border-[#1F4E79]/50 bg-white'
                        }`}
                      >
                        {/* selection indicator */}
                        <div className={`absolute top-3 right-3 w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          selectedCandidateId === cand.candidate_id
                            ? 'border-[#1F4E79] bg-[#1F4E79]'
                            : 'border-slate-300'
                        }`}>
                          {selectedCandidateId === cand.candidate_id && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>

                        {/* Candidate Details */}
                        <div className="space-y-2 mt-4">
                          <span className="text-4xl block text-slate-800 group-hover:scale-110 transition">{cand.symbol}</span>
                          <h5 className="font-bold text-sm text-[#1F4E79]">{cand.name}</h5>
                          <p className="text-xs text-slate-500 font-semibold">{cand.party}</p>
                        </div>

                        <p className="text-[10px] text-slate-400 font-mono mt-4 pt-2 border-t border-slate-100/60 uppercase">
                          Candidate ID #{cand.candidate_id}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {votingError && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs font-semibold">
                    {votingError}
                  </div>
                )}

                {/* Submit casting Button footer */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={handleConfirmVoteOpen}
                    disabled={selectedCandidateId === null}
                    id="trigger-cast-vote-btn"
                    className={`px-6 py-3 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition ${
                      selectedCandidateId === null
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-[#28A745] hover:bg-[#28A745]/90 text-white cursor-pointer'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Submit Cast Ballot
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* 2B. DEFAULT LIST OF ACTIVE ELECTIONS */
            <div className="space-y-4" id="voter-elections-list">
              <h4 className="text-sm font-bold text-[#1F4E79] uppercase tracking-wider mb-2">
                Eligible Ballot Openings (Active Polls)
              </h4>

              {elections.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-xl border border-dashed border-slate-200 text-slate-400">
                  <Signpost className="w-12 h-12 text-slate-200 mx-auto mb-3 animate-bounce" />
                  <p className="text-sm font-medium">Currently no administrative ballots are active in Dehradun.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {elections.map((elec) => {
                    const statusVal = votedElections[elec.election_id];
                    const isVoted = statusVal?.voted;
                    const isClosed = elec.status === 'closed';

                    return (
                      <div
                        key={elec.election_id}
                        className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between gap-4 relative overflow-hidden h-60"
                        id={`election-voter-card-${elec.election_id}`}
                      >
                        {/* Status bar */}
                        <div className="flex justify-between items-start">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            isClosed ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-800'
                          }`}>
                            {elec.status}
                          </span>
                          
                          {/* Checked if already responded */}
                          {isVoted && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Voted Checked
                            </span>
                          )}
                        </div>

                        {/* Title details */}
                        <div className="space-y-1.5">
                          <h5 className="font-bold text-sm text-[#1F4E79] font-serif pr-6">{elec.election_name}</h5>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{elec.description}</p>
                        </div>

                        {/* footer timing & trigger */}
                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400">
                          <div>
                            <p>Starts: {elec.start_date}</p>
                            <p>Ends: {elec.end_date}</p>
                          </div>

                          {isClosed ? (
                            <span className="text-slate-400 font-bold italic">Polls Finished</span>
                          ) : isVoted ? (
                            <div className="text-right">
                              <p className="text-[10px] text-slate-400">Response Selected:</p>
                              <p className="font-bold text-slate-700 text-xs">
                                {statusVal.candidate?.symbol} {statusVal.candidate?.name}
                              </p>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleStartVote(elec)}
                              id={`vote-now-btn-${elec.election_id}`}
                              className="bg-[#1F4E79] hover:bg-[#2E75B6] text-white text-xs px-4 py-2 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              Vote Now
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* 3. STRICT DOUBLE-VOTE CONFIRMATION OVERLAY MODAL */}
      {showConfirmModal && activeVotingElection && selectedCandidateId !== null && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50" id="vote-confirm-modal">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 border border-blue-100 shadow-xl animate-scaleUp">
            <div className="text-center space-y-2">
              <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
              <h4 className="text-base font-serif font-black text-rose-950">Cast Final Vote Confirmation</h4>
              <p className="text-xs text-slate-500">Dual-layer identity locks are executed immediately upon count validation.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg font-sans text-xs space-y-2 text-slate-700 border border-slate-150">
              <p className="font-semibold text-[#1F4E79]">Ballot event:</p>
              <p className="font-medium pl-2 italic text-slate-800 border-l border-blue-200">
                {activeVotingElection.election_name}
              </p>
              <div className="w-full h-px bg-slate-200/50 my-2" />
              <p className="font-semibold text-green-600">Selected Candidate:</p>
              <p className="font-bold pl-2 text-slate-900 text-sm">
                {candidates.find(c => c.candidate_id === selectedCandidateId)?.symbol}{' '}
                {candidates.find(c => c.candidate_id === selectedCandidateId)?.name}
              </p>
              <p className="text-[10px] text-[#2E75B6] pl-2">
                ({candidates.find(c => c.candidate_id === selectedCandidateId)?.party})
              </p>
            </div>

            <p className="text-[10px] text-slate-400 text-center leading-relaxed italic">
              "By confirming, your system Aadhaar registration registers the voted status '1' and seals the record permanently."
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <button
                onClick={() => setShowConfirmModal(false)}
                id="cancel-vote-modal-btn"
                className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-lg transition"
              >
                No, Change Select
              </button>
              <button
                onClick={handleCastVoteFinal}
                id="confirm-vote-modal-btn"
                className="py-2.5 bg-[#28A745] hover:bg-[#28A745]/90 text-white font-bold rounded-lg transition shadow-xs"
              >
                Yes, Cast Ballot
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
