// Fullcalendar module 설치
// npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/core @fullcalendar/interaction @fullcalendar/timegrid

import React, { useEffect, useRef, useState } from 'react'

// import about fullCalendar
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid'
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';

// import standard modal
import StandardModal from '../cmmn/StandardModal';

// import request 
import { useRequest } from '../../js/config/requests';


// schedule 페이지 css import
import '../../css/schedule.css'
import { CheckSquare, Square } from 'lucide-react';

const Schedule = () => {
    // 캘린더 드래그 이벤트
    const [scheduleList, setScheduleList] = useState([]);

    const request = useRequest();

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
    useEffect(() => {
      getCalendarScheduleList();
    }, [calendarTerm, labels]) // 렌더링 완료되면 캘린더에 보이는 시작 - 끝 일자 데이터가 세팅 됨.


    // calendar 용 스케쥴 조회 함수(function)
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
            setScheduleList([]); // 그냥 빈 값처리 하고
            return; // 동작 멈춤
        }


        const result = await request(`/schedule/calendar/${startTime}/${endTime}?status=${checkedStatus}`, {method:"get"});

        const { success, message, data } = result;
        if(success){
            setScheduleList(data);
        }else{
            if(message == "noAuth") {
                toast.error("로그인 후 이용 가능한 서비스 입니다.", {
                    position: "bottom-center"
                });
            } else {
                toast.error("에러가 발생했습니다.\n잠시후 다시 이용해주세요.", {
                    position: "bottom-center"
                });
            }
        }
    }



    // =========================================  캘린더 관련 END  ===================================================

    // ========================================= 스케쥴 상세 모달 관련 START ===================================================
    // 스케쥴 상세 모달 노출여부 useState
    const [isShowScheduleDetailModal, setIsShowScheduleDetailModal] = useState(false); 

    // 스케쥴 모달 노출 정보 세팅
    const [scheduleModal, setScheduleModal] = useState(null); // 최초 페이지 진입시 모달이 동작하지 않을 조건을 주기 위하여  null 처리

    // useEffect로 scheduleModal가 변경됨을 감지
    useEffect(() => {
      if(scheduleModal){ // 최초 페이지 진입시 모달이 동작하지 않을 조건 처리
        setIsShowScheduleDetailModal(true);
      }
    }, [scheduleModal])

    // 스케쥴 모달 공통 데이터
    const scheduleModalCommonData = {
        okEvent:() => {
          setIsShowScheduleDetailModal(false);
        }, 
        size : {width:"50vw"},
        closeEvent: () => {
          setIsShowScheduleDetailModal(false);
        }
    }

    // 일자 셀 클릭 이벤트
    const dateCellModalOpen = (info) => {  
      // scheduleModal 정보를 useState로 변환 처리 ▶ 변환 처리가 완료되면 useEffect에서 감지하여 모달 오픈 이벤트 발생 시킴
      setScheduleModal({
        title:`${info.dateStr} 스케쥴`, 
        ...scheduleModalCommonData
      });
    }

    // 일정 클릭 이벤트
    const eventCellModalOpen = (info) => { 
      setScheduleModal({
        title:`${format(info.event.start, 'yyyy-MM-dd')} 스케쥴`, 
        ...scheduleModalCommonData
      });
    }
    // ============================================== 스케쥴 상세 모달 관련 END =================================================================




    // ============================================== AI 스케쥴 자동 작성 모달 관련 START ========================================================
    // 스케쥴 상세 모달 노출여부 useState
    const [isShowAISchedulModal, setIsShowAISchedulModal] = useState(false); 

    // 스케쥴 모달 공통 데이터
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
            const { success, message, data } = result;

            if(success){
                  // form 초기화
                  aiSchedulePromptForm.current = null;
                  
                  // modal close
                  setIsShowAISchedulModal(false);
                  
                  // 변경된 데이터 조회
                  getCalendarScheduleList();

                  toast.info("로그인 후 이용 가능한 서비스 입니다.", {
                      position: "bottom-center"
                  });
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
                    <div>

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
                      <h2 className='text-center font-bold text-2xl'>AI에게 당신의 목표를 알려주세요!</h2>
                      <textarea 
                          name="prompt" 
                          className='ai-prompt-textarea w-full h-[150px] border mt-5 p-5 rounded-2xl' 
                          placeholder='Ex) 다음주 월요일 부터 3개월 안에 지금 몸무게에서 5kg 빼고 싶어!'></textarea>                            
                    </form>
                </StandardModal>
              )
          }
          <div className='flex justify-between'>
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
                  initialView="dayGridMonth"
                  locale="ko" // ← 한국어 적용
                  allDaySlot={false} // 종일 영역 제거
                  headerToolbar={{
                    right: 'prev,next',
                    center: 'title',
                    left: 'dayGridMonth,timeGridWeek'
                  }}
                  height="auto"
                  buttonText={{
                    today: '오늘',
                    month: '월',
                    week: '주',
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
                  eventClick={eventCellModalOpen}

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
  const start = eventInfo.event.start;
  const end = eventInfo.event.end;

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
    <div
      style={{
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
      }}
    >
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
        <div>{eventInfo.event.title}</div>
      </div>
    </div>
  );
};


export default Schedule
