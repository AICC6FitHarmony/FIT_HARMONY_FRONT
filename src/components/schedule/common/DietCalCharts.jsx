import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useRequest } from '../../../js/config/requests';
import { toast } from 'react-toastify';


const DietCalCharts = ({data}) => {
    const request = useRequest();
    const [chartLaoding, setChartLaoding] = useState(false);
    const [chartDatas, setChartDatas] = useState();

    // setChartDatas(data.chartDatas);

    // useEffect(() => { // chartDatas가 변경되면 동작
    //   if(data.chartDatas) return;
    //   setChartLaoding(false);
    // }, [chartDatas])



    const userCal = async () => {
        const options = {
            method : "GET"
        }
        const result = await request('/schedule/user/dayCalorie', options);
        if(result.success){
             // 소모가 필요한 칼로리량 // 섭취가 필요한 칼로리량
            const { tdee, targetCalories } = result.data;

            const menusTotalCalroies = data.reduce((sum, item) => sum + (item.status == 'D' ? item.totalCalorie : 0) , 0); // 토탈 섭취 칼로리
            const exceciseTotalCalroies = data.reduce((sum, item) => sum + (item.status == 'C' ? (item.cal * item.excersizeCnt) : 0) , 0); // 운동 완료 기준 토탈 소모 칼로리

            const tdeePercent = ( exceciseTotalCalroies / tdee ) * 100;
            const targetCaloriesPercent = ( menusTotalCalroies / targetCalories) * 100;

            const chartDatas = {
                tdee : [{name : '소모 칼로리', value:Number(tdeePercent)}, {name:'필요 소모 칼로리', value:(100 - Number(tdeePercent))}],
                targetCalories : [{name : '섭취 칼로리', value:Number(targetCaloriesPercent)}, {name:'필요 섭취 칼로리', value:(100 - Number(targetCaloriesPercent))}],
                
                colors : ['#4285f4', '#e0e0e0'],

                tdeeOver : [{name:'초과 소모 칼로리', value:( Number(tdeePercent) - 100 < 0 ? 0 : Number(tdeePercent) - 100 )}],
                targetCaloriesOver : [{name:'초과 소모 칼로리', value:( Number(targetCaloriesPercent) - 100 < 0 ? 0 : Number(targetCaloriesPercent) - 100 )}],
                overValues : {
                  tdee:( Number(tdeePercent) - 100 < 0 ? 0 : Number(tdeePercent) - 100 ),
                  targetCalories:( Number(targetCaloriesPercent) - 100 < 0 ? 0 : Number(targetCaloriesPercent) - 100 )
                }
            }

            setChartDatas(chartDatas);
        }else{
          toast.error("에러가 발생했습니다.\n잠시후 다시 이용해주세요.", {
              position: "bottom-center"
          });
          setChartLaoding(false);
        }
    }


    useEffect(() => { // 한번만 실행
        userCal();
    }, [])

    useEffect(() => { // chartDatas가 변경되면 동작
      if(chartDatas) return;
      setChartLaoding(false);
    }, [chartDatas])

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
                  {/* 바깥쪽 도넛 : 소모칼로리 */}
                  <Pie
                    data={chartDatas?.tdee || []}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius="100%"
                    innerRadius="80%"
                    startAngle={90}
                    endAngle={-270} // 시계 방향
                    paddingAngle={0}>
                    {(chartDatas?.tdee || []).map((entry, index) => (
                      <Cell key={`outer-${index}`} fill={chartDatas?.colors[index % (chartDatas?.colors || []).length]} />
                    ))}
                  </Pie>
        
                  {/* 안쪽 도넛 : 섭취칼로리 */}
                  <Pie
                    data={chartDatas?.targetCalories}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    innerRadius="50%"
                    startAngle={90}
                    endAngle={-270}>
                    {(chartDatas?.targetCalories || []).map((entry, index) => (
                      <Cell key={`inner-${index}`} fill={chartDatas?.colors[index % (chartDatas?.colors || []).length]} />
                    ))}
                  </Pie>

                  {/* ===================== 초과치 노출용 파이 ========================  */}
                  <Pie
                    data={chartDatas?.tdeeOver || []}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius="100%"
                    innerRadius="80%"
                    startAngle={90}
                    endAngle={-270} // 시계 방향
                    paddingAngle={0}>
                      <Cell fill="red"/>
                  </Pie>
        
                  {/* 안쪽 도넛 : 섭취칼로리 */}
                  <Pie
                    data={chartDatas?.targetCaloriesOver }
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius="70%"
                    innerRadius="50%"
                    startAngle={90}
                    endAngle={-270}>
                      <Cell fill="red"/>
                  </Pie>

                </PieChart>
              </ResponsiveContainer>
            )}        
          </div>
      </div>
    )
}

export default DietCalCharts
