import React from "react";
import StandardModal from "../cmmn/StandardModal";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const InbodyCalendarModal = ({
  isOpen,
  onClose,
  calendarEvents,
  onDateClick,
  onDatesSet,
  initialDate,
}) => {
  return (
    isOpen && (
      <StandardModal
        title="캘린더"
        size={{ width: "50vw" }}
        closeEvent={onClose}
      >
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          initialDate={initialDate}
          locale="ko"
          headerToolbar={{
            right: "next",
            center: "title",
            left: "prev",
          }}
          height="auto"
          events={calendarEvents}
          dateClick={onDateClick}
          datesSet={onDatesSet}
        />
      </StandardModal>
    )
  );
};

export default InbodyCalendarModal;
