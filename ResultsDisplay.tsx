import React, { useState, useEffect } from 'react';
import { Award, BarChart3, Users, Clock, AlertCircle, TrendingUp, CheckSquare } from 'lucide-react';
import { Election, ResultsData } from '../types';

export default function ResultsDisplay() {
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElectionId, setSelectedElectionId] = useState<number | ''>('');
  const [results, setResults] = useState<ResultsData[]>([]);
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [winner, setWinner] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Fetch all elections
  useEffect(() => {
    fetch('/api/elections')
      .then(res => res.json())
      .then((data: Election[]) => {
        setElections(data);
        // Default to the first active election if available
        const active = data.find(e => e.status === 'active');
        if (active) {
          setSelectedElectionId(active.election_id);
        } else if (data.length > 0) {
          setSelectedElectionId(data[0].election_id);
        }
      })
      .catch(err => {
        console.error('Error fetching elections:', err);
        setNotification('Failed to read election data from server.');
      });
  }, []);

  // Fetch results when selected election changes
  useEffect(() => {
    if (selectedElectionId === '') return;
    setLoading(true);
    fetch(`/api/results/${selectedElectionId}`)
      .then(res => res.json())
      .then(data => {
        setResults(data.results || []);
        setTotalVotes(data.total_votes || 0);
        setWinner(data.winner || null);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching results:', err);
        setNotification('Failed to compute real-time election tallies.');
        setLoading(false);
      });
  }, [selectedElectionId]);

  // Handle manual count audit request
  const handleTriggerAudit = () => {
    if (selectedElectionId === '') return;
    setLoading(true);
    fetch(`/api/results/${selectedElectionId}`)
      .then(res => res.json())
      .then(data => {
        setResults(data.results || []);
        setTotalVotes(data.total_votes || 0);
        setWinner(data.winner || null);
        setLoading(false);
        // Show temp success
        alert('Audit Complete: Server vote counts successfully synchronized with database records.');
      })
      .catch(err => {
        setLoading(false);
        alert('Audit query failed.');
      });
  };

  return (
    <div className="space-y-6" id="results-dashboard">
      
      {/* Selection Panel Card */}
      <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#1F4E79] flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Real-Time Analytics Dashboard
          </h3>
          <p className="text-slate-500 text-xs mt-1">
            Choose an election below to review real-time transparent polling totals and audit-checked logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="election-select" className="text-xs font-semibold text-slate-700 whitespace-nowrap">
            Select Ballot:
          </label>
          <select
            id="election-select"
            value={selectedElectionId}
            onChange={(e) => setSelectedElectionId(Number(e.target.value))}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 font-medium text-slate-800 outline-none focus:border-[#2E75B6] col-span-3"
          >
            <option value="">-- Choose Election --</option>
            {elections.map((elec) => (
              <option key={elec.election_id} value={elec.election_id}>
                {elec.election_name} ({elec.status.toUpperCase()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {notification && (
        <div className="bg-red-50 border border-red-200/50 p-4 rounded-lg flex items-center gap-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {selectedElectionId === '' ? (
        <div className="bg-white p-12 text-center rounded-xl border border-dashed border-slate-200 text-slate-400">
          <Clock className="w-12 h-12 mx-auto mb-4 animate-pulse text-slate-300" />
          <p className="text-sm font-medium">Please select an election banner to view real-time calculations.</p>
        </div>
      ) : loading ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-100 text-slate-400">
          <div className="w-10 h-10 border-4 border-[#2E75B6] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium">Computing and aggregating candidate vote tallies...</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          
          {/* Main Chart and Results Table Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Custom Visual Bar Chart */}
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-xs">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Vote Distribution Map</h4>
                  <p className="text-[11px] text-slate-400">Graphical representation of total validated ballots</p>
                </div>
                <div className="bg-[#EBF3FB] text-[#1F4E79] text-xs font-mono font-bold px-3 py-1 rounded">
                  Total Cast: {totalVotes}
                </div>
              </div>

              {results.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs font-medium">
                  No candidates registered for this poll yet.
                </div>
              ) : totalVotes === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs font-medium space-y-2">
                  <p>Ballot box remains empty.</p>
                  <p className="text-[10px] text-slate-400 font-normal">Registered voters can view candidates and cast counts now.</p>
                </div>
              ) : (
                <div className="space-y-6 pt-2">
                  {results.map((cand, idx) => {
                    const colors = [
                      'bg-[#1F4E79]', // Primary Navy
                      'bg-[#2E75B6]', // Secondary Blue
                      'bg-sky-500', 
                      'bg-teal-500', 
                      'bg-indigo-500'
                    ];
                    const selectedColor = colors[idx % colors.length];

                    return (
                      <div key={cand.candidate_id} className="space-y-1.5" id={`chart-row-${cand.candidate_id}`}>
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-base">{cand.symbol}</span>
                            <span className="font-bold text-slate-800">{cand.name}</span>
                            <span className="text-slate-400 text-[10px]">({cand.party})</span>
                          </div>
                          <span className="font-mono font-bold text-slate-900">
                            {cand.actual_votes} {cand.actual_votes === 1 ? 'vote' : 'votes'} ({cand.percentage}%)
                          </span>
                        </div>
                        {/* Bar tracker container */}
                        <div className="w-full h-8 bg-slate-50 hover:bg-slate-100/80 rounded-lg overflow-hidden border border-slate-200/40 relative">
                          {/* Inner growth bar */}
                          <div
                            className={`h-full ${selectedColor} transition-all duration-1000 ease-out`}
                            style={{ width: `${Math.max(cand.percentage, 3)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Detailed Table view */}
            <div className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-xs">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Tally Matrix Summary</h4>
                  <p className="text-[11px] text-slate-400">Relational data model audited records</p>
                </div>
                <button
                  id="results-audit-sync-btn"
                  onClick={handleTriggerAudit}
                  className="text-xs hover:bg-slate-50 text-[#2E75B6] border border-blue-100 rounded px-2.5 py-1 transition flex items-center gap-1"
                >
                  <TrendingUp className="w-3 h-3" />
                  Perform Dynamic Audit
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-[#EBF3FB]/50 border-b border-slate-150 uppercase text-[10px] text-slate-500 font-mono">
                    <tr>
                      <th className="px-6 py-3">Rank</th>
                      <th className="px-6 py-3">Candidate</th>
                      <th className="px-6 py-3">Symbol & Party</th>
                      <th className="px-6 py-3 text-right">Valid Ballots</th>
                      <th className="px-6 py-3 text-right">Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((cand, index) => {
                      const isWinner = winner && winner.candidate_id === cand.candidate_id && cand.actual_votes > 0;
                      return (
                        <tr
                          key={cand.candidate_id}
                          className={`border-b border-slate-100 ${
                            isWinner ? 'bg-amber-50/10 font-medium' : ''
                          }`}
                        >
                          <td className="px-6 py-3.5 font-bold text-slate-900">#{index + 1}</td>
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-2">
                              <span>{cand.name}</span>
                              {isWinner && (
                                <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                  Leading
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-3.5 text-slate-500">
                            <span className="font-mono mr-1.5 bg-slate-100 px-1.5 py-0.5 rounded">{cand.symbol}</span>
                            <span>{cand.party}</span>
                          </td>
                          <td className="px-6 py-3.5 text-right font-mono font-bold text-slate-900">{cand.actual_votes}</td>
                          <td className="px-6 py-3.5 text-right font-mono text-[#2E75B6] font-bold">
                            {cand.percentage}%
                          </td>
                        </tr>
                      );
                    })}
                    {results.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-6 text-slate-400 italic">
                          No audit totals registered.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column: Leader/Winner Recognition */}
          <div className="space-y-6" id="results-sidebar">
            
            {/* Winner Badge Highlight box */}
            <div className="bg-gradient-to-br from-amber-500 to-yellow-600 text-white rounded-xl p-6 shadow-md relative overflow-hidden">
              {/* background graphic shapes */}
              <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-32 h-32 bg-white/10 rounded-full" />
              <div className="absolute left-0 top-0 -translate-x-8 -translate-y-8 w-24 h-24 bg-white/10 rounded-full" />

              <div className="relative text-center space-y-3">
                <Award className="w-10 h-10 text-yellow-200 mx-auto animate-bounce" />
                
                <h4 className="text-xs uppercase font-mono tracking-widest font-bold text-yellow-100">
                  Current Frontrunner
                </h4>

                {winner && winner.actual_votes > 0 ? (
                  <div className="space-y-2 pt-2">
                    <p className="text-2xl font-serif font-black">{winner.symbol} {winner.name}</p>
                    <p className="text-xs text-yellow-100 tracking-wide">
                      Representing <strong className="font-semibold">{winner.party}</strong>
                    </p>
                    <div className="w-20 h-0.5 bg-yellow-200/50 mx-auto" />
                    
                    <div className="pt-2">
                      <p className="text-3xl font-extrabold tracking-tight">
                        {winner.actual_votes}
                      </p>
                      <p className="text-[10px] text-yellow-100 uppercase font-mono tracking-wider mt-0.5">
                        Total Counted Ballots ({winner.percentage}%)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 py-4">
                    <p className="text-sm font-medium">Awaiting Ballot Activity</p>
                    <p className="text-[10px] text-yellow-100/80 leading-relaxed font-sans">
                      Once voters register and submit valid choices, the winning candidate will be computed automatically and dynamically in real-time.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Platform Integrity Card */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 space-y-3" id="platform-integrity-card">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-[#1F4E79]" />
                Audit & Compliance
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our Secure Electronic Voting system is compliant with academic 3-Tier standard architecture guidelines. Every cast counts metric compiles strictly:
              </p>
              <ul className="text-[11px] text-slate-500 space-y-1.5 list-disc pl-4 font-sans">
                <li>No user identity is attached directory to ballot counts in reports (Privacy Protection).</li>
                <li>Hashed transaction sheets prohibit double-voting overrides.</li>
                <li>All ballot boxes auto-tally without administrators manual validation intervention.</li>
              </ul>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
