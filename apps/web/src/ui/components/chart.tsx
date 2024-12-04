import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function Chart({
  data,
  lines,
}: {
  data: any[];
  lines: { key: string; color: string }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {lines.map(({ key, color }) => (
          <Line key={key} type="monotone" dataKey={key} stroke={color} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
