import React from "react";
import { Link } from "react-router-dom";
import styles from "./LandingPage.module.scss";

export default function LandingPage() {
  return (
    <div className={styles.container}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.logoSection}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
            alt="India Emblem"
            className={styles.logo}
          />
          <span className={styles.title}>e-Court India</span>
        </div>

        <div className={styles.navLinks}>
          <Link to="/Dashboard">Dashboard</Link>
          <Link to="/cases">Cases</Link>
          <Link to="/judgementsearch">Judgments</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <Link to="/authentication">
          <button className={styles.loginBtn}>Login</button>
        </Link>
      </nav>

      {/* HERO SECTION */}
      <section className={styles.hero}>
        <h1>Smart & Transparent Courtroom System</h1>
        <p>
          Access judgments, hearings, case files, and digital court records in
          one unified platform.
        </p>

        <div className={styles.heroActions}>
          <Link to="/cases">
            <button className={styles.primaryBtn}>Search Cases</button>
          </Link>

          <Link to="/judgementsearch">
            <button className={styles.secondaryBtn}>View Judgments</button>
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className={styles.features}>
        <h2>Core Features</h2>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h3>Case Search</h3>
            <p>Find case status, FIR details, and related court documents.</p>
          </div>

          <div className={styles.featureCard}>
            <h3>Judgment Archive</h3>
            <p>Explore detailed judgments from major courts.</p>
          </div>

          <div className={styles.featureCard}>
            <h3>Hearing Tracker</h3>
            <p>Track upcoming hearings and daily court orders.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        © {new Date().getFullYear()} e-Court India · All Rights Reserved
      </footer>
    </div>
  );
}


// import React from "react";

// const LandingPage: React.FC = () => {
//     return (
//         <div className="text-white min-h-screen w-full"
//             style={{
//                 background: `
//                     linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.5)), 
//                     url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=1920') 
//                     center/cover no-repeat
//                 `
//             }}
//         >

//             {/* NAVBAR */}
//             <nav className="w-full bg-black/40 backdrop-blur-md px-10 py-4 flex justify-between items-center">
//                 <div className="flex items-center gap-3">
//                     <img
//                         src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Scales_of_Justice.svg/1200px-Scales_of_Justice.svg.png"
//                         alt="Court Emblem"
//                         className="w-10 h-10"
//                     />
//                     <h1 className="text-2xl font-bold tracking-wide">CourtRoom Portal</h1>
//                 </div>

//                 <div className="flex gap-6 text-lg">
//                     <a href="/" className="hover:text-yellow-400">Home</a>
//                     <a href="#features" className="hover:text-yellow-400">Features</a>
//                     <a href="#contact" className="hover:text-yellow-400">Contact</a>
//                 </div>
//             </nav>

//             {/* HERO SECTION */}
//             <section className="flex flex-col items-center text-center mt-24 px-6">
//                 <h2 className="text-5xl font-bold drop-shadow-lg">
//                     Digital Justice, Simplified.
//                 </h2>

//                 <p className="mt-4 text-xl max-w-2xl">
//                     A secure and transparent court management system designed for case tracking,
//                     hearing schedules, document management, judge dashboards, and more.
//                 </p>

//                 <div className="mt-8 flex gap-6">
//                     <a
//                         href="#features"
//                         className="bg-yellow-500 text-black px-8 py-3 font-bold rounded-lg hover:bg-yellow-400 transition"
//                     >
//                         Explore Features
//                     </a>

//                     <a
//                         href="#login"
//                         className="border border-gray-300 px-8 py-3 rounded-lg hover:bg-gray-100 hover:text-black transition"
//                     >
//                         Login
//                     </a>
//                 </div>
//             </section>

//             {/* FEATURES */}
//             <section id="features" className="mt-32 px-10 pb-12">
//                 <h3 className="text-4xl font-bold text-center mb-10">Core Features</h3>

//                 <div className="grid md:grid-cols-3 gap-10">

//                     {/* Feature Card */}
//                     <div className="bg-black/40 p-8 rounded-xl border border-white/20 backdrop-blur-md">
//                         <img
//                             src="https://cdn-icons-png.flaticon.com/512/1048/1048945.png"
//                             className="w-16 mb-4"
//                             alt="Case Management"
//                         />
//                         <h4 className="text-2xl font-semibold">Case Management</h4>
//                         <p className="mt-3">
//                             Track case status, documents, and updates with complete transparency.
//                         </p>
//                     </div>

//                     <div className="bg-black/40 p-8 rounded-xl border border-white/20 backdrop-blur-md">
//                         <img
//                             src="https://cdn-icons-png.flaticon.com/512/2991/2991109.png"
//                             className="w-16 mb-4"
//                             alt="Hearing Scheduler"
//                         />
//                         <h4 className="text-2xl font-semibold">Hearing Scheduler</h4>
//                         <p className="mt-3">
//                             Automated hearing dates, judge allocation, and courtroom assignment.
//                         </p>
//                     </div>

//                     <div className="bg-black/40 p-8 rounded-xl border border-white/20 backdrop-blur-md">
//                         <img
//                             src="https://cdn-icons-png.flaticon.com/512/2885/2885383.png"
//                             className="w-16 mb-4"
//                             alt="Document Archive"
//                         />
//                         <h4 className="text-2xl font-semibold">Digital Document Archive</h4>
//                         <p className="mt-3">
//                             Access court orders, FIRs, affidavits, and case files securely.
//                         </p>
//                     </div>

//                 </div>
//             </section>
//         </div>
//     );
// };

// export default LandingPage;