import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.scss';

const IconGavel = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m14 13-5 5 2 2 5-5 2 2 5-5-2-2-5 5-2-2"/>
    <path d="m7 2 5 5-5 5-5-5 5-5z"/>
    <path d="m11 16 1 1"/>
    <path d="m7 12 1 1"/>
    <path d="M21 21h-8"/>
  </svg>
);

const IconSearch = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.3-4.3"/>
  </svg>
);

const IconDashboard = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="7" height="9" x="3" y="3" rx="1"/>
    <rect width="7" height="5" x="14" y="3" rx="1"/>
    <rect width="7" height="9" x="14" y="12" rx="1"/>
    <rect width="7" height="5" x="3" y="15" rx="1"/>
  </svg>
);

const IconUser = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconLogout = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" x2="9" y1="12" y2="12"/>
  </svg>
);

const IconLeaderboard = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="10" width="4" height="11" rx="1"/>
    <rect x="10" y="6" width="4" height="15" rx="1"/>
    <rect x="17" y="2" width="4" height="19" rx="1"/>
  </svg>
);

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === "/";

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener(
        'mousedown',
        handleClickOutside
      );
    }

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );

  }, [dropdownOpen]);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };

  const handleNavigate = (path: string) => {
    setDropdownOpen(false);
    navigate(path);
  };

  return (
    <nav className={styles.navbar}>

      <motion.div
        className={styles.logoSection}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        onClick={() => navigate('/') }
      >

        <img
          src={
            process.env.PUBLIC_URL +
            "/images/favicon.png"
          }
          alt="Emblem"
          className={styles.emblem}
        />

        <div className={styles.titleContainer}>
          <span className={styles.title}>
            ADJOURNMENT.AI
          </span>

          <span className={styles.subtitle}>
            Legal Analytics & Simulation
          </span>
        </div>

      </motion.div>

      <div className={styles.navLinks}>

        <Link
          to="/simulator"
          className={styles.navLink}
        >
          <IconGavel size={18} />
          Simulator
        </Link>

        <Link
          to="/cases"
          className={styles.navLink}
        >
          <IconSearch size={18} />
          Cases
        </Link>

        <Link
          to="/dashboard"
          className={styles.navLink}
        >
          <IconDashboard size={18} />
          Dashboard
        </Link>

        <Link
          to="/leaderboard"
          className={styles.navLink}
        >
          <IconLeaderboard size={18} />
          Leaderboard
        </Link>

      </div>

      <div className={styles.authSection}>

        {!isLandingPage ? (

          <button
            className={styles.loginBtn}
            onClick={() => navigate("/") }
          >
            ← Back to Home
          </button>

        ) : (

          <>
            {isAuthenticated ? (

              <div
                className={styles.userProfile}
                ref={dropdownRef}
              >

                <img
                  src={user?.picture}
                  alt={user?.name}
                  className={styles.profilePic}
                  onClick={() =>
                    setDropdownOpen(
                      prev => !prev
                    )
                  }
                />

                <AnimatePresence>

                  {dropdownOpen && (

                    <motion.div
                      className={styles.dropdown}
                      initial={{
                        opacity: 0,
                        y: -8,
                        scale: 0.97
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1
                      }}
                      exit={{
                        opacity: 0,
                        y: -8,
                        scale: 0.97
                      }}
                      transition={{
                        duration: 0.15,
                        ease: 'easeOut'
                      }}
                    >

                      <div
                        className={styles.userInfo}
                      >
                        <strong>
                          {user?.name}
                        </strong>

                        <span>
                          {user?.email}
                        </span>
                      </div>

                      <hr />

                      <button
                        onClick={() =>
                          handleNavigate('/user')
                        }
                      >
                        <IconUser size={16} />
                        Profile
                      </button>

                      <button
                        onClick={handleLogout}
                        className={
                          styles.logoutBtn
                        }
                      >
                        <IconLogout size={16} />
                        Logout
                      </button>

                    </motion.div>

                  )}

                </AnimatePresence>

              </div>

            ) : (

              <button
                className={styles.loginBtn}
                onClick={() =>
                  navigate('/authentication')
                }
              >
                Login / Sign Up
              </button>

            )}
          </>

        )}

      </div>

    </nav>
  );
};

export default Navbar;