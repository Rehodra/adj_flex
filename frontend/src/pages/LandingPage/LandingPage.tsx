import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./LandingPage.module.scss";

// Stable Lottie component using @dotlottie/player web component
// Run: npm install @dotlottie/player
const LottieAnimation = ({ src }: { src: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically import to avoid SSR/TS issues
    import('@dotlottie/player-component').then(() => {
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <dotlottie-player
            src="${src}"
            autoplay
            loop
            style="width:100%;height:100%"
          ></dotlottie-player>
        `;
      }
    }).catch(() => {
      // Fallback: do nothing, container stays empty
    });
    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [src]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: '340px' }} />;
};

const IconShield = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

const IconBookOpen = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);

const IconClock = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

const IconArrowRight = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
);

const IconCheckCircle = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

const IconDatabase = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
);

const IconActivity = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);

const IconScales = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v18" />
    <path d="M3 21h18" />
    <path d="M12 6H5l-1 5a5 5 0 0 0 10 0l-1-5" />
    <path d="M12 6h7l1 5a5 5 0 0 1-10 0l1-5" />
  </svg>
);

const IconGavel = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m14 13-7.5 7.5c-.8.8-2.1.8-2.9 0l-1.1-1.1c-.8-.8-.8-2.1 0-2.9L10 9" />
    <path d="m14 6 4 4" />
    <path d="M21 7 17 3" />
    <path d="m21 7-4-4-2 2 4 4z" />
    <path d="m17 11 4-4-2-2-4 4z" />
    <path d="M18 12 12 6" />
  </svg>
);

const IconLandmark = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 22h18" />
    <path d="M6 18v-7" />
    <path d="M10 18v-7" />
    <path d="M14 18v-7" />
    <path d="M18 18v-7" />
    <path d="M12 2l8 5H4z" />
  </svg>
);

const IconChevronLeft = ({ size = 24 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
);

const IconQuill = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2C10 6.5 8 13 8 13L4 17l4 4 4-4s6.5-2 11-6.5C23 6 22 2 22 2s-4-1-7.5 0z" />
    <path d="M8 13l3.5 3.5" />
    <path d="M12.5 5.5l5 5" />
  </svg>
);

const IconLink = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const IconGlobe = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IconGraph = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 3 3 21 21 21" />
    <polyline points="3 17 9 11 13 15 21 7" />
    <line x1="21" y1="14" x2="21" y2="7" />
    <line x1="14" y1="7" x2="21" y2="7" />
  </svg>
);

const IconSafe = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconUsers = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const StatCounter = ({ endValue, suffix = '' }: { endValue: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      let startTimestamp: number;
      const duration = 2000;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(ease * endValue));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [inView, endValue]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const LandingPage = () => {
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 800], [0, 100]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  return (
    <div className={styles.container}>
      <Navbar />

      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        {/* Background blobs */}
        <div className={styles.blobTopLeft} />
        <div className={styles.blobBottomRight} />
        <div className={styles.gridTexture} />

        <div className={styles.heroInner}>
          {/* LEFT: TEXT CONTENT */}
          <motion.div
            className={styles.heroContent}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.span
              className={styles.badge}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              ⚡ Next-Gen Legal Technology
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.75, ease: 'easeOut' }}
            >
              Smart, Transparent &amp; <br />
              AI-Powered{' '}
              <span className={styles.gradientText}>Courtroom<br />Simulation</span>
            </motion.h1>

            <motion.p
              className={styles.heroDesc}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
            >
              Train, argue, and win with confidence. Adjournment.ai simulates real courtroom scenarios using advanced AI—helping law students and professionals master legal reasoning, argument structure, and evidence-based advocacy.
            </motion.p>

            <motion.div
              className={styles.heroActions}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <Link to="/cases">
                <button className={styles.primaryBtn}>
                  Start Simulation <span className={styles.btnArrow}><IconArrowRight size={18} /></span>
                </button>
              </Link>
              <Link to="/judgementsearch">
                <button className={styles.secondaryBtn}>Explore Judgments</button>
              </Link>
            </motion.div>

            <motion.div
              className={styles.trustBar}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75, duration: 0.8 }}
            >
              <span className={styles.trustLabel}>TRUSTED BY 5,000+ LEARNERS AND LEGAL PROFESSIONALS</span>
              <div className={styles.trustPills}>
                <span className={styles.trustPill}><IconCheckCircle size={14} /> Real Courtroom Scenarios</span>
                <span className={styles.trustPill}><IconShield size={14} /> AI-Powered Judge</span>
                <span className={styles.trustPill}><IconActivity size={14} /> Instant Analytics</span>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT: LOTTIE ANIMATION */}
          <motion.div
            className={styles.heroVisual}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 1, type: 'spring', stiffness: 55, damping: 18 }}
          >
            <div className={styles.visualGlow} />
            <motion.div
              className={styles.lottieWrap}
              animate={{ y: [0, -12, 0], scale: [1, 1.02, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <LottieAnimation src="https://lottie.host/e109ed1b-4dd5-4c08-a93e-833e1730a18b/I4PD7iIlnI.lottie" />
            </motion.div>
          </motion.div>
        </div>
      </section>      {/* FEATURES SECTION — LIGHT THEME, ORBITAL LAYOUT */}
      <section className={styles.featuresSection}>
        <div className={styles.featuresBlob} />

        <div className={styles.featuresInner}>
          {/* Section Header */}
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className={styles.sectionBadge}>Platform Capabilities</span>
            <h2>Engineered for <span className={styles.featureGradient}>Legal Excellence</span></h2>
            <p>Our platform combines cutting-edge AI with rigorous legal standards to provide an unparalleled courtroom simulation experience.</p>
          </motion.div>

          {/* Orbital Layout */}
          <div className={styles.orbitalLayout}>

            {/* TOP ROW */}
            <div className={styles.orbitalTop}>
              {[
                { icon: <IconGavel size={22} />, color: '#dc2626', bg: '#fef2f2', title: 'AI Judge Feedback', desc: 'Real-time argument evaluation with detailed scoring.' },
                { icon: <IconScales size={22} />, color: '#2563eb', bg: '#eff6ff', title: 'Realistic Scenarios', desc: 'Meticulously crafted Indian courtroom case files.' },
                { icon: <IconLink size={22} />, color: '#0d9488', bg: '#f0fdfa', title: 'Citation Mapping', desc: 'Auto-link arguments to SC/HC precedents.' },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  className={styles.orbCard}
                  style={{ '--orb-color': f.color, '--orb-bg': f.bg } as React.CSSProperties}
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                >
                  <div className={styles.orbCardIcon}>{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* MIDDLE ROW: Card | Center | Card */}
            <div className={styles.orbitalMiddle}>
              {/* Left Card */}
              {[
                { icon: <IconQuill size={22} />, color: '#9333ea', bg: '#faf5ff', title: 'Drafting AI', desc: 'Generate petitions & pleadings for Indian formats.' },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  className={styles.orbCard}
                  style={{ '--orb-color': f.color, '--orb-bg': f.bg } as React.CSSProperties}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                >
                  <div className={styles.orbCardIcon}>{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </motion.div>
              ))}

              {/* CENTER LOTTIE */}
              <motion.div
                className={styles.orbCenter}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: 'spring', stiffness: 60 }}
              >
                <div className={styles.orbCenterGlow} />
                <motion.div
                  animate={{ y: [0, -8, 0], scale: [1, 1.02, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className={styles.orbCenterInner}
                >
                  <LottieAnimation src="https://lottie.host/e109ed1b-4dd5-4c08-a93e-833e1730a18b/I4PD7iIlnI.lottie" />
                </motion.div>
                <div className={styles.orbRing1} />
                <div className={styles.orbRing2} />
              </motion.div>

              {/* Right Card */}
              {[
                { icon: <IconGraph size={22} />, color: '#ea580c', bg: '#fff7ed', title: 'Risk Analysis', desc: 'Predict case outcome using historical AI modeling.' },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  className={styles.orbCard}
                  style={{ '--orb-color': f.color, '--orb-bg': f.bg } as React.CSSProperties}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                >
                  <div className={styles.orbCardIcon}>{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* BOTTOM ROW */}
            <div className={styles.orbitalBottom}>
              {[
                { icon: <IconGlobe size={22} />, color: '#4f46e5', bg: '#eef2ff', title: 'Multilingual Support', desc: 'Hindi, English & all major Indian regional languages.' },
                { icon: <IconSafe size={22} />, color: '#059669', bg: '#f0fdf4', title: 'Evidence Vault', desc: 'Encrypted workspace for exhibits & digital evidence.' },
                { icon: <IconUsers size={22} />, color: '#db2777', bg: '#fdf2f8', title: 'Virtual Chambers', desc: 'Collaborate in real-time mock-trial sessions.' },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  className={styles.orbCard}
                  style={{ '--orb-color': f.color, '--orb-bg': f.bg } as React.CSSProperties}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                >
                  <div className={styles.orbCardIcon}>{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* PREMIUM STATS SECTION */}
      <motion.section
        className={`${styles.section} ${styles.premiumStatsSection}`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className={styles.statsGlowContainer}>
          <div className={styles.statsGlow} />
        </div>

        <div className={styles.statsHeader}>
          <h2>Data-Driven Performance. <br/><span>Proven Results.</span></h2>
          <p>Built for the modern legal professional, tested on thousands of real-world scenarios.</p>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <IconDatabase size={24} />
            </div>
            <div className={styles.statDivider} />
            <h4 className={styles.statNumber}>
              <StatCounter endValue={5000} suffix="+" />
            </h4>
            <span className={styles.statLabel}>Judgments Indexed</span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <IconCheckCircle size={24} />
            </div>
            <div className={styles.statDivider} />
            <h4 className={styles.statNumber}>
              <StatCounter endValue={98} suffix="%" />
            </h4>
            <span className={styles.statLabel}>Accuracy Rate</span>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <IconActivity size={24} />
            </div>
            <div className={styles.statDivider} />
            <h4 className={styles.statNumber}>
              <StatCounter endValue={10} suffix="k+" />
            </h4>
            <span className={styles.statLabel}>Simulations Run</span>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default LandingPage;