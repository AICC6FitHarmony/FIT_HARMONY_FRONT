// Fullcalendar module 설치
// npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/core @fullcalendar/interaction @fullcalendar/timegrid

import React, { useEffect, useRef, useState } from 'react'

// import about fullCalendar
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid'
import { format } from 'date-fns';

// import standard modal
import StandardModal from '../cmmn/StandardModal';

// import request 
import { request } from '../../js/config/requests';


// schedule 페이지 css import
import '../../css/schedule.css'

const Schedule = () => {

    // 캘린더 드래그 이벤트
    const [events, setEvents] = useState([
      {
        title: '회의',
        start: '2025-06-24',         // 하루 종일 이벤트
        // 컬러지정 옵션
        backgroundColor: '#ff4d4d',
        textColor: 'white',
        borderColor: '#cc0000',
        allDay: false
      },
      {
        title: '면접',
        start: '2025-06-25 10:20:00', // 시간 포함
        end: '2025-06-28 11:00:00',
      },
      {
        title: '여행',
        start: new Date('2025-06-27 12:00:00'),
        allDay: false
      }
    ]);

    // ============================================== 스케쥴 상세 모달 관련 START =================================================================
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
                    prompt : formData.get('prompt')
                },
                callback: () => {
                    // form 초기화
                    aiSchedulePromptForm.current = null;
                    // modal close
                    setIsShowAISchedulModal(false);
                }
            }
            const result = await request("/schedule/requestAiSchdule", option);
        }

        requestAiSchedule();
    }
    // ============================================== AI 스케쥴 자동 작성 모달 관련 END ==========================================================


    return (
      <div className='mt-10'>
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
                          placeholder='Ex) 다음주 월요일 부터 3개월 안에 지금 몸무게에서 5kg 빼고 싶어!'>1개월간 4kg 감량하고 싶어</textarea>                            
                    </form>
                </StandardModal>
              )

          }
          <div className='text-right'>
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
                  events={events}
                  />
        </div>
      </div>
    )
}

export default Schedule
