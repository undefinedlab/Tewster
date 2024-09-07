import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
interface ChartProps {
  data: { date: string; marketCap: number }[];
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={200} marginLeft={50}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333333" />
        <XAxis dataKey="date" stroke="#999999" />
        <YAxis stroke="#999999" />
        <Tooltip />
        <Line type="monotone" dataKey="marketCap" stroke="#ffa500" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Chart;