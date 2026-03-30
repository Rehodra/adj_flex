import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import styles from './Navbar.module.scss';

const IconGavel = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m14 13-5 5 2 2 5-5 2 2 5-5-2-2-5 5-2-2"/><path d="m7 2 5 5-5 5-5-5 5-5z"/><path d="m11 16 1 1"/><path d="m7 12 1 1"/><path d="M21 21h-8"/></svg>
);

const IconSearch = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

const IconDashboard = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="15" rx="1"/></svg>
);

const IconUser = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const IconLogout = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);
const IconLeaderboard = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="10" width="4" height="11" rx="1"/>
    <rect x="10" y="6" width="4" height="15" rx="1"/>
    <rect x="17" y="2" width="4" height="19" rx="1"/>
  </svg>
);
const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className={styles.navbar}>
      <motion.div 
        className={styles.logoSection}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => navigate('/')}
      >
        <img
  src={process.env.PUBLIC_URL + "/images/favicon.png"}
  alt="Emblem"
  className={styles.emblem}
/>
        <div className={styles.titleContainer}>
          <span className={styles.title}>ADJOURNMENT.AI</span>
          <span className={styles.subtitle}>Legal Analytics & Simulation</span>
        </div>
      </motion.div>

      <div className={styles.navLinks}>

  <Link to="/cases" className={styles.navLink}>
  <IconGavel size={18} />
  Simulator
</Link>

  <Link to="/cases" className={styles.navLink}>
    <IconSearch size={18} />
    Cases
  </Link>

  <Link to="/dashboard" className={styles.navLink}>
    <IconDashboard size={18} />
    Dashboard
  </Link>

  <Link to="/leaderboard" className={styles.navLink}>
    <IconLeaderboard size={18} />
    Leaderboard
  </Link>

  <Link to="/user" className={styles.navLink}>
    <IconUser size={18} />
    Profile
  </Link>

</div>

      <div className={styles.authSection}>
        {isAuthenticated ? (
          <div className={styles.userProfile}>
            <img src={user?.picture} alt={user?.name} className={styles.profilePic} />
            <div className={styles.dropdown}>
              <div className={styles.userInfo}>
                <strong>{user?.name}</strong>
                <span>{user?.email}</span>
              </div>
              <hr />
              <button onClick={() => navigate('/user')}><IconUser size={16} /> Profile</button>
              <button onClick={logout} className={styles.logoutBtn}><IconLogout size={16} /> Logout</button>
            </div>
          </div>
        ) : (
          <button className={styles.loginBtn} onClick={() => navigate('/authentication')}>Login / Sign Up</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
