import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useRequest } from '../../../js/config/requests';


const DietCalCharts = ({data}) => {
      
    const data1 = [{ name: 'A', value: 50 }, { name: 'B', value: 50 }];
    const data2 = [{ name: 'A', value: 50 }, { name: 'B', value: 50 }];
    const COLORS = ['#4285f4', '#e0e0e0'];

    
    const request = useRequest();
    const [chartLaoding, setChartLaoding] = useState(true);
    const [chartDatas, setChartDats] = useState([]);

    const userInfo = async () => {
        const result = await request('/schedule/user/dayCaloie');
    }
    


    useEffect(() => {
      if(chartDatas) {
          return;
      }
      setChartDats(false);
    }, [chartDatas]);

    useEffect(() => {
      userInfo();
    }, [])


    return (
      <div className='w-full h-full flex flex-col justify-start relative'>
          <h2 className='text-2xl font-bold mb-3'>칼로리 소모</h2>
          <div className='h-[400px]'>
            {chartLaoding ? (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  {/* 바깥쪽 도넛 */}
                  <Pie
                    data={data1}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius="100%"
                    innerRadius="80%"
                    startAngle={90}
                    endAngle={-270} // 시계 방향
                    paddingAngle={0}
                  >
                    {data1.map((entry, index) => (
                      <Cell key={`outer-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
        
                  {/* 안쪽 도넛 */}
                  <Pie
                    data={data2}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    innerRadius="50%"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {data2.map((entry, index) => (
                      <Cell key={`inner-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}        
          </div>
      </div>
    )
}

export default DietCalCharts
