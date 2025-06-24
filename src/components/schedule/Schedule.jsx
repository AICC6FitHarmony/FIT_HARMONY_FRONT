// Fullcalendar module 설치
// npm install @fullcalendar/react @fullcalendar/daygrid @fullcalendar/core @fullcalendar/interaction @fullcalendar/timegrid

import React, { useState } from 'react'

// import about fullCalendar
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid'

import '../../css/schedule.css'
import StandardModal from '../cmmn/StandardModal';

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


    return (
      <div className='mt-10 p-5'>
          {/* <StandardModal title="test" contents={modalContents} okEvent={modalOkEvt} size={{width:"35vw", height:"35vh"}}/> */}



          <div className="caland">
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
                  editable={true}             // 드래그 & 리사이징 가능
                  eventDrop={(info) => {
                    console.log('드래그 이동:', info.event.title, info.event.start);
                    // 서버 업데이트 필요
                  }}
                  eventResize={(info) => {
                    console.log('리사이징:', info.event.title, info.event.start, info.event.end);
                  }}

                  dateClick={(info) => { // 일자 셀 클릭 이벤트
                    alert(`클릭한 날짜: ${info.dateStr}`);  // 예: 2025-06-28
                    console.log(info);
                  }}
                  eventClick={(info) => { // 일정 클릭 이벤트
                    alert(`일정 제목: ${info.event.title}\n시작: ${info.event.start}`);
                  }}
                  events={events}
                  />
        </div>
      </div>
    )
}

export default Schedule
