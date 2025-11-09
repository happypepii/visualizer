import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// distribution of questions by difficulty
export function DifficultyChart({ questions }) {
  const data = questions.reduce((acc, q) => {
    const difficulty = q.difficulty;
    acc[difficulty] = (acc[difficulty] || 0) + 1;
    return acc;
  }, {});

  // all difficulites should show even if question is zero
  const chartData = ['easy', 'medium', 'hard'].map(difficulty => ({
    name: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
    count: data[difficulty] || 0
  }));

  return (
    <div className="chart-container">
      <h2>Questions by Difficulty</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// distribution of questions by category
export function CategoryChart({ questions }) {
  const data = questions.reduce((acc, q) => {
    const category = q.category;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1', '#D084D0', '#A4DE6C'];

  // 自訂 label 顯示方式
  const renderLabel = (entry) => {
    // 只顯示數量大於 1 的 label，避免擁擠
    if (entry.value <= 1) return '';
    return `${entry.name}: ${entry.value}`;
  };

  return (
    <div className="chart-container">
      <h2>Questions by Category</h2>
      <ResponsiveContainer width="100%" height={500}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            activeShape={true}
            isAnimationActive={true}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                style={{ outline: 'none' }}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}