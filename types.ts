export type ElectionStatus = 'active' | 'inactive' | 'closed';

export interface Voter {
  voter_id: number;
  name: string;
  email: string;
  dob: string;
  aadhar: string;
  is_voted: number; // 0 = not voted, 1 = voted
  created_at: string;
  password_hash?: string;
}

export interface Election {
  election_id: number;
  election_name: string;
  description: string;
  start_date: string;
  end_date: string;
  status: ElectionStatus;
  created_at: string;
}

export interface Candidate {
  candidate_id: number;
  election_id: number;
  name: string;
  party: string;
  symbol: string;
  vote_count: number;
}

export interface Vote {
  vote_id: number;
  voter_id: number;
  candidate_id: number;
  election_id: number;
  voted_at: string;
}

export interface Admin {
  admin_id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface ResultsData {
  candidate_id: number;
  name: string;
  party: string;
  symbol: string;
  actual_votes: number;
  percentage: number;
}

export interface DbSchema {
  voters: Voter[];
  elections: Election[];
  candidates: Candidate[];
  votes: Vote[];
  admins: Admin[];
}
