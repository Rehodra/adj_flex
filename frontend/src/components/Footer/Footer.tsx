import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';

/* ── Inline SVG Icons ── */
const IconMail = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

const IconGithub = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const IconLinkedin = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const IconTwitterX = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l16 16M4 20L20 4"/></svg>
);

const IconExternalLink = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
);

const IconSend = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);

const LogoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#2563eb"/>
    <path d="M8 24L16 8L24 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.5 19h11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className={styles.footer}>
      {/* Top border accent */}
      <div className={styles.topBorder} />

      {/* Main footer grid */}
      <div className={styles.footerInner}>
        <div className={styles.footerGrid}>

          {/* ── LEFT: Brand ── */}
          <div className={styles.brandCol}>
            <div className={styles.brandLogo}>
              <LogoIcon />
              <div>
                <span className={styles.brandName}>Adjournment.ai</span>
                <span className={styles.brandTagline}>AI Legal Analytics &amp; Courtroom Simulation</span>
              </div>
            </div>
            <p className={styles.brandDesc}>
              Empowering law students, advocates, and legal educators with AI‑powered courtroom simulations and intelligent judgment analytics.
            </p>

            {/* Social icons */}
            <div className={styles.socials}>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="GitHub">
                <IconGithub size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn">
                <IconLinkedin size={18} />
              </a>
              <a href="mailto:support@adjournment.ai" className={styles.socialIcon} aria-label="Email">
                <IconMail size={18} />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="X / Twitter">
                <IconTwitterX size={18} />
              </a>
            </div>
          </div>

          {/* ── CENTER: Quick Links ── */}
          <div className={styles.linksCol}>
            <div className={styles.linksGroup}>
              <h4 className={styles.colHeading}>Platform</h4>
              <ul className={styles.linkList}>
                <li><Link to="/cases">Simulator</Link></li>
                <li><Link to="/judgementsearch">Judgments</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/leaderboard">Leaderboard</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
                <li><Link to="/contact">Contact</Link></li>
              </ul>
            </div>

            <div className={styles.linksGroup}>
              <h4 className={styles.colHeading}>Legal &amp; Trust</h4>
              <ul className={styles.linkList}>
                <li><a href="/">Privacy Policy</a></li>
                <li><a href="/">Terms of Use</a></li>
                <li><a href="/">Data Security</a></li>
                <li><a href="/">Legal Disclaimer</a></li>
              </ul>
            </div>
          </div>

          {/* ── RIGHT: Newsletter ── */}
          <div className={styles.newsletterCol}>
            <h4 className={styles.colHeading}>Stay Updated</h4>
            <p className={styles.newsletterDesc}>
              Stay updated with legal AI innovations, new modules, and platform releases.
            </p>

            {subscribed ? (
              <div className={styles.subscribedMsg}>
                ✓ You're subscribed! Thank you.
              </div>
            ) : (
              <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
                <div className={styles.inputRow}>
                  <input
                    type="email"
                    className={styles.emailInput}
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className={styles.subscribeBtn} aria-label="Subscribe">
                    <IconSend size={15} />
                  </button>
                </div>
              </form>
            )}

            <div className={styles.hackathonBadge}>
              <IconExternalLink size={14} />
              <a href="/" target="_blank" rel="noopener noreferrer">
                View Hackathon Project
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomInner}>
          <p className={styles.copyright}>
            © 2026 <strong>Adjournment.ai</strong> — Empowering Legal Intelligence
          </p>
          <p className={styles.subCopy}>
            Built for Hackathons &bull; Designed for Real Courtrooms
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
