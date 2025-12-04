import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function WeeklyChart({ data }) {
  const defaultData = [
    { day: 'Mon', value: 10 },
    { day: 'Tue', value: 12 },
    { day: 'Wed', value: 8 },
    { day: 'Thu', value: 15 },
    { day: 'Fri', value: 9 },
    { day: 'Sat', value: 14 },
    { day: 'Sun', value: 11 },
  ]
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data || defaultData}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#3498db" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
