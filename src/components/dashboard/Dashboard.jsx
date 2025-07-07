import { format } from 'date-fns'
import React, { useEffect, useRef, useState } from 'react'
import { useGetScheduleList } from '../../js/schedule/schedule';
import { setScheduleList } from '../../js/redux/slice/sliceSchedule';
import { useDispatch, useSelector } from 'react-redux';
import DayScheduleTable from '../schedule/common/DayScheduleTable';
import DietScheduleTable from '../schedule/common/DietScheduleTable';
import DietCalCharts from '../schedule/common/DietCalCharts';
import { useRequest } from '../../js/config/requests';

const Dashboard = () => {
    const isMobile = useSelector(state => state.loading.isMobile); // 모바일 화면인지 체크

    const isLoading = useSelector(state => state.loading.isLoading); // 로딩 체크

    const request = useRequest();
    const dispath = useDispatch();

    const nowDate = format(new Date(), 'yyyy-MM-dd');
    const calendarTerm = {
      startTime:nowDate,
      endTime:nowDate,
    };
    const scheduleList = useSelector(state => state.schedule.scheduleList); //  리덕스 스토어 ▶ 스케쥴 리스트 
    const getScheduleList = useGetScheduleList();
    const getCalendarScheduleList = async () => {
      const {startTime, endTime} = calendarTerm;
      await getScheduleList({startTime, endTime, callback : (data) => {
          dispath(setScheduleList(data))
      }});
    }


    const [labels, setLabels] = useState();
    useEffect(() => {
        dispath(setScheduleList()); // 최초 진입시 스케쥴 리덕스 초기화
        const labels = async () => {
            const options = {
                method : "GET"
            }
            let result = await request("/common/code/C002", options);

            result.data.forEach((data) => {
                data.checked = true;
            });
            setLabels(result.data);
        }
        labels();
    }, []) // 라벨 정보 최초 한번 조회


    useEffect(() => {
      if(!labels) return;
      getCalendarScheduleList();
    }, [labels]); // 라벨 변환 감지 

    return (
      <div className='pt-10 pb-10 pl-5 pr-5'>
          {/* 일자 스케쥴 테이블 */}
          <DayScheduleTable data={scheduleList} labels={labels} radioChangeCallback={ async () => {
              let params = {
                  ...calendarTerm,
                  callback : (data) => {
                      dispath(setScheduleList(data)); // 스케쥴리스트 리덕스 스토어 값 변경
                  }
              }
              const result = await getScheduleList(params);

          } }/>
          <div className={`schedule-diet-chart-wrapper w-full mt-5 ${isMobile ? '' : 'flex gap-2.5'}`}>
              <div className={`${isMobile ? 'w-full' : 'w-1/2'}`}>
                  <DietScheduleTable 
                    data={scheduleList} 
                    selectDate={nowDate} 
                    dietRegCallback={async () => {
                      // 캘린더 스케쥴 재 조회
                      let params = {
                        ...calendarTerm,
                        callback : (data) => {
                          dispath(setScheduleList(data)); // 스케쥴리스트 리덕스 스토어 값 변경
                        }
                      }
                      const result = await getScheduleList(params);
                    }}/>
              </div>
              <div className={`${isMobile ? 'w-full' : 'w-1/2'}`}>
                  <DietCalCharts data={scheduleList}/>
              </div>
          </div>
      </div>
    )
}

export default Dashboard
