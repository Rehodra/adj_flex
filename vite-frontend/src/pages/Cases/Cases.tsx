import React, { useState } from 'react';
import styles from './Cases.module.scss';
import { Scale, Lock, FileText, Search, Landmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';

const cases = [
  {
    id: 'CIVIL_EASY_1',
    title: 'Ramesh Kumar vs. Suresh Gupta – Property Boundary Dispute',
    description: 'A civil dispute over encroachment and boundary demarcation between neighboring properties.',
    type: 'Civil',
    difficulty: 'Easy',
    wins: 128,
    accuracy: '91%'
  },
  {
    id: 'CIVIL_MED_1',
    title: 'Priya Sharma vs. ABC Builders – Delay in Possession',
    description: 'A homebuyer files a case against a builder for delayed delivery of an apartment.',
    type: 'Civil',
    difficulty: 'Medium',
    wins: 84,
    accuracy: '76%'
  },
  {
    id: 'CIVIL_HARD_1',
    title: 'Anil Verma vs. State Bank – Loan Recovery Dispute',
    description: 'A borrower challenges the bank’s recovery proceedings and interest calculations.',
    type: 'Civil',
    difficulty: 'Hard',
    wins: 43,
    accuracy: '58%'
  },
  {
    id: 'CRIM_EASY_1',
    title: 'State of Karnataka vs. Arjun Mehta – Chain Snatching',
    description: 'An accused is charged with snatching a gold chain from a pedestrian in a busy market.',
    type: 'Criminal',
    difficulty: 'Easy',
    wins: 112,
    accuracy: '89%'
  },
  {
    id: 'CRIM_MED_1',
    title: 'State of Maharashtra vs. Vikram Yadav – Bar Brawl Assault',
    description: 'A physical altercation in a bar results in grievous injuries and criminal charges.',
    type: 'Criminal',
    difficulty: 'Medium',
    wins: 67,
    accuracy: '72%'
  },
  {
    id: 'CRIM_HARD_1',
    title: 'State of Delhi vs. Neha Sharma – Online Shopping Fraud',
    description: 'A fraudulent e-commerce website deceives customers into paying for non-existent products.',
    type: 'Criminal',
    difficulty: 'Hard',
    wins: 31,
    accuracy: '54%'
  },
  {
    id: 'CONST_EASY_1',
    title: 'Rahul Das vs. State of West Bengal – Freedom of Speech',
    description: 'A citizen challenges restrictions imposed on public speech under constitutional rights.',
    type: 'Constitutional',
    difficulty: 'Easy',
    wins: 98,
    accuracy: '85%'
  },
  {
    id: 'CONST_MED_1',
    title: 'Ananya Roy vs. Union of India – Right to Privacy',
    description: 'A petition questions government surveillance practices violating privacy rights.',
    type: 'Constitutional',
    difficulty: 'Medium',
    wins: 55,
    accuracy: '69%'
  },
  {
    id: 'CONST_HARD_1',
    title: 'Citizens Forum vs. State – Reservation Policy Challenge',
    description: 'A constitutional challenge to reservation quotas based on equality principles.',
    type: 'Constitutional',
    difficulty: 'Hard',
    wins: 22,
    accuracy: '47%'
  },
];

const difficultyConfig: any = {
  Easy: { color: '#22c55e', bg: 'rgba(34,197,94,0.15)', bar: 30 },
  Medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', bar: 62 },
  Hard: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', bar: 90 },
};

const typeIcons: any = {
  Civil: <Scale size={28} />,
  Criminal: <Lock size={28} />,
  Constitutional: <FileText size={28} />,
};

export default function Cases() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterDiff, setFilterDiff] = useState('All');

  const filtered = cases.filter(c => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.type.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'All' || c.type === filterType;
    const matchDiff = filterDiff === 'All' || c.difficulty === filterDiff;
    return matchSearch && matchType && matchDiff;
  });

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.hero}>
          <div className={styles.gridOverlay} />
          <div className={styles.heroContent}>
            <div className={styles.heroHeader}>
              <Landmark size={36} style={{ color: "white" }} />
              <div>
                <h1 className={styles.heroTitle}>Case Simulator</h1>
                <p className={styles.heroSubtitle}>Choose a case and test your legal reasoning skills</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.searchWrapper}>
          <div className={styles.searchBox}>
            <div className={styles.searchInputWrapper}>
              <Search size={16} className={styles.searchIcon} />
              <input
                className={styles.searchInput}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search cases by name or type..."
              />
            </div>
            <div className={styles.filterGroup}>
              {['All', 'Civil', 'Criminal', 'Constitutional'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={filterType === t ? styles.activeFilter : styles.filterButton}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className={styles.filterGroup}>
              {['All', 'Easy', 'Medium', 'Hard'].map(d => (
                <button
                  key={d}
                  onClick={() => setFilterDiff(d)}
                  className={filterDiff === d ? styles.activeFilter : styles.filterButton}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          {filtered.map((c, i) => {
            const diff = difficultyConfig[c.difficulty];
            return (
              <div
                key={c.id}
                className={styles.card}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardHeaderTop}>
                    <span className={styles.typeIcon}>{typeIcons[c.type]}</span>
                    <span
                      className={styles.difficultyBadge}
                      style={{
                        background: diff.bg,
                        color: diff.color,
                        border: `1.5px solid ${diff.color}`
                      }}
                    >
                      {c.difficulty}
                    </span>
                  </div>
                  <h3 className={styles.cardTitle}>{c.title}</h3>
                  <div className={styles.cardType}>{c.type} Law</div>
                  <p className={styles.cardDescription}>{c.description}</p>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.stats}>
                    <div>
                      <div className={styles.statNumber}>{c.wins}</div>
                      <div className={styles.statText}>TOTAL WINS</div>
                    </div>
                    <div>
                      <div className={styles.statNumber}>{c.accuracy}</div>
                      <div className={styles.statText}>ACCURACY</div>
                    </div>
                  </div>
                  <div className={styles.difficultyBarWrapper}>
                    <div className={styles.barHeader}>
                      <span>Difficulty</span>
                      <span style={{ color: diff.color }}>{diff.bar}%</span>
                    </div>
                    <div className={styles.barBackground}>
                      <div
                        className={styles.barFill}
                        style={{
                          width: `${diff.bar}%`,
                          background: `linear-gradient(90deg, ${diff.color}88, ${diff.color})`
                        }}
                      />
                    </div>
                  </div>
                  <button
                    className={styles.startButton}
                    onClick={() => navigate(`/simulator/${c.id}`)}
                  >
                    Start Simulation
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
