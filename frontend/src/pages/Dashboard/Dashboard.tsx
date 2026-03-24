import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.scss";

interface Case {
  case_id: string;
  title: string;
  type: string;
  difficulty: string;
  legal_areas: string[];
  description?: string;
}

const Dashboard = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/session/available/cases")
      .then((res) => res.json())
      .then((data) => {
        if (data.cases) {
          setCases(data.cases);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch cases", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1>Available Legal Scenarios</h1>
      </div>

      {loading ? (
        <div>Loading cases...</div>
      ) : (
        <div className={styles.casesGrid}>
          {cases.map((c) => (
            <div key={c.case_id} className={styles.caseCard}>
              <div className={styles.heading}>{c.title}</div>
              <div className={styles.metaData}>
                <span className={styles.type}>{c.type} Law</span>
                <span className={`${styles.difficulty} ${styles[c.difficulty]}`}>
                  {c.difficulty}
                </span>
              </div>
              
              <div className={styles.description}>
                {c.description ? c.description : "A legal scenario requiring application of Indian law principles to determine the correct arguments and outcomes."}
              </div>

              <div className={styles.tags}>
                <p>Related Sections / Tags:</p>
                <div className={styles.tagList}>
                  {c.legal_areas?.slice(0, 5).map((tag, idx) => (
                    <span key={idx}>{tag}</span>
                  ))}
                  {(!c.legal_areas || c.legal_areas.length === 0) && <span>General</span>}
                </div>
              </div>

              <button 
                className={styles.playButton}
                onClick={() => navigate(`/simulate/${c.case_id}`)}
              >
                Play Scenario
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
