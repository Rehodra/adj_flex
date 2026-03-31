import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import styles from './Cases.module.scss';

const Cases = () => {
  const navigate = useNavigate();

  const cases = [
    { id: 'CIVIL_EASY_1', title: 'Civil Case - Easy 1', type: 'Civil', difficulty: 'Easy' },
    { id: 'CIVIL_MED_1', title: 'Civil Case - Medium 1', type: 'Civil', difficulty: 'Medium' },
    { id: 'CIVIL_HARD_1', title: 'Civil Case - Hard 1', type: 'Civil', difficulty: 'Hard' },
    { id: 'CRIM_EASY_1', title: 'Criminal Case - Easy 1', type: 'Criminal', difficulty: 'Easy' },
    { id: 'CRIM_MED_1', title: 'Criminal Case - Medium 1', type: 'Criminal', difficulty: 'Medium' },
    { id: 'CRIM_HARD_1', title: 'Criminal Case - Hard 1', type: 'Criminal', difficulty: 'Hard' },
    { id: 'CONST_EASY_1', title: 'Constitutional Case - Easy 1', type: 'Constitutional', difficulty: 'Easy' },
    { id: 'CONST_MED_1', title: 'Constitutional Case - Medium 1', type: 'Constitutional', difficulty: 'Medium' },
    { id: 'CONST_HARD_1', title: 'Constitutional Case - Hard 1', type: 'Constitutional', difficulty: 'Hard' },
  ];

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h1>Case Simulator</h1>
        <p>Select a case to start the simulation:</p>
        <div className={styles.casesGrid}>
          {cases.map((caseItem) => (
            <div key={caseItem.id} className={styles.caseCard}>
              <h3>{caseItem.title}</h3>
              <p>Type: {caseItem.type}</p>
              <p>Difficulty: {caseItem.difficulty}</p>
              <button 
                onClick={() => navigate(`/simulator/${caseItem.id}`)}
                className={styles.simulateButton}
              >
                Start Simulation
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cases;