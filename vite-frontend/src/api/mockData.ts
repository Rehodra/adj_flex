/**
 * Mock Data for AI Legal Courtroom Simulator
 * Provides fallback data for the frontend to work "dummy-wise" without a backend.
 */

export const MOCK_CASES: Record<string, any> = {
  'CIVIL_EASY_1': {
    title: 'Ramesh Kumar vs. Suresh Gupta – Property Boundary Dispute',
    facts: {
      parties: "Ramesh Kumar (Plaintiff) vs. Suresh Gupta (Defendant)",
      background: "A civil dispute over encroachment and boundary demarcation between neighboring properties in a residential colony.",
      incident: "The defendant Suresh Gupta allegedly built a new boundary wall that encroaches 2 feet into the plaintiff's registered property.",
      legal_provisions: ["Transfer of Property Act, Section 52", "Specific Relief Act, Section 6"]
    }
  },
  'CRIM_EASY_1': {
    title: 'State of Karnataka vs. Arjun Mehta – Chain Snatching',
    facts: {
      parties: "State of Karnataka (Prosecution) vs. Arjun Mehta (Accused)",
      background: "An accused is charged with snatching a gold chain from a pedestrian in a busy market under section 379 of IPC.",
      incident: "On Jan 10th, the victim was walking in Brigade Road when the accused allegedly snatched a 20gm gold chain and attempted to flee on a motorcycle.",
      legal_provisions: ["Indian Penal Code (IPC), Section 379 (Theft)", "Indian Penal Code (IPC), Section 356 (Assault in attempt to commit theft)"]
    }
  },
  'CONST_EASY_1': {
    title: 'Rahul Das vs. State of West Bengal – Freedom of Speech',
    facts: {
      parties: "Rahul Das (Petitioner) vs. State of West Bengal (Respondent)",
      background: "A citizen challenges restrictions imposed on public speech under Article 19(1)(a) of the Constitution.",
      incident: "The petitioner was prevented from holding a peaceful demonstration against local administrative policies citing public order concerns.",
      legal_provisions: ["Constitution of India, Article 19(1)(a)", "Constitution of India, Article 19(2)"]
    }
  }
};

// Default fallback if a specific ID isn't found
export const DEFAULT_MOCK_CASE = {
  title: 'Sample Legal Case',
  facts: {
    parties: "Party A vs. Party B",
    background: "General background of the legal dispute.",
    incident: "Details of the incident or cause of action.",
    legal_provisions: ["Sample Legal Provision"]
  }
};

export const getMockSessionResponse = (caseId: string) => {
  const caseData = MOCK_CASES[caseId] || DEFAULT_MOCK_CASE;
  return {
    session_id: `mock_session_${Date.now()}`,
    case_facts: {
      title: caseData.title,
      ...caseData.facts
    },
    current_phase: "opening_statement",
    status: "success"
  };
};

export const getMockArgumentResponse = (text: string, phase: string) => {
  return {
    feedback: "Your argument is well-structured and focuses on the core legal issues. You have correctly identified the relevant provisions, although more emphasis on recent precedents would strengthen your position.",
    legal_accuracy_score: 85,
    reasoning_score: 78,
    evidence_score: 72,
    overall_score: 80,
    turn_score: 15,
    cumulative_score: 15,
    performance_tier: "Competent Advocate",
    opponent_response: "While the learned counsel presents an interesting interpretation, I must point out that the facts of the case do not satisfy the essential ingredients of the cited section. The burden of proof remains firmly with the other side.",
    suggestions: ["Refer to the latest Supreme Court ruling on this matter.", "Clarify the timeline of events mentioned in your argument."],
    incorrect_sections: []
  };
};
