// Fullcalendar module 설치
// npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/core @fullcalendar/interaction @fullcalendar/timegrid

import React, { useEffect, useRef, useState } from 'react'

// import about fullCalendar
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid'
import { format, isMonday } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';

// import standard modal
import StandardModal from '../cmmn/StandardModal';

// import request 
import { useRequest } from '../../js/config/requests';
import { useGetScheduleList, useUpdateScheduleStatus } from '../../js/schedule/schedule';


// schedule 페이지 css import
import '../../css/schedule.css'
import { CheckSquare, Square } from 'lucide-react';
import RadioLabels from './common/RadioLabels';
import DayScheduleTable from './common/DayScheduleTable';
import { useDispatch, useSelector } from 'react-redux';
import { setScheduleList } from '../../js/redux/slice/sliceSchedule';
import DietScheduleTable from './common/DietScheduleTable';
import DietCalCharts from './common/DietCalCharts';



const Schedule = () => {
    const isMobile = window.innerWidth < 768; // 모바일 화면인지 체크
    const dispath = useDispatch();

    // 캘린더 드래그 이벤트
    const scheduleList = useSelector(state => state.schedule.scheduleList); //  리덕스 스토어 ▶ 스케쥴 리스트 
    const request = useRequest();

    const [labels, setLabels] = useState();
    useEffect(() => {
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


    // ========================================= 캘린더 관련 START ===================================================
    const [calendarTerm, setCalendarTerm] = useState({}); // AI 스케쥴 작성, 일반 스케쥴 작성, 식단 등록 등에 활용하기 위해 굳이 세팅
    const checkShowDates = async (arg) => { 
        // 년, 월 구분 : 요 값이 변할때 조회해서 바까주면 되겠네? 1. 데이터 조회 > setScheduleList( useState )에 세팅
        const startTime = format(new Date(arg.start), 'yyyy-MM-dd');
        const endTime = format(new Date(arg.end), 'yyyy-MM-dd');

        setCalendarTerm({
          startTime : startTime,
          endTime : endTime
        })
    }


    // 라벨 클릭 이벤트
    const toggleCheckedLabel = (e) => {
      const codeId =  e.target.value;
      const checked = !e.target.checked;

      setLabels(
          (prevLabels) => prevLabels.map(
              (label) => label.codeId === codeId ? { ...label, checked: checked } : label
          )
      );
    }
    
    // 렌더링 완료 후 값 변환 감지
    const islabelRender = useRef(true); // 첫 진입 차단 세팅
    useEffect(() => {
      if (islabelRender.current) { // 라벨 첫 세팅 시 데이터 조회 제한
        if(labels != undefined){ // 최초 데이터 세팅 후 변환이 없으면 동작을 제한
          getCalendarScheduleList();
          islabelRender.current = false;
          return;
        }else{ // 최초 데이터 세팅 없는 경우 데이터 조회 제한
          return;
        }
      }
      getCalendarScheduleList();
    }, [labels]); // 라벨 변환 감지 

    useEffect(() => {
      dispath(setScheduleList([])); // 데이터 조회 전 먼저 레이아웃 내용 제거 처리
      getCalendarScheduleList();
    }, [calendarTerm]) // 캘린더에 시작 - 끝 일자 변경 감지


    // calendar 용 스케쥴 조회 함수(function)
    const getScheduleList = useGetScheduleList();
    const getCalendarScheduleList = async () => {
        const { startTime, endTime } = calendarTerm;
        
        if(!startTime || !endTime){ // 아직 캘린더 렌더링 안되었으면 그냥 리턴
            return;
        }

        if(!labels){
            return
        }
        
        const checkedStatus = (labels == undefined || labels.length == 0 ? "" : labels.filter(label => label.checked).map(label => label.codeId).join());

        if(!(labels == undefined || labels.length == 0) && checkedStatus == ""){ // 첫 진입을 제외하고, 체크 박스가 노출된 상황에서 하나도 체크가되지 않은경우
            dispath(setScheduleList([])); // 그냥 빈 값처리 하고
            return; // 동작 멈춤
        }

        await getScheduleList({startTime, endTime, checkedStatus, callback : (data) => {
            dispath(setScheduleList(data))
        }});
    }


    // =========================================  캘린더 관련 END  ===================================================

    // ========================================= 스케쥴 상세 모달 관련 START ===================================================
    // 스케쥴 상세 모달 노출여부 useState
    const [isShowScheduleDetailModal, setIsShowScheduleDetailModal] = useState(false); 

    // 스케쥴 모달 노출 정보 세팅
    const [scheduleModal, setScheduleModal] = useState(null); // 최초 페이지 진입시 모달이 동작하지 않을 조건을 주기 위하여  null 처리

    // 일자 셀 클릭 이벤트
    const dateCellModalOpen = async (info) => {
        const result = await getScheduleList({
            startTime:format(info.dateStr, 'yyyy-MM-dd'), 
            endTime:format(info.dateStr, 'yyyy-MM-dd'), 
            callback:(data) => {

              setScheduleModal({
                  title:`${format(info.dateStr, 'yyyy-MM-dd')} 스케쥴`, 
                  size : {width:"80vw"},
                  closeEvent: () => {
                    setIsShowScheduleDetailModal(false);
                  },
                  okEvent:() => {
                    setIsShowScheduleDetailModal(false);
                  },
                  data:data
              });

              setIsShowScheduleDetailModal(true);
            }
        });
    }



    // ============================================== 스케쥴 상세 모달 관련 END =================================================================




    // ============================================== AI 스케쥴 자동 작성 모달 관련 START ========================================================
    // 스케쥴 자동 작성 모달 노출여부 useState
    const [isShowAISchedulModal, setIsShowAISchedulModal] = useState(false); 

    // AI 스케쥴 자동 작성 모달 관련
    const aiSchedulePromptForm = useRef(null); // prompt form ref 지정
    const aiScheduleModalData = {
        title:"AI가 스케쥴 작성해드립니다!",
        okEvent:() => {
          // AI 전달 이벤트 처리
          if(aiSchedulePromptForm.current){
              aiSchedulePromptForm.current.requestSubmit();
          }
        }, 
        closeEvent: () => {
          aiSchedulePromptForm.current = "";
          setIsShowAISchedulModal(false);
        },
        size:{
          height:"20vh"
        }

    }

    // AI 스케쥴 작성 모달 이벤트
    const aiScheduleModalOpen = () => {
        setIsShowAISchedulModal(true);
    }

    // AI 스케쥴 작성 요청(백엔드)
    const sendRequestAiSchedule = (e) => {
        e.preventDefault();

        // formData 처리
        const formData = new FormData(aiSchedulePromptForm.current);

        const requestAiSchedule = async () => {
            const option = {
                method:"POST",
                body : {
                    prompt : formData.get('prompt'),
                    ...calendarTerm
                }
            }
            const result = await request("/schedule/requestAiSchdule", option);
            const { success, message } = result;

            if(success){
                  // form 초기화
                  aiSchedulePromptForm.current = null;
                  
                  // modal close
                  setIsShowAISchedulModal(false);
                  
                  // 변경된 데이터 조회
                  getCalendarScheduleList();
            }else{
              if(message == "noAuth"){
                  toast.error("로그인 후 이용 가능한 서비스 입니다.", {
                      position: "bottom-center"
                  });
              }else if(message == "noMessage"){
                toast.error("스케쥴 목표를 작성해주세요.", {
                    position: "bottom-center"
                });
              }else{
                  toast.error("에러가 발생했습니다.\n잠시후 다시 이용해주세요.", {
                      position: "bottom-center"
                  });
              }
            }

        }
        requestAiSchedule();
    }
    // ============================================== AI 스케쥴 자동 작성 모달 관련 END ==========================================================



    // ============================================== 스케쥴 상태 변경 모달 관련 START ========================================================
    // 스케쥴 상태 변경 모달 노출여부 useState
    const [isShowUpdateSchedulStatusModal, setShowUpdateSchedulStatusModal] = useState(false); 
    // 스케쥴 상태 변경 모달 전달 데이터
    const [updateSchedulStatusModalData, setUpdateSchedulStatusModalData] = useState({});

    // 스케쥴 상태 값 설정 Radio 버튼 조정 이벤트 관련
    const [updateStatusRadio, setUpdateStatusRadio] = useState();
    const updateStatusRadioHandleChange = (event) => {
        setUpdateStatusRadio(event.target.value);
    }

    // 스케쥴 상태 변경 작성 모달 관련
    const updateSchedulStatusForm = useRef(null); // prompt form ref 지정

    // 스케쥴 상태 변경 모달 이벤트
    const updateSchedulStatusModalOpen = (info) => {
        const { title, start, end, extendedProps } = info.event;

        const formarNowDate = format(new Date(), "yyyy-MM-dd");
        const formatStart = format(start, "yyyy-MM-dd");

        setUpdateStatusRadio(extendedProps.status); // 현재 상태 값 조정

        let modalData = {
            title:`스케쥴 : ${title}`,
            size:{
              width:"50vh",
              height:"20vh"
            }, 
            data : extendedProps,
            scheduleText : `${format(start, "MM-dd HH:mm")} ~ ${format(end, "MM-dd HH:mm")}`
        };

        if(extendedProps.status == 'D'){ // 식단 데이터 클릭 시
          modalData = {
              ...modalData,
              okEvent:() => {
                  setShowUpdateSchedulStatusModal(false);
              }
          }
        }else if(formarNowDate < formatStart){
            modalData = {
                ...modalData,
                alertText:"금일 이후 스케쥴은 상태를 전환할 수 없습니다.",
                okEvent:() => {
                    setShowUpdateSchedulStatusModal(false);
                }
            }
        }else{
            modalData = {
                ...modalData,
                okEvent:() => {
                  if(updateSchedulStatusForm.current){
                      updateSchedulStatusForm.current.requestSubmit();
                  }
                },
                closeEvent: () => {
                  updateSchedulStatusForm.current = "";
                  setShowUpdateSchedulStatusModal(false);
                }
            }
        }
        setUpdateSchedulStatusModalData(modalData);
        setShowUpdateSchedulStatusModal(true);
    }

    // 스케쥴 상태 변경 요청(백엔드)
    const updateScheduleStatus = useUpdateScheduleStatus(); // 스케쥴 상태 변경 훅
    const sendRequestUpdateSchedulStatus = (e) => {
        e.preventDefault();
        // formData 처리
        const formData = new FormData(updateSchedulStatusForm.current);
        updateScheduleStatus(formData, () => {
             // form 초기화
             updateSchedulStatusForm.current = null;
              
             // 스케쥴 개별 클릭 이벤트 modal close
             setShowUpdateSchedulStatusModal(false);
             
             // 변경된 데이터 조회
             getCalendarScheduleList();
        });
    }

    
  // ============================================== 스케쥴 상태 변경 모달 관련  END  ========================================================

    return (
      <div className='pt-10 pb-10 pl-5 pr-5'>
          {
            // 스케쥴러 상세 정보 모달
            isShowScheduleDetailModal && (
                <StandardModal 
                  title={scheduleModal.title} 
                  okEvent={scheduleModal.okEvent} 
                  size={scheduleModal.size} 
                  closeEvent={scheduleModal.closeEvent}>
                    <div className=''>
                        {/* 일자 스케쥴 테이블 */}
                        <DayScheduleTable data={scheduleModal.data} labels={labels} calendarTerm={calendarTerm}/>
                        <div className={`schedule-diet-chart-wrapper w-full mt-5 ${isMobile ? '' : 'flex gap-2.5'}`}>
                            <div className={`${isMobile ? 'w-full' : 'w-1/2'} max-h-52`}>
                                <DietScheduleTable data={scheduleModal.data}/>
                            </div>
                            <div className={`${isMobile ? 'w-full' : 'w-1/2'} max-h-52`}>
                                <DietCalCharts data={scheduleModal.data}/>
                            </div>
                        </div>
                    </div>
                </StandardModal>
            )
          }

          {
              // AI 스케쥴 자동 작성
              isShowAISchedulModal && (
                <StandardModal 
                  title={aiScheduleModalData.title} 
                  okEvent={aiScheduleModalData.okEvent} 
                  size={aiScheduleModalData.size} 
                  closeEvent={aiScheduleModalData.closeEvent}
                  cancelEvent={aiScheduleModalData.closeEvent}>
                    <form className='h-[200px]' ref={aiSchedulePromptForm} onSubmit={sendRequestAiSchedule}>
                      <h2 className='text-center font-bold text-2xl'>AI에게 당신의 한달 목표를 알려주세요!</h2>
                      <textarea 
                          name="prompt" 
                          className='ai-prompt-textarea w-full h-[150px] border mt-5 p-5 rounded-2xl' 
                          placeholder='Ex) 몸무게에서 5kg 빼고 싶어!'></textarea>                            
                    </form>
                </StandardModal>
              )
          }

          {
              // 스케쥴 상태 변환 모달
              isShowUpdateSchedulStatusModal && (
                <StandardModal 
                  title={updateSchedulStatusModalData.title} 
                  okEvent={updateSchedulStatusModalData.okEvent} 
                  size={updateSchedulStatusModalData.size} 
                  closeEvent={updateSchedulStatusModalData.closeEvent}
                  cancelEvent={updateSchedulStatusModalData.closeEvent}>
                    <form ref={updateSchedulStatusForm} onSubmit={sendRequestUpdateSchedulStatus}>
                        <input type="hidden" name="scheduleId" value={updateSchedulStatusModalData.data.scheduleId} />
                        <h2 className='text-center font-bold text-2xl'>{updateSchedulStatusModalData.scheduleText}</h2>
                        {
                          (updateSchedulStatusModalData.alertText && (<div className='text-sm text-center text-red-500'>{updateSchedulStatusModalData.alertText}</div>))
                        }
                        {
                          (!updateSchedulStatusModalData.alertText && (
                              <div className='flex justify-between mt-5 ml-10 mr-10'>
                                  <RadioLabels 
                                      labels={labels} 
                                      labelId="label-status"
                                      labelName="status"
                                      radioUseState={updateStatusRadio} 
                                      radioUseStateHandleChange={updateStatusRadioHandleChange}/>
                              </div>
                            ))
                        }
                    </form>
                </StandardModal>
              )
          }




          <div className='schedule-header-wrapper flex justify-between'>
              <div className='flex gap-3'>
              {
                labels?.map((label, idx) => (
                    <div className='flex justify-between items-center gap-0.5' key={idx}>
                        <label className='relative cursor-pointer' htmlFor={`label-${label.codeId}`}>
                            <div className='w-[14px] h-[14px] m-[5px]' style={{backgroundColor:label.description}}></div>
                            <div className='absolute top-0 left-0 w-[24px] h-[24px]'>
                              {(label.checked ? <CheckSquare/> : <Square/>)}
                            </div>
                        </label>
                        <div>{label.codeName}</div>
                        <input type="checkbox" name="status" id={`label-${label.codeId}`} value={label.codeId} onClick={toggleCheckedLabel}/>
                    </div>
                ))
              }
            </div>

              <button className='ok' onClick={aiScheduleModalOpen}>AI가 작성해드립니다!</button>
          </div>
          <div className="calandar-wrapper mt-5">
              <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // 일자별, 시간별, 이벤트 플러그인
                  initialView={isMobile ? 'timeGridDay' : 'dayGridMonth'} // 모바일 일 때 디폴트 : 월 , PC, 태블릿 디폴트 : 일 
                  locale="ko" // ← 한국어 적용
                  allDaySlot={false} // 종일 영역 제거
                  headerToolbar={{
                    right: 'prev,next',
                    center: 'title',
                    left: `dayGridMonth,${isMobile ? 'timeGridDay' : 'timeGridWeek'}` // 모바일 일 때 월 / 일 노출, PC, 태블릿 일 때 월 / 주 노출 
                  }}
                  height="auto"
                  buttonText={{
                    today: '오늘',
                    month: '월',
                    week: '주',
                    day : '일'
                  }}

                  editable={true} // 드래그 & 리사이징 가능

                  eventDrop={(info) => { // 일정 드랍시 발생 이벤트 처리
                    console.log('드래그 이동:', info.event.title, info.event.start);
                    // 서버 업데이트 필요
                  }}
                  
                  eventResize={(info) => { // 리사이징 이벤트인데 .... 필요없을 듯?
                    console.log('리사이징:', info.event.title, info.event.start, info.event.end);
                  }}

                  dateClick={dateCellModalOpen}
                  eventClick={updateSchedulStatusModalOpen}

                  events={scheduleList}
                  eventContent={contentFormat}

                  datesSet={checkShowDates}
                  />
          </div>
          <ToastContainer/>
      </div>
    )
}

const contentFormat = (eventInfo) => {
  const {start, end, extendedProps} = eventInfo.event;

  // 시간 포맷
  const formatTime = (date) =>
    date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const bgColor = eventInfo.event.backgroundColor || '#3788d8';
    const textColor = eventInfo.event.textColor || eventInfo.event.color || '#fff';
    const borderColor = '#fff';

    return (
        <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: bgColor,
              color: textColor,
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '0.85em',
              gap: '6px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
          }}>
          {/* ● 앞의 점 */}
          <span style={{
              width: '8px',
              height: '8px',
              backgroundColor: borderColor,
              borderRadius: '50%',
              flexShrink: 0,
          }}></span>

          {/* 시간 + 제목 */}
          <div>
              <div style={{ fontWeight: 'bold' }}>
                {formatTime(start)} ~ {formatTime(end)}
              </div>
              <div>{eventInfo.event.title} {extendedProps.excersizeCnt}{extendedProps.unit}</div>
          </div>
      </div>
    );
};

export default Schedule
