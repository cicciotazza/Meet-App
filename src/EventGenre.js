import React, { useEffect, useState } from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell, Legend } from 'recharts';

export const EventGenre = ({ events }) => {

    const [data, setData] = useState([]);
    const colors = ['#00BFFF', '#FFFF00', '#00FF00', '#191970', '#FF0000'];


    const getData = () => {
        const genres = ['React', 'JavaScript', 'Node', 'jQuery', 'AngularJS'];
        const data = genres.map((genre) => {
            const value = events.filter((event) => event.summary.split(' ').includes(genre)).length;
            return { name: genre, value };
        });
        return data;
    };

    useEffect(() => { setData(() => getData()); }, [events]);

    return (
        <ResponsiveContainer height={400} >
            <PieChart width={400} height={400}>
                <Pie
                    data={data}
                    cx={200}
                    cy={200}
                    
                    labelLine={false}
                    innerRadius={20}
                    outerRadius={80}
                    fill="#1D4355"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <Legend layout="horizontal" verticalAlign="top" align="center" height={45} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default EventGenre;
