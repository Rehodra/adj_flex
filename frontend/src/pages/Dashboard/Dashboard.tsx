import React, { useState } from 'react';
import styles from './Dashboard.module.scss';
import { 
  BsLightningCharge, 
  BsShieldCheck, 
  BsGraphUp, 
  BsCalendar4Week, 
  BsClockHistory,
  BsAward,
  BsCheck2Circle
} from 'react-icons/bs';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'improvements' | 'stats'>('improvements');

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.logoText}>ADJOURNMENT <span style={{color: '#3b82f6'}}>AI</span></div>
        <nav>
          <button 
            className={activeTab === 'improvements' ? styles.activeNav : ''} 
            onClick={() => setActiveTab('improvements')}
          >
            <BsLightningCharge style={{marginRight: '10px'}} /> <span>Improvements</span>
          </button>
          <button 
            className={activeTab === 'stats' ? styles.activeNav : ''} 
            onClick={() => setActiveTab('stats')}
          >
            <BsGraphUp style={{marginRight: '10px'}} /> <span>Monthly Stats</span>
          </button>
        </nav>
      </aside>

      <main className={styles.content}>
        <header className={styles.header}>
          <h1>Dashboard Overview</h1>
          <p>Welcome back. Here is your legal performance analysis.</p>
        </header>

        <div className={styles.dashboardGrid}>
          {/* Main Column */}
          <section className={styles.mainCol}>
            
            {activeTab === 'improvements' ? (
              <div className={styles.card}>
                <h3><BsAward /> Priority Skills to Improve</h3>
                {[
                  { label: "Logical Deduction", val: 40, color: "#3b82f6", hint: "Review Case Law #402" },
                  { label: "Argument Speed", val: 65, color: "#3b82f6", hint: "Practice oral submissions" },
                  { label: "Evidence Analysis", val: 25, color: "#ef4444", hint: "High priority improvement" }
                ].map((item, i) => (
                  <div key={i} className={styles.barBox}>
                    <div className={styles.label}>
                      <span>{item.label} <small style={{color: '#94a3b8', marginLeft: '10px'}}>{item.hint}</small></span>
                      <span>{item.val}%</span>
                    </div>
                    <div className={styles.barBg}>
                      <div className={styles.barFill} style={{ width: `${item.val}%`, background: item.color }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.card}>
                <h3><BsCalendar4Week /> Weekly Performance Score</h3>
                {[
                  { day: "Mon", val: 80 }, { day: "Tue", val: 45 }, 
                  { day: "Wed", val: 90 }, { day: "Thu", val: 70 }, 
                  { day: "Fri", val: 85 }
                ].map((item, i) => (
                  <div key={i} className={styles.barBox}>
                    <div className={styles.label}><span>{item.day}</span></div>
                    <div className={styles.barBg}>
                      <div className={styles.barFill} style={{ width: `${item.val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.card}>
              <h3><BsCheck2Circle /> Achievement Milestones</h3>
              <div className={styles.legend}>
                <div className={styles.legendItem}><span>Cases Won this week</span> <span>12</span></div>
                <div className={styles.legendItem}><span>Total Hours Practiced</span> <span>48h</span></div>
                <div className={styles.legendItem}><span>Accuracy Level</span> <span>High</span></div>
              </div>
            </div>
          </section>

          {/* Side Column (Diagrams & Activity) */}
          <section className={styles.sideCol}>
            <div className={styles.card} style={{textAlign: 'center'}}>
              <h3>Overall Win Rate</h3>
              <div className={styles.donutChart}></div>
              <div className={styles.legend}>
                <div className={styles.legendItem}><span style={{color: '#3b82f6'}}>● Won</span> <span>70%</span></div>
                <div className={styles.legendItem}><span style={{color: '#e2e8f0'}}>● Pending</span> <span>30%</span></div>
              </div>
            </div>

            <div className={styles.card}>
              <h3><BsClockHistory /> Recent Activity</h3>
              <div className={styles.activityList}>
                {[
                  { msg: "Solved Case #1029", time: "2 mins ago" },
                  { msg: "Improved Logic Score", time: "1 hour ago" },
                  { msg: "Logged 4h Practice", time: "Yesterday" }
                ].map((act, i) => (
                  <div key={i} className={styles.activityItem}>
                    <div className={styles.bullet}></div>
                    <div className={styles.actInfo}>
                      <p>{act.msg}</p>
                      <span>{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;