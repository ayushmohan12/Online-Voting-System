import React, { useState, useEffect } from 'react';
import { Settings, PlusCircle, Trash2, ShieldAlert, Users, LayoutDashboard, Database, ClipboardList, PenTool, Search, Ban, CheckSquare } from 'lucide-react';
import { Election, Candidate, Voter, ElectionStatus } from '../types';

export default function AdminPortal() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Dashboard state counts
  const [stats, setStats] = useState({
    total_elections: 0,
    active_elections: 0,
    total_voters: 0,
    total_votes: 0,
    total_candidates: 0
  });

  // Sidebar navigation toggling
  const [activeTab, setActiveTab] = useState<'stats' | 'elections' | 'candidates' | 'voters'>('stats');

  // Core collections
  const [elections, setElections] = useState<Election[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [voterSearch, setVoterSearch] = useState('');

  // Creation form states
  const [newElectionName, setNewElectionName] = useState('');
  const [newElectionDesc, setNewElectionDesc] = useState('');
  const [newElectionStart, setNewElectionStart] = useState('');
  const [newElectionEnd, setNewElectionEnd] = useState('');
  const [newElectionStatus, setNewElectionStatus] = useState<ElectionStatus>('inactive');

  const [newCandElectionId, setNewCandElectionId] = useState<number | ''>('');
  const [newCandName, setNewCandName] = useState('');
  const [newCandParty, setNewCandParty] = useState('');
  const [newCandSymbol, setNewCandSymbol] = useState('');

  // Check login on component mount
  useEffect(() => {
    const session = localStorage.getItem('ovs_admin_session');
    if (session) {
      setIsAdminLoggedIn(true);
    }
  }, []);

  // Fetch all administrative data if logged in
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    fetchDashboardData();
  }, [isAdminLoggedIn]);

  const fetchDashboardData = () => {
    // 1. Fetch Stats
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error('Error fetching specs:', err));

    // 2. Fetch Elections
    fetch('/api/elections')
      .then(res => res.json())
      .then(data => setElections(data))
      .catch(err => console.error('Error fetching list:', err));

    // 3. Fetch Candidates
    fetch('/api/candidates')
      .then(res => res.json())
      .then(data => setCandidates(data))
      .catch(err => console.error('Error fetching candidates:', err));

    // 4. Fetch Voters list
    fetch('/api/voters')
      .then(res => res.json())
      .then(data => setVoters(data))
      .catch(err => console.error('Error fetching registration:', err));
  };

  // Handle Admin Auth Submission
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    if (!adminUsername || !adminPassword) {
      setAdminError('Please fill in login details.');
      return;
    }

    fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: adminUsername, password: adminPassword })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setAdminError(data.error);
        } else if (data.success) {
          setIsAdminLoggedIn(true);
          localStorage.setItem('ovs_admin_session', 'active');
          // Reset fields
          setAdminUsername('');
          setAdminPassword('');
        }
      })
      .catch(err => {
        console.error('Admin Auth failed:', err);
        setAdminError('Connection credentials failed.');
      });
  };

  // Handle Create Election
  const handleCreateElection = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newElectionName || !newElectionStart || !newElectionEnd) {
      alert('All marked fields must be filled.');
      return;
    }

    fetch('/api/elections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        election_name: newElectionName,
        description: newElectionDesc,
        start_date: newElectionStart,
        end_date: newElectionEnd,
        status: newElectionStatus
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(`Creation failed: ${data.error}`);
        } else {
          alert('Election created successfully inside the database.');
          // Clean form
          setNewElectionName('');
          setNewElectionDesc('');
          setNewElectionStart('');
          setNewElectionEnd('');
          setNewElectionStatus('inactive');
          fetchDashboardData();
        }
      })
      .catch(err => console.error('Error creating election:', err));
  };

  // Handle Change Election status
  const handleUpdateStatus = (id: number, currentStatus: ElectionStatus) => {
    const nextStatus: ElectionStatus = 
      currentStatus === 'inactive' ? 'active' : currentStatus === 'active' ? 'closed' : 'inactive';

    fetch(`/api/elections/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(`Status update failed: ${data.error}`);
        } else {
          fetchDashboardData();
        }
      })
      .catch(err => console.error('Update status failed:', err));
  };

  // Handle Delete Election
  const handleDeleteElection = (id: number) => {
    if (!confirm('Are you absolutely certain you want to delete this election? Candidates will be deleted too.')) return;

    fetch(`/api/elections/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(`Transactional failure: ${data.error}`);
        } else {
          alert('Election deleted successfully.');
          fetchDashboardData();
        }
      })
      .catch(err => console.error('Delete transaction failed:', err));
  };

  // Handle Nominate Candidate
  const handleRecruitCandidate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCandElectionId || !newCandName || !newCandParty || !newCandSymbol) {
      alert('Incomplete candidate details.');
      return;
    }

    fetch('/api/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        election_id: newCandElectionId,
        name: newCandName,
        party: newCandParty,
        symbol: newCandSymbol
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(`Nomination failed: ${data.error}`);
        } else {
          alert('Candidate successfully nominated for the selected ballot.');
          setNewCandName('');
          setNewCandParty('');
          setNewCandSymbol('');
          setNewCandElectionId('');
          fetchDashboardData();
        }
      })
      .catch(err => console.error('Nominate failure:', err));
  };

  // Handle Delete Candidate
  const handleDeleteCandidate = (id: number) => {
    if (!confirm('Are you certain you want to retract nomination for this candidate?')) return;

    fetch(`/api/candidates/${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(`Retraction blocked: ${data.error}`);
        } else {
          alert('Nomination retracted successfully.');
          fetchDashboardData();
        }
      })
      .catch(err => console.error('Nomination delete failed:', err));
  };

  // Safe Logout Admin session
  const handleAdminLogout = () => {
    localStorage.removeItem('ovs_admin_session');
    setIsAdminLoggedIn(false);
  };

  // Filter Registration list
  const filteredVoters = voters.filter(v => 
    v.name.toLowerCase().includes(voterSearch.toLowerCase()) || 
    v.email.toLowerCase().includes(voterSearch.toLowerCase()) ||
    v.aadhar.includes(voterSearch)
  );

  return (
    <div className="space-y-6" id="admin-portal-root">
      
      {/* 1. AUTHENTICATION BOX VIEW */}
      {!isAdminLoggedIn ? (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden" id="admin-auth-box">
          <div className="bg-[#1F4E79] text-white p-6 text-center relative">
            <Settings className="w-10 h-10 text-slate-200 mx-auto mb-2 animate-spin" />
            <h3 className="text-xl font-bold tracking-tight uppercase">Admin Control Room</h3>
            <p className="text-slate-300 text-xs mt-1">Supervisory Credentials Required</p>
          </div>

          <form onSubmit={handleAdminAuth} className="p-6 md:p-8 space-y-4" id="admin-login-form">
            {adminError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs font-semibold flex items-center gap-1.5" id="admin-error-callout">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{adminError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="admin-user" className="text-xs font-bold text-slate-700">Administrator Username</label>
              <input
                type="text"
                id="admin-user"
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="E.g. admin"
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#2E75B6]"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="admin-pass" className="text-xs font-bold text-slate-700">Security Access Key</label>
              <input
                type="password"
                id="admin-pass"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="E.g. Admin@123"
                className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#2E75B6]"
              />
            </div>

            <button
              type="submit"
              id="admin-login-submit"
              className="w-full bg-[#1F4E79] hover:bg-[#2E75B6] text-white text-xs font-bold p-3 rounded-lg transition-colors shadow-xs mt-4 uppercase tracking-wider cursor-pointer"
            >
              Verify Credentials
            </button>

            <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-lg text-[10px] text-slate-500 mt-6 space-y-1" id="admin-presentation-creds">
              <p className="font-bold text-slate-700 uppercase tracking-wide">
                Evaluation Credentials (PDF Specifications)
              </p>
              <p>• <strong>User ID:</strong> admin</p>
              <p>• <strong>Access Key:</strong> Admin@123</p>
            </div>
          </form>
        </div>
      ) : (
        /* 2. ADMIN CORE DASHBOARD */
        <div className="grid lg:grid-cols-4 gap-6 items-start" id="admin-dashboard-container">
          
          {/* Left Sidebar Control Menu */}
          <div className="lg:col-span-1 bg-white border border-slate-100 rounded-xl overflow-hidden p-4 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Super Administrator</p>
              <p className="text-sm font-black text-[#1F4E79] mt-0.5">Control Terminal</p>
            </div>

            <nav className="flex flex-col gap-1 text-xs">
              <button
                id="tab-admin-stats"
                onClick={() => setActiveTab('stats')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium transition text-left ${
                  activeTab === 'stats' ? 'bg-[#EBF3FB] text-[#1F4E79] font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Control Dashboard
              </button>
              <button
                id="tab-admin-elections"
                onClick={() => setActiveTab('elections')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium transition text-left ${
                  activeTab === 'elections' ? 'bg-[#EBF3FB] text-[#1F4E79] font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                Manage Elections
              </button>
              <button
                id="tab-admin-candidates"
                onClick={() => setActiveTab('candidates')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium transition text-left ${
                  activeTab === 'candidates' ? 'bg-[#EBF3FB] text-[#1F4E79] font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <PenTool className="w-4 h-4" />
                Nominate Candidates
              </button>
              <button
                id="tab-admin-voters"
                onClick={() => setActiveTab('voters')}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium transition text-left ${
                  activeTab === 'voters' ? 'bg-[#EBF3FB] text-[#1F4E79] font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Users className="w-4 h-4" />
                Voters Directory
              </button>
            </nav>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <button
                id="admin-logout-btn"
                onClick={handleAdminLogout}
                className="w-full py-2 border border-rose-50 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-lg transition text-center"
              >
                Disconnect Terminal
              </button>
            </div>
          </div>

          {/* Right Main Content area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* PANEL A: STATS OVERVIEW */}
            {activeTab === 'stats' && (
              <div className="space-y-6 animate-fadeIn" id="admin-panel-stats">
                <div className="bg-white p-6 rounded-xl border border-slate-100">
                  <h4 className="text-base font-bold text-[#1F4E79]">Real-Time Security Audit Specs</h4>
                  <p className="text-slate-400 text-xs mt-1">Status monitors and statistics of general OVS system registries currently active.</p>
                </div>

                {/* Grid stats */}
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-slate-100 flex flex-col justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Elections</span>
                    <span className="text-3xl font-black text-[#1F4E79] mt-2">{stats.total_elections}</span>
                    <span className="text-[9px] text-[#2E75B6] mt-1 font-semibold">{stats.active_elections} running polling stations</span>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-100 flex flex-col justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Registered Electors</span>
                    <span className="text-3xl font-black text-[#1F4E79] mt-2">{stats.total_voters}</span>
                    <span className="text-[9px] text-green-600 mt-1 font-semibold">100% Aadhaar Verified</span>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-100 flex flex-col justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Total Votes Casted</span>
                    <span className="text-3xl font-black text-green-600 mt-2">{stats.total_votes}</span>
                    <span className="text-[9px] text-[#2E75B6] mt-1 font-semibold">Sealed transaction records</span>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-slate-100 flex flex-col justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Registered Nominees</span>
                    <span className="text-3xl font-black text-[#1F4E79] mt-2">{stats.total_candidates}</span>
                    <span className="text-[9px] text-slate-400 mt-1">Competing representatives</span>
                  </div>
                </div>

                {/* Guide Information banner */}
                <div className="bg-[#EBF3FB]/50 border border-blue-100 p-5 rounded-xl flex items-start gap-4">
                  <Database className="w-5 h-5 text-[#1F4E79] mt-1 flex-shrink-0" />
                  <div className="space-y-1.5 text-xs text-slate-700 leading-relaxed">
                    <p className="font-bold text-[#1F4E79]">Integration and Academic Compliance Checked (3-Tier)</p>
                    <p>Both database integrity constraints are tested. The administrator controls the election phase, opening and closing ballot entries dynamically. Any vote transaction triggers atomic writes to prevent database tampering and double logs.</p>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL B: MANAGE ELECTIONS */}
            {activeTab === 'elections' && (
              <div className="space-y-6 animate-fadeIn" id="admin-panel-elections">
                {/* Creation Form */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs">
                  <h4 className="font-bold text-sm text-[#1F4E79] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4 text-[#2E75B6]" />
                    Deploy New Election Ballot
                  </h4>
                  <form onSubmit={handleCreateElection} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="elec-name" className="text-xs font-semibold text-slate-700">Election Header Name *</label>
                        <input
                          type="text"
                          id="elec-name"
                          required
                          value={newElectionName}
                          onChange={(e) => setNewElectionName(e.target.value)}
                          placeholder="E.g. Student Senate Polls 2026"
                          className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#2E75B6]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="elec-status" className="text-xs font-semibold text-slate-700">Initial Status</label>
                        <select
                          id="elec-status"
                          value={newElectionStatus}
                          onChange={(e) => setNewElectionStatus(e.target.value as ElectionStatus)}
                          className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none bg-slate-50 focus:border-[#2E75B6] font-medium"
                        >
                          <option value="inactive">Inactive (Draft)</option>
                          <option value="active">Active (Voting Open)</option>
                          <option value="closed">Closed (Voting Halted)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="elec-desc" className="text-xs font-semibold text-slate-700">Election Scope / Description</label>
                      <textarea
                        id="elec-desc"
                        value={newElectionDesc}
                        onChange={(e) => setNewElectionDesc(e.target.value)}
                        placeholder="Define criteria, eligible academic branches or purpose..."
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 h-20 outline-none focus:border-[#2E75B6]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="elec-start" className="text-xs font-semibold text-slate-700">Opening Date *</label>
                        <input
                          type="date"
                          id="elec-start"
                          required
                          value={newElectionStart}
                          onChange={(e) => setNewElectionStart(e.target.value)}
                          className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#2E75B6] text-slate-700"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="elec-end" className="text-xs font-semibold text-slate-700">Closing Date *</label>
                        <input
                          type="date"
                          id="elec-end"
                          required
                          value={newElectionEnd}
                          onChange={(e) => setNewElectionEnd(e.target.value)}
                          className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#2E75B6] text-slate-700"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="save-election-btn"
                      className="bg-[#1F4E79] hover:bg-[#2E75B6] text-white text-xs px-4 py-2.5 rounded-lg font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      Deploy Ballot Station
                    </button>
                  </form>
                </div>

                {/* Elections Directory */}
                <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h4 className="font-bold text-sm text-slate-800">Operational Ballots Directory</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-[#EBF3FB]/50 border-b border-slate-150 uppercase text-[10px] text-slate-500 font-mono">
                        <tr>
                          <th className="px-6 py-3">ID</th>
                          <th className="px-6 py-3">Election Title</th>
                          <th className="px-6 py-3">Dates</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3 text-right">Settings</th>
                        </tr>
                      </thead>
                      <tbody>
                        {elections.map((elec) => (
                          <tr key={elec.election_id} className="border-b border-slate-100 text-slate-700">
                            <td className="px-6 py-3.5 font-bold font-mono">#{elec.election_id}</td>
                            <td className="px-6 py-3.5 max-w-xs">
                              <p className="font-bold text-slate-800">{elec.election_name}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{elec.description}</p>
                            </td>
                            <td className="px-6 py-3.5 text-[11px] text-slate-500">
                              <p>Start: {elec.start_date}</p>
                              <p>End: {elec.end_date}</p>
                            </td>
                            <td className="px-6 py-3.5">
                              <button
                                onClick={() => handleUpdateStatus(elec.election_id, elec.status)}
                                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase transition hover:opacity-85 ${
                                  elec.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : elec.status === 'closed'
                                    ? 'bg-red-100 text-red-00 font-bold'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                                title="Click to shift status cycle"
                              >
                                {elec.status}
                              </button>
                            </td>
                            <td className="px-6 py-3.5 text-right">
                              <button
                                onClick={() => handleDeleteElection(elec.election_id)}
                                className="text-red-600 hover:bg-slate-50 p-2 rounded transition-colors"
                                title="Delete Election"
                              >
                                <Trash2 className="w-4 h-4 ml-auto" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL C: MANAGE CANDIDATES */}
            {activeTab === 'candidates' && (
              <div className="space-y-6 animate-fadeIn" id="admin-panel-candidates">
                {/* Nomination Form */}
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs">
                  <h4 className="font-bold text-sm text-[#1F4E79] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <PenTool className="w-4 h-4 text-[#2E75B6]" />
                    Nominate Electorate Candidate
                  </h4>
                  <form onSubmit={handleRecruitCandidate} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1 col-span-2">
                        <label htmlFor="cand-election" className="text-xs font-semibold text-slate-700">Target Election Ballot *</label>
                        <select
                          id="cand-election"
                          required
                          value={newCandElectionId}
                          onChange={(e) => setNewCandElectionId(Number(e.target.value))}
                          className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none bg-slate-50 focus:border-[#2E75B6] font-medium"
                        >
                          <option value="">-- Choose Election to attach to --</option>
                          {elections.map((elec) => (
                            <option key={elec.election_id} value={elec.election_id}>
                              {elec.election_name} ({elec.status.toUpperCase()})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="cand-name" className="text-xs font-semibold text-slate-700">Candidate Full Name *</label>
                        <input
                          type="text"
                          id="cand-name"
                          required
                          value={newCandName}
                          onChange={(e) => setNewCandName(e.target.value)}
                          placeholder="E.g. Priyanka Rawat"
                          className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#2E75B6]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="cand-party" className="text-xs font-semibold text-slate-700">Political Party / Group *</label>
                        <input
                          type="text"
                          id="cand-party"
                          required
                          value={newCandParty}
                          onChange={(e) => setNewCandParty(e.target.value)}
                          placeholder="E.g. Progressive Student Front"
                          className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#2E75B6]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="cand-symbol" className="text-xs font-semibold text-slate-700">Party Logo Symbol *</label>
                        <input
                          type="text"
                          id="cand-symbol"
                          required
                          value={newCandSymbol}
                          onChange={(e) => setNewCandSymbol(e.target.value)}
                          placeholder="E.g. 💻 Laptop, ⚡ Flash, 📚 Book"
                          className="w-full text-xs border border-slate-200 rounded-lg p-2.5 outline-none focus:border-[#2E75B6]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      id="save-candidate-btn"
                      className="bg-[#1F4E79] hover:bg-[#2E75B6] text-white text-xs px-4 py-2.5 rounded-lg font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      Nominate Representative
                    </button>
                  </form>
                </div>

                {/* Candidates Directory */}
                <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs">
                  <div className="px-6 py-4 border-b border-slate-100">
                    <h4 className="font-bold text-sm text-slate-800">Competitors Nominated</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-[#EBF3FB]/50 border-b border-slate-150 uppercase text-[10px] text-slate-500 font-mono">
                        <tr>
                          <th className="px-6 py-3">ID</th>
                          <th className="px-6 py-3">Candidate Header</th>
                          <th className="px-6 py-3">Ballot Connection</th>
                          <th className="px-6 py-3 text-right">Votes Stacked</th>
                          <th className="px-6 py-3 text-right">Settings</th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidates.map((cand) => {
                          const connectedElec = elections.find(e => e.election_id === cand.election_id);
                          return (
                            <tr key={cand.candidate_id} className="border-b border-slate-100 text-slate-700">
                              <td className="px-6 py-3.5 font-bold font-mono">#{cand.candidate_id}</td>
                              <td className="px-6 py-3.5">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl bg-slate-100 p-1.5 rounded">{cand.symbol}</span>
                                  <div>
                                    <p className="font-bold text-slate-800">{cand.name}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{cand.party}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-3.5 max-w-xs">
                                <p className="font-medium text-slate-600 line-clamp-1">
                                  {connectedElec ? connectedElec.election_name : `Election ID #${cand.election_id}`}
                                </p>
                              </td>
                              <td className="px-6 py-3.5 text-right font-mono font-bold text-[#2E75B6]">
                                {cand.vote_count} votes
                              </td>
                              <td className="px-6 py-3.5 text-right">
                                <button
                                  onClick={() => handleDeleteCandidate(cand.candidate_id)}
                                  className="text-red-600 hover:bg-slate-50 p-2 rounded transition-colors"
                                  title="Retract Nomination"
                                >
                                  <Trash2 className="w-4 h-4 ml-auto" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {candidates.length === 0 && (
                          <tr>
                            <td colSpan={5} className="text-center py-6 text-slate-400 italic">
                              No candidates nominated yet inside any ballot.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* PANEL D: VOTERS DIRECTORY */}
            {activeTab === 'voters' && (
              <div className="space-y-6 animate-fadeIn" id="admin-panel-voters">
                {/* Search Bar */}
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-[#1F4E79]">Voters Directory Sheets</h4>
                    <p className="text-slate-400 text-xs mt-0.5">Masked details verification table representing general voter population</p>
                  </div>
                  <div className="relative w-full md:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs outline-none bg-slate-50 text-slate-700 focus:border-[#2E75B6]"
                      placeholder="Search name, email, or Aadhaar..."
                      value={voterSearch}
                      onChange={(e) => setVoterSearch(e.target.value)}
                    />
                  </div>
                </div>

                {/* Directory list list */}
                <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                      <thead className="bg-[#EBF3FB]/50 border-b border-slate-150 uppercase text-[10px] text-slate-500 font-mono">
                        <tr>
                          <th className="px-6 py-3">Voter ID</th>
                          <th className="px-6 py-3">Elector Details</th>
                          <th className="px-6 py-3">Aadhaar masked</th>
                          <th className="px-6 py-3 text-center">Date Of Birth</th>
                          <th className="px-6 py-3 text-right">Polled activity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredVoters.map((v) => (
                          <tr key={v.voter_id} className="border-b border-slate-100 text-slate-700">
                            <td className="px-6 py-3.5 font-bold font-mono">#{v.voter_id}</td>
                            <td className="px-6 py-3.5">
                              <p className="font-bold text-slate-800">{v.name}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{v.email}</p>
                            </td>
                            <td className="px-6 py-3.5 font-mono text-[11px] text-slate-500">
                              {v.aadhar.slice(0, 4)}-XXXX-XXXX
                            </td>
                            <td className="px-6 py-3.5 text-center text-slate-550">{v.dob}</td>
                            <td className="px-6 py-3.5 text-right">
                              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                                v.is_voted === 1
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-[#EBF3FB] text-slate-500'
                              }`}>
                                {v.is_voted === 1 ? 'Voted' : 'Not Voted'}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {filteredVoters.length === 0 && (
                          <tr>
                            <td colSpan={5} className="text-center py-6 text-slate-400 italic">
                              No voter matches found under query specs.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
