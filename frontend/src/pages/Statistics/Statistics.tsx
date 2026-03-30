import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import styles from "../../styles/dashboard.module.scss";

const data = [
  { name: "Mon", cases: 5, score: 80 },
  { name: "Tue", cases: 8, score: 120 },
  { name: "Wed", cases: 6, score: 95 },
  { name: "Thu", cases: 10, score: 150 },
  { name: "Fri", cases: 7, score: 110 },
];

const COLORS = ["#4f8cff", "#00c6ff"];

const Statistics = () => {
  return (
    <div className={styles.page}>
      <h1>📊 Statistics</h1>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Weekly Cases</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Bar dataKey="cases" fill="#4f8cff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.card}>
          <h3>Score Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={data} dataKey="score" outerRadius={80}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % 2]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistics;