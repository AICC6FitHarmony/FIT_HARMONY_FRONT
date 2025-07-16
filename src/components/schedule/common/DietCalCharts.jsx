import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useRequest } from '../../../js/config/requests';
import { toast } from 'react-toastify';


const DietCalCharts = ({data}) => {
    const request = useRequest();
    const [chartLaoding, setChartLaoding] = useState(true); // 차트 로딩
    const [chartDatas, setChartDatas] = useState(); // 차트 데이터 세팅

    const [datas, setDatas] = useState(); // 데이터 변환 감지용


    const [ menusTotalCalroiesText, setMenusTotalCalroiesText ] = useState(); // 섭취 토탈 칼로리
    const [ exceciseTotalCalroiesText, setExceciseTotalCalroiesText ] = useState(); // 운동으로 인한 소모 토탈 칼로리

    const [ tdeePercentText, setTdeePercentText ] = useState(); // 소모가 필요한 칼로리양 %
    const [ targetCaloriesPercentText, setTargetCaloriesPercentText ] = useState(); // 섭취가 필요한 칼로리양 %

    const [ tdeeText, setTdeeText ] = useState(); // 소모가 필요한 칼로리량 
    const [ targetCaloriesText, setTargetCalories ] = useState(); // 섭취가 필요한 칼로리량
    

    const userCal = async () => {
        const options = {
            method : "GET"
        }
        const result = await request('/schedule/user/dayCalorie', options);
        if(result.success){
             // 소모가 필요한 칼로리량 // 섭취가 필요한 칼로리량
            const { tdee, targetCalories } = result.data;

            const menusTotalCalroies = datas.reduce((sum, item) => sum + (item.status == 'D' ? item.totalCalorie : 0) , 0); // 토탈 섭취 칼로리
            const exceciseTotalCalroies = datas.reduce((sum, item) => sum + (item.status == 'C' ? (item.cal * item.excersizeCnt) : 0) , 0); // 운동 완료 기준 토탈 소모 칼로리

            const tdeePercent = ( exceciseTotalCalroies / tdee ) * 100;
            const targetCaloriesPercent = ( menusTotalCalroies / targetCalories) * 100;

            // UI에 텍스트 정보를 노출하기위해 useState 세팅
            setTdeeText(tdee);
            setTargetCalories(targetCalories);
            setMenusTotalCalroiesText(menusTotalCalroies);
            setExceciseTotalCalroiesText(exceciseTotalCalroies);
            setTdeePercentText(tdeePercent);
            setTargetCaloriesPercentText(targetCaloriesPercent);

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

    useEffect(() => { // chartDatas가 변경되면 동작
      if(!chartDatas) return;
      setChartLaoding(false);
    }, [chartDatas])

    useEffect(() => {
      if (!data) return;
      setDatas(data);
    }, [data]);
    
    useEffect(() => {
      if (!datas) return;
      userCal();
    }, [datas]);

    return (
        <div className='w-full'>



            <h2 className='text-2xl font-bold mb-3'>ToDay Colories</h2>
            <div className="relative w-full h-[400px] md:h-[450px] bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
                {/* 🧾 수치 정보 카드 - 차트 위 왼쪽 상단에 오버레이 */}
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-5 py-4 rounded-xl shadow ring-1 ring-gray-200 space-y-2 text-sm text-gray-700 font-medium">
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500">권장 소모</span>
                    <span className="text-blue-600 font-semibold">{tdeeText}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500">권장 섭취</span>
                    <span className="text-red-500 font-semibold">{targetCaloriesText}</span>
                  </div>
                  <hr className="border-gray-300" />
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500">소모</span>
                    <span className="text-blue-700 font-bold">{exceciseTotalCalroiesText}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500">섭취</span>
                    <span className="text-red-600 font-bold">{menusTotalCalroiesText}</span>
                  </div>
                </div>

                {/* 🔵 퍼센트 라벨 (중앙, 둥근 카드 스타일) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full px-6 py-4 shadow-lg border border-gray-200 flex flex-col items-center justify-center text-center">
                  <div className="text-base text-blue-600 font-bold">
                    {Number(tdeePercentText).toFixed(1)}% <span className="text-xs text-gray-500">소모</span>
                  </div>
                  <div className="text-base text-red-500 font-bold">
                    {Number(targetCaloriesPercentText).toFixed(1)}% <span className="text-xs text-gray-500">섭취</span>
                  </div>
                </div>

                {/* 🔄 로딩 or 차트 */}
                {chartLaoding ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-20">
                    <div className="w-8 h-8 border-[4px] border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      {/* 바깥 도넛 - 소모 */}
                      <Pie
                        data={chartDatas?.tdee || []}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius="100%"
                        innerRadius="80%"
                        startAngle={90}
                        endAngle={-270}
                        paddingAngle={1}
                      >
                        {(chartDatas?.tdee || []).map((entry, index) => (
                          <Cell key={`tdee-${index}`} fill={chartDatas.colors[index % chartDatas.colors.length]} />
                        ))}
                      </Pie>

                      {/* 안쪽 도넛 - 섭취 */}
                      <Pie
                        data={chartDatas?.targetCalories || []}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius="72%"
                        innerRadius="52%"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {(chartDatas?.targetCalories || []).map((entry, index) => (
                          <Cell key={`intake-${index}`} fill={chartDatas.colors[index % chartDatas.colors.length]} />
                        ))}
                      </Pie>

                      {/* 초과 소모 */}
                      <Pie
                        data={chartDatas?.tdeeOver || []}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius="100%"
                        innerRadius="80%"
                        startAngle={90}
                        endAngle={-270}
                      >
                        <Cell fill="red" />
                      </Pie>

                      {/* 초과 섭취 */}
                      <Pie
                        data={chartDatas?.targetCaloriesOver || []}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        outerRadius="72%"
                        innerRadius="52%"
                        startAngle={90}
                        endAngle={-270}
                      >
                        <Cell fill="red" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                )}
            </div>




        </div>
    )


    // return (
    //   <div className='w-full h-full flex flex-col justify-start relative'>
    //       <h2 className='text-2xl font-bold mb-3'>Today Calorie</h2>
    //       <div className='h-[450px] relative'>



    //         <div className='absolute w-full h-full top-0 left-0'>
              
    //           <div>권장 소모 칼로리 : {tdeeText}</div>
    //           <div>권장 섭취 칼로리 : {targetCaloriesText}</div>

    //           <div>섭취 칼로리 {menusTotalCalroiesText}</div>
    //           <div>소모 칼로리 {exceciseTotalCalroiesText}</div>

    //           <div>{Number(tdeePercentText).toFixed(1)}%</div>
    //           <div>{Number(targetCaloriesPercentText).toFixed(1)}%</div>


    //         </div>


    //         {chartLaoding ? (
    //             <div className="absolute inset-0 flex items-center justify-center z-10">
    //                 <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    //             </div>
    //         ) : (
    //           <ResponsiveContainer width="100%" height={450}>
    //             <PieChart>
    //               {/* 바깥쪽 도넛 : 소모칼로리 */}
    //               <Pie
    //                 data={chartDatas?.tdee || []}
    //                 dataKey="value"
    //                 cx="50%"
    //                 cy="50%"
    //                 outerRadius="100%"
    //                 innerRadius="80%"
    //                 startAngle={90}
    //                 endAngle={-270} // 시계 방향
    //                 paddingAngle={0}>
    //                 {(chartDatas?.tdee || []).map((entry, index) => (
    //                   <Cell key={`outer-${index}`} fill={chartDatas?.colors[index % (chartDatas?.colors || []).length]} />
    //                 ))}
    //               </Pie>
        
    //               {/* 안쪽 도넛 : 섭취칼로리 */}
    //               <Pie
    //                 data={chartDatas?.targetCalories}
    //                 dataKey="value"
    //                 cx="50%"
    //                 cy="50%"
    //                 outerRadius="70%"
    //                 innerRadius="50%"
    //                 startAngle={90}
    //                 endAngle={-270}>
    //                 {(chartDatas?.targetCalories || []).map((entry, index) => (
    //                   <Cell key={`inner-${index}`} fill={chartDatas?.colors[index % (chartDatas?.colors || []).length]} />
    //                 ))}
    //               </Pie>

    //               {/* ===================== 초과치 노출용 파이 ========================  */}
    //               <Pie
    //                 data={chartDatas?.tdeeOver || []}
    //                 dataKey="value"
    //                 cx="50%"
    //                 cy="50%"
    //                 outerRadius="100%"
    //                 innerRadius="80%"
    //                 startAngle={90}
    //                 endAngle={-270} // 시계 방향
    //                 paddingAngle={0}>
    //                   <Cell fill="red"/>
    //               </Pie>
        
    //               {/* 안쪽 도넛 : 섭취칼로리 */}
    //               <Pie
    //                 data={chartDatas?.targetCaloriesOver }
    //                 dataKey="value"
    //                 cx="50%"
    //                 cy="50%"
    //                 outerRadius="70%"
    //                 innerRadius="50%"
    //                 startAngle={90}
    //                 endAngle={-270}>
    //                   <Cell fill="red"/>
    //               </Pie>

    //             </PieChart>
    //           </ResponsiveContainer>
    //         )}        
    //       </div>
    //   </div>
    // )
}

export default DietCalCharts
