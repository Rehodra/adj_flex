import styles from "../../styles/dashboard.module.scss";

const improvements = [
  {
    title: "Logical Reasoning",
    level: "Needs Improvement",
    tip: "Practice structured case analysis daily.",
  },
  {
    title: "Confidence",
    level: "Moderate",
    tip: "Try mock court arguments.",
  },
  {
    title: "Legal Knowledge",
    level: "Strong",
    tip: "Revise important case laws weekly.",
  },
];

const Improvements = () => {
  return (
    <div className={styles.page}>
      <h1>🧠 Improvements</h1>

      <div className={styles.grid}>
        {improvements.map((item, i) => (
          <div key={i} className={styles.card}>
            <h3>{item.title}</h3>
            <p><strong>Status:</strong> {item.level}</p>
            <p>{item.tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Improvements;