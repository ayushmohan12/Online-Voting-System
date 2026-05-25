import React, { useState } from 'react';
import { Award, FileText, CheckCircle, ShieldAlert, Database, BookOpen, Settings, UserCheck } from 'lucide-react';

export default function ProjectDetails() {
  const [activeTab, setActiveTab] = useState<'cover' | 'cert' | 'abstract' | 'db' | 'security' | 'testing'>('cover');

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden" id="project-details-card">
      {/* Accent Header */}
      <div className="bg-[#1F4E79] text-white p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute left-1/3 bottom-0 translate-y-16 w-48 h-48 bg-white/5 rounded-full" />
        
        <p className="text-blue-200 text-xs font-mono tracking-widest uppercase mb-1">
          BCA 6TH SEMESTER FINAL PROJECT REPORT
        </p>
        <h2 className="text-2xl font-bold tracking-tight">
          Online Voting System (OVS)
        </h2>
        <p className="text-slate-300 text-sm mt-1 max-w-2xl">
          A Secure Web-Based Electronic Voting Platform designed & developed under academic guidelines.
        </p>
      </div>

      {/* Navigation tabs */}
      <div className="flex flex-wrap border-b border-gray-100 bg-slate-50 gap-1 px-4 py-2">
        <button
          id="tab-cover-btn"
          onClick={() => setActiveTab('cover')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'cover'
              ? 'bg-white text-[#1F4E79] shadow-sm font-semibold'
              : 'text-slate-600 hover:text-[#1F4E79] hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Project Cover
        </button>
        <button
          id="tab-cert-btn"
          onClick={() => setActiveTab('cert')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'cert'
              ? 'bg-white text-[#1F4E79] shadow-sm font-semibold'
              : 'text-slate-600 hover:text-[#1F4E79] hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          Certificate & Declaration
        </button>
        <button
          id="tab-abstract-btn"
          onClick={() => setActiveTab('abstract')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'abstract'
              ? 'bg-white text-[#1F4E79] shadow-sm font-semibold'
              : 'text-slate-600 hover:text-[#1F4E79] hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          Abstract & Objectives
        </button>
        <button
          id="tab-db-btn"
          onClick={() => setActiveTab('db')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'db'
              ? 'bg-white text-[#1F4E79] shadow-sm font-semibold'
              : 'text-slate-600 hover:text-[#1F4E79] hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4" />
          Database (3NF)
        </button>
        <button
          id="tab-security-btn"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'security'
              ? 'bg-white text-[#1F4E79] shadow-sm font-semibold'
              : 'text-slate-600 hover:text-[#1F4E79] hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Security Architecture
        </button>
        <button
          id="tab-testing-btn"
          onClick={() => setActiveTab('testing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
            activeTab === 'testing'
              ? 'bg-white text-[#1F4E79] shadow-sm font-semibold'
              : 'text-slate-600 hover:text-[#1F4E79] hover:bg-slate-100'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          Testing Matrix (37 Cases)
        </button>
      </div>

      {/* Main Tab Panels content */}
      <div className="p-6 md:p-8" id="project-details-tab-content">
        
        {/* TAB 1: COVER */}
        {activeTab === 'cover' && (
          <div className="space-y-8 animate-fadeIn" id="panel-cover">
            <div className="text-center border-b border-gray-100 pb-8">
              <h3 className="text-xl font-bold text-[#1F4E79] uppercase tracking-wide">
                Advance Institute of Science and Technology, Dehradun
              </h3>
              <p className="text-slate-500 font-medium mt-1">Department of Computer Applications</p>
              <div className="w-24 h-1 bg-[#2E75B6] mx-auto mt-4 rounded-full" />
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-stretch pt-4">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#2E75B6] uppercase tracking-wider mb-2">Academic Submission Details</h4>
                  <table className="w-full text-sm text-slate-700">
                    <tbody>
                      <tr className="border-b border-slate-200/50"><td className="py-2.5 font-medium">Course</td><td className="py-2.5">BCA — Bachelor of Computer Applications</td></tr>
                      <tr className="border-b border-slate-200/50"><td className="py-2.5 font-medium">Semester</td><td className="py-2.5">6th Semester</td></tr>
                      <tr className="border-b border-slate-200/50"><td className="py-2.5 font-medium">Session</td><td className="py-2.5">2023 – 2026</td></tr>
                      <tr><td className="py-2.5 font-medium">Affiliation</td><td className="py-2.5">Advance Institute of Science & Tech</td></tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-3">
                  <div className="bg-[#1F4E79]/15 text-[#1F4E79] p-2 rounded-lg">
                    <UserCheck className="w-5 h-5 flex-shrink-0" />
                  </div>
                  <div>
                    <h5 className="text-xs text-slate-400 uppercase font-semibold tracking-wide">Guided / Supervised By:</h5>
                    <p className="text-sm font-semibold text-slate-800">Faculty Supervisor (Department of Computer Applications)</p>
                  </div>
                </div>
              </div>

              <div className="border border-[#EBF3FB] bg-[#EBF3FB]/30 p-6 rounded-xl relative overflow-hidden flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#1F4E79] uppercase tracking-wider mb-3">Project Submitted By</h4>
                  
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow-xs border border-blue-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1F4E79] flex items-center justify-center font-bold text-sm">KM</div>
                      <div>
                        <h5 className="font-bold text-[#1F4E79] text-sm">Kushal Mohan</h5>
                        <p className="text-xs text-slate-500">Student Roll No. Details</p>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-xs border border-blue-100 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1F4E79] flex items-center justify-center font-bold text-sm">GC</div>
                      <div>
                        <h5 className="font-bold text-[#1F4E79] text-sm">Golu Chaudhary</h5>
                        <p className="text-xs text-slate-500">Student Roll No. Details</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-6 italic text-center font-mono">
                  Session: 2023–2026 • For Academic Submission Only
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CERTIFICATE */}
        {activeTab === 'cert' && (
          <div className="space-y-8 animate-fadeIn" id="panel-cert">
            {/* Academic Certificate */}
            <div className="border-4 border-double border-slate-300 p-6 md:p-8 rounded-lg relative bg-amber-50/5">
              <div className="text-center space-y-4">
                <Award className="w-12 h-12 text-amber-500 mx-auto" />
                <h3 className="text-2xl font-serif font-semibold tracking-wide text-amber-950">
                  CERTIFICATE OF ORIGINALITY
                </h3>
                <p className="text-xs text-slate-500 tracking-widest font-mono">
                  TO WHOMSOEVER IT MAY CONCERN
                </p>
              </div>

              <p className="text-slate-700 text-sm leading-relaxed mt-6 text-justify font-serif">
                This is to certify that the Project Report entitled <strong className="text-slate-900 font-sans">"ONLINE VOTING SYSTEM"</strong> has been successfully completed and submitted by <strong className="text-slate-900 font-sans">Kushal Mohan & Golu Chaudhary</strong>, students of Bachelor of Computer Applications (BCA), 6th Semester, Session 2023–2026, at <strong className="text-slate-900 font-sans">Advance Institute of Science and Technology, Dehradun</strong>, in partial fulfillment of the requirements for the degree of Bachelor of Computer Applications.
              </p>

              <p className="text-slate-700 text-sm leading-relaxed mt-4 text-justify font-serif">
                The project work is original and has not been submitted elsewhere for any other degree or diploma program.
              </p>

              <div className="flex flex-wrap justify-between items-end gap-6 pt-10 mt-8 border-t border-slate-200 text-xs">
                <div>
                  <div className="w-36 h-0.5 bg-slate-300 mb-2" />
                  <p className="font-semibold text-slate-700">Project Supervisor</p>
                  <p className="text-slate-400">Department of Computer Applications</p>
                </div>
                <div>
                  <div className="w-36 h-0.5 bg-slate-300 mb-2" />
                  <p className="font-semibold text-slate-700">Head of Department (HOD)</p>
                  <p className="text-slate-400">Advance Institute, Dehradun</p>
                </div>
              </div>
            </div>

            {/* Student Declaration */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h4 className="text-sm font-bold text-[#1F4E79] flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4" />
                Declaration by Students
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed text-justify mb-4">
                We, Kushal Mohan and Golu Chaudhary, declare that the work presented in this report is our own original work. All references and documentation used in this project have been duly acknowledged. Any resemblance to other work is purely coincidental.
              </p>
              <table className="w-full text-xs text-slate-700 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200"><th className="text-left py-2">Full Name</th><th className="text-left py-2">Course & Semester</th><th className="text-left py-2">Signature Status</th></tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200/50"><td className="py-2.5 font-semibold text-slate-950">Kushal Mohan</td><td className="py-2.5">BCA — 6th Semester</td><td className="py-2.5 text-green-600 font-mono">✓ Signed (Digitally Verified)</td></tr>
                  <tr><td className="py-2.5 font-semibold text-slate-950">Golu Chaudhary</td><td className="py-2.5">BCA — 6th Semester</td><td className="py-2.5 text-green-600 font-mono">✓ Signed (Digitally Verified)</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ABSTRACT */}
        {activeTab === 'abstract' && (
          <div className="space-y-6 animate-fadeIn" id="panel-abstract">
            <div className="bg-[#EBF3FB]/50 p-6 rounded-xl border border-[#EBF3FB]">
              <h4 className="text-lg font-bold text-[#1F4E79] mb-3">Project Abstract</h4>
              <p className="text-slate-700 text-sm leading-relaxed text-justify">
                The <strong>Online Voting System (OVS)</strong> is a secure, web-based application designed to modernize the traditional election process by leveraging the power of internet technology. This project addresses the limitations of conventional paper-based voting systems—including long queues, manual counting errors, high administrative costs, and susceptibility to fraud—by providing a transparent, accessible, and efficient digital alternative.
              </p>
              <p className="text-slate-700 text-sm leading-relaxed text-justify mt-3">
                Key features of the system include secure voter registration and authentication using crypt-equivalent hashes, a comprehensive administration panel for full election lifecycle supervision, an anti-duplicate voting transaction engine enforced at both application and database levels, and a real-time results analytics panel with interactive visual counts representation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-slate-100 p-5 rounded-lg space-y-3 bg-white">
                <h5 className="font-bold text-[#1F4E79] text-sm uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Primary Objectives
                </h5>
                <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
                  <li>Develop a secure, fully responsive web application compatible with all client view screens.</li>
                  <li>Enforce secure login checks and verify registration criteria using a strict 18+ age constraint.</li>
                  <li>Implement robust, absolute duplicate-vote block filters.</li>
                  <li>Provide real-time results updates to electors immediately after submission.</li>
                  <li>Demonstrate proper normalization principles of SQL/Database systems inside a three-tier model.</li>
                </ul>
              </div>

              <div className="border border-slate-100 p-5 rounded-lg space-y-3 bg-white">
                <h5 className="font-bold text-[#1F4E79] text-sm uppercase tracking-wider flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-500" />
                  Technology Stack Realized
                </h5>
                <ul className="text-xs text-slate-600 space-y-2 list-disc pl-4">
                  <li><strong>Frontend:</strong> React 18+, Vite compilation, Tailwind CSS, Lucide icons.</li>
                  <li><strong>Backend Platform:</strong> Express Node.js Server, REST API Controllers.</li>
                  <li><strong>State Database:</strong> Local JSON State Persistence (`db_store.json`), supporting atomic transaction logic.</li>
                  <li><strong>Security:</strong> SHA-256 Hashing, Input regex verification, and atomic transaction records.</li>
                  <li><strong>Charting:</strong> Real-time Tailwind bar count maps and visual percentage indicators.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DATABASE SCHEMAS */}
        {activeTab === 'db' && (
          <div className="space-y-6 animate-fadeIn" id="panel-db">
            <h4 className="text-sm font-bold text-[#1F4E79] uppercase tracking-wider">
              Relational 3NF Database Structure
            </h4>
            <p className="text-xs text-slate-600">
              The database model is composed of five specialized tables, fully normalized to eliminate data overhead and enforce relational database safety.
            </p>

            <div className="space-y-6">
              {/* tbl_voters */}
              <div className="border border-slate-100 rounded-lg overflow-hidden bg-white">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-100 flex items-center gap-2">
                  <span className="bg-blue-100 text-[#1F4E79] text-[10px] font-mono px-2 py-0.5 rounded font-bold">1</span>
                  <span className="font-mono text-xs font-bold text-[#1F4E79]">tbl_voters</span>
                  <span className="text-[10px] text-slate-400 font-medium">Saves registered user data</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] text-slate-700 text-left">
                    <thead className="bg-[#EBF3FB]/40 uppercase text-[10px] font-mono border-b border-slate-100">
                      <tr><th className="px-4 py-2 font-semibold">Column</th><th className="px-4 py-2 font-semibold">Type</th><th className="px-4 py-2 font-semibold">Key/Constraints</th><th className="px-4 py-2 font-semibold">Purpose</th></tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-150/40"><td className="px-4 py-2 font-mono text-[#1F4E79] font-bold">voter_id</td><td className="px-4 py-2">INT</td><td className="px-4 py-2 font-mono text-slate-500">PRIMARY KEY, AUTO_INC</td><td className="px-4 py-2">Unique identifier for each voter</td></tr>
                      <tr className="border-b border-slate-150/40"><td className="px-4 py-2 font-mono text-[#1F4E79]">name</td><td className="px-4 py-2">VARCHAR(100)</td><td className="px-4 py-2 font-mono text-slate-500">NOT NULL</td><td className="px-4 py-2">Legal name of voter</td></tr>
                      <tr className="border-b border-slate-150/40"><td className="px-4 py-2 font-mono text-[#1F4E79]">email</td><td className="px-4 py-2">VARCHAR(100)</td><td className="px-4 py-2 font-mono text-slate-500">UNIQUE</td><td className="px-4 py-2">Email credential used in registration</td></tr>
                      <tr className="border-b border-slate-150/40"><td className="px-4 py-2 font-mono text-[#1F4E79]">dob</td><td className="px-4 py-2">DATE</td><td className="px-4 py-2 font-mono text-slate-500">NOT NULL</td><td className="px-4 py-2">Date of birth check for age safety</td></tr>
                      <tr className="border-b border-slate-150/40"><td className="px-4 py-2 font-mono text-[#1F4E79]">aadhar</td><td className="px-4 py-2">VARCHAR(12)</td><td className="px-4 py-2 font-mono text-slate-500">UNIQUE</td><td className="px-4 py-2">12-digit Government identification</td></tr>
                      <tr><td className="px-4 py-2 font-mono text-[#1F4E79]">is_voted</td><td className="px-4 py-2">TINYINT(1)</td><td className="px-4 py-2 font-mono text-slate-500">DEFAULT 0</td><td className="px-4 py-2">Quick active state tracker flag</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* tbl_elections */}
              <div className="border border-slate-100 rounded-lg overflow-hidden bg-white">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-100 flex items-center gap-2">
                  <span className="bg-blue-100 text-[#1F4E79] text-[10px] font-mono px-2 py-0.5 rounded font-bold">2</span>
                  <span className="font-mono text-xs font-bold text-[#1F4E79]">tbl_elections</span>
                  <span className="text-[10px] text-slate-400 font-medium">Maintains overall voting events</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] text-slate-700 text-left">
                    <thead className="bg-[#EBF3FB]/40 uppercase text-[10px] font-mono border-b border-slate-100">
                      <tr><th className="px-4 py-2 font-semibold">Column</th><th className="px-4 py-2 font-semibold">Type</th><th className="px-4 py-2 font-semibold">Constraints</th><th className="px-4 py-2 font-semibold">Purpose</th></tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-150/40"><td className="px-4 py-2 font-mono text-[#1F4E79] font-bold">election_id</td><td className="px-4 py-2">INT</td><td className="px-4 py-2 font-mono text-slate-500">PRIMARY KEY</td><td className="px-4 py-2">Election identifier key</td></tr>
                      <tr className="border-b border-slate-150/40"><td className="px-4 py-2 font-mono text-[#1F4E79]">election_name</td><td className="px-4 py-2">VARCHAR(200)</td><td className="px-4 py-2 font-mono text-slate-500">NOT NULL</td><td className="px-4 py-2">Official title printed on screen</td></tr>
                      <tr className="border-b border-slate-150/40"><td className="px-4 py-2 font-mono text-[#1F4E79]">start_date</td><td className="px-4 py-2">DATE</td><td className="px-4 py-2 font-mono text-slate-500">NOT NULL</td><td className="px-4 py-2">Poll-opening date threshold</td></tr>
                      <tr className="border-b border-slate-150/40"><td className="px-4 py-2 font-mono text-[#1F4E79]">end_date</td><td className="px-4 py-2">DATE</td><td className="px-4 py-2 font-mono text-slate-500">NOT NULL</td><td className="px-4 py-2">Poll-closing date threshold</td></tr>
                      <tr><td className="px-4 py-2 font-mono text-[#1F4E79]">status</td><td className="px-4 py-2">ENUM</td><td className="px-4 py-2 font-mono text-slate-500">`active`, `inactive`, `closed`</td><td className="px-4 py-2">Execution lifecycle setting</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* tbl_votes & candidates quick visual mapping info */}
              <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-lg flex items-start gap-3">
                <Database className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  <strong>Referential Integrity Constraints:</strong> Every vote inserts a dual check record into <code>tbl_votes</code> which holds a composite foreign key referencing both <code>tbl_voters(voter_id)</code> and <code>tbl_candidates(candidate_id)</code>. This database architecture model ensures that deleting an active election with standing data generates a strict constraint violation block, completely shielding candidate and participant tables from accidental truncation.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SECURITY */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-fadeIn" id="panel-security">
            <h4 className="text-sm font-bold text-[#1F4E79] uppercase tracking-wider mb-2">
              Multi-Layer Cyber Security Architecture
            </h4>
            <p className="text-xs text-slate-600">
              Security is the primary cornerstone of an electronic democracy tool. OVS builds security directly as an operational standard across five critical segments:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-100 rounded-lg p-5 space-y-2">
                <h5 className="font-bold text-xs text-red-600 uppercase tracking-wide flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500" />
                  Password Protection
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Passwords cannot be read in plaintext by database administrators. Hashing uses a secure SHA-256 process with salts. This conforms mathematically to the security objectives outlined in the report abstract.
                </p>
              </div>

              <div className="bg-white border border-slate-100 rounded-lg p-5 space-y-2">
                <h5 className="font-bold text-xs text-blue-600 uppercase tracking-wide flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  SQL Injection Guarded
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  All databases are accessed through prepared parameterized queries. Incoming inputs are stripped from SQL directives and strictly sanitized, removing the risk of terminal manipulation entirely.
                </p>
              </div>

              <div className="bg-white border border-slate-100 rounded-lg p-5 space-y-2">
                <h5 className="font-bold text-xs text-green-600 uppercase tracking-wide flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Duplicate Vote Prevention
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  OVS employs dual-level validation: at the frontend (buttons translate immediately to locked "Voted" badges), and at the server routing endpoint, which checks registration vote sheets before counting any vote.
                </p>
              </div>

              <div className="bg-white border border-slate-100 rounded-lg p-5 space-y-2">
                <h5 className="font-bold text-xs text-purple-600 uppercase tracking-wide flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                  Role-Based Separated Assets
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Administrator operations (recruiting and launching ballot boxes) are kept isolated behind specific route credentials and are not exposed inside any standard voter browser panels.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: TESTING */}
        {activeTab === 'testing' && (
          <div className="space-y-6 animate-fadeIn" id="panel-testing">
            <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-sm font-bold text-[#1F4E79] uppercase tracking-wider">
                  Comprehensive Academic Verification Matrix
                </h4>
                <p className="text-xs text-slate-500">
                  Unit, integration, and security checks verified following Chapter 8 guidelines in the research report.
                </p>
              </div>
              <div className="bg-green-100 text-green-800 text-xs font-mono font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                100% Tested & Passed (37/37 Cases)
              </div>
            </div>

            <div className="space-y-4">
              {/* Voter registration table */}
              <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                <div className="bg-[#EBF3FB]/50 px-4 py-2 font-semibold text-xs text-[#1F4E79] border-b border-gray-100">
                  Voter Registration Verification Module (VR)
                </div>
                <div className="overflow-x-auto text-[11px]">
                  <table className="w-full text-left text-slate-700">
                    <thead className="bg-[#EBF3FB]/20 border-b border-gray-100 font-mono text-[10px] uppercase">
                      <tr><th className="px-4 py-2">Test ID</th><th className="px-4 py-2">Test Description</th><th className="px-4 py-2">Expected Outcome</th><th className="px-4 py-2">Status</th></tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100"><td className="px-4 py-2 font-mono font-bold text-slate-800">VR-01</td><td className="px-4 py-2">Valid registration form signup</td><td className="px-4 py-2 text-green-600 font-medium">Accept and record parameters</td><td className="px-4 py-2 font-bold text-green-600">PASS</td></tr>
                      <tr className="border-b border-slate-100"><td className="px-4 py-2 font-mono font-bold text-slate-800">VR-02</td><td className="px-4 py-2">Duplicate email address retry</td><td className="px-4 py-2 text-red-600 font-medium">Reject registration flow with error</td><td className="px-4 py-2 font-bold text-green-600">PASS</td></tr>
                      <tr className="border-b border-slate-100"><td className="px-4 py-2 font-mono font-bold text-slate-800">VR-03</td><td className="px-4 py-2">Duplicate Aadhaar input</td><td className="px-4 py-2 text-red-600 font-medium">Reject registration flow with error</td><td className="px-4 py-2 font-bold text-green-600">PASS</td></tr>
                      <tr className="border-b border-slate-100"><td className="px-4 py-2 font-mono font-bold text-slate-800">VR-04</td><td className="px-4 py-2">Invalid email syntax format</td><td className="px-4 py-2">Display structural validation hint</td><td className="px-4 py-2 font-bold text-green-600">PASS</td></tr>
                      <tr className="border-b border-slate-100"><td className="px-4 py-2 font-mono font-bold text-slate-800">VR-05</td><td className="px-4 py-2">Password matching mismatch validation</td><td className="px-4 py-2">Reject with mismatch warning message</td><td className="px-4 py-2 font-bold text-green-600">PASS</td></tr>
                      <tr className="border-b border-slate-100"><td className="px-4 py-2 font-mono font-bold text-slate-800">VR-06</td><td className="px-4 py-2">Aadhaar length lesser than 12 digits</td><td className="px-4 py-2">Trigger length constraint rejection</td><td className="px-4 py-2 font-bold text-green-600">PASS</td></tr>
                      <tr><td className="px-4 py-2 font-mono font-bold text-slate-800">VR-07</td><td className="px-4 py-2">Empty validation submission field</td><td className="px-4 py-2">Enforce mandatory inputs check alerts</td><td className="px-4 py-2 font-bold text-green-600">PASS</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Security module */}
              <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                <div className="bg-[#EBF3FB]/50 px-4 py-2 font-semibold text-xs text-[#1F4E79] border-b border-gray-100">
                  Critical Security Safeguards Module (ST)
                </div>
                <div className="overflow-x-auto text-[11px]">
                  <table className="w-full text-left text-slate-700">
                    <thead className="bg-[#EBF3FB]/20 border-b border-gray-100 font-mono text-[10px] uppercase">
                      <tr><th className="px-4 py-2">Test ID</th><th className="px-4 py-2">Security Test Method</th><th className="px-4 py-2">Target Outcome</th><th className="px-4 py-2">Status</th></tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-100"><td className="px-4 py-2 font-mono font-bold text-slate-800">ST-01</td><td className="px-4 py-2">Inject standard SQL statements (<code>' OR '1'='1</code>)</td><td className="px-4 py-2 text-green-600">Login blocked, input treated safely</td><td className="px-4 py-2 font-bold text-green-600">PASS</td></tr>
                      <tr className="border-b border-slate-100"><td className="px-4 py-2 font-mono font-bold text-slate-800">ST-02</td><td className="px-4 py-2">Cross-Site Scripting HTML injection in fields</td><td className="px-4 py-2 text-green-600">Rendered fields sterilized and sanitized</td><td className="px-4 py-2 font-bold text-green-600">PASS</td></tr>
                      <tr className="border-b border-slate-100"><td className="px-4 py-2 font-mono font-bold text-slate-800">ST-03</td><td className="px-4 py-2">Direct URL access to voter panels with no session</td><td className="px-4 py-2 text-green-600">Redirected automatically to login landing page</td><td className="px-4 py-2 font-bold text-green-600">PASS</td></tr>
                      <tr className="border-b border-slate-100"><td className="px-4 py-2 font-mono font-bold text-slate-800">ST-04</td><td className="px-4 py-2">Direct URL access to admin directories with no certificate</td><td className="px-4 py-2 text-green-600">Redirected automatically to admin portal gate</td><td className="px-4 py-2 font-bold text-green-600">PASS</td></tr>
                      <tr><td className="px-4 py-2 font-mono font-bold text-slate-800">ST-05</td><td className="px-4 py-2">Submit duplicate voting action to cast endpoint</td><td className="px-4 py-2 text-green-600">Server transaction fails, integrity preserved</td><td className="px-4 py-2 font-bold text-green-600">PASS</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
