import React from "react";
import { motion } from "framer-motion";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import styles from "./Leaderboard.module.scss";

const Leaderboard = () => {
  const dummyData = [
    { rank: 1, name: "John Doe", score: 1500 },
    { rank: 2, name: "Jane Smith", score: 1400 },
    { rank: 3, name: "Alice Johnson", score: 1350 },
    { rank: 4, name: "Bob Brown", score: 1300 },
    { rank: 5, name: "Charlie Davis", score: 1250 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <section className={styles.leaderboardSection}>
        <motion.div
          className={styles.leaderboardHeader}
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1>Leaderboard</h1>
          <p>See how you rank among the best legal minds!</p>
        </motion.div>

        <motion.div
          className={styles.leaderboardTable}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {dummyData.map((user) => (
            <motion.div key={user.rank} className={styles.leaderboardRow} variants={itemVariants}>
              <span className={styles.rank}>#{user.rank}</span>
              <span className={styles.name}>{user.name}</span>
              <span className={styles.score}>{user.score} pts</span>
            </motion.div>
          ))}
        </motion.div>
      </section>
      <Footer />
    </div>
  );
};

export default Leaderboard;