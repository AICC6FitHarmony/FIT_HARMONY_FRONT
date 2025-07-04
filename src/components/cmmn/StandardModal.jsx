import { X } from "lucide-react";
import React, { useEffect } from "react";
// title : 모달 제목 파라미터
// contents : 모달 내용 파라미터 ▶ JSX 전달 [ex] const content = (<div>test</div>)
// okEvent : 확인 버튼 이벤트 파라미터 (function)
// cancelEvent : 취소 버튼 이벤트 파라미터 (function)
// size : 모달 크기 전달 [ex] : {width:"100px", height:"100px"}
// closeEvent : X 버튼 이벤트
const StandardModal = ({
  title,
  okEvent,
  cancelEvent,
  size,
  closeEvent,
  children,
}) => {
  // ESC 키 이벤트 리스너 추가
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && closeEvent) {
        closeEvent();
      }
    };

    document.addEventListener("keydown", handleEscKey);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [closeEvent]);

  // size 옵션 없으면 디폴트 적용
  let width = "35vw";
  let height = "35vw";
  if (size) {
    if (size.width) {
      // size width 정보 있으면 적용
      width = size.width;
    }
    if (size.height) {
      // size height 정보 있으면 적용
      height = size.height;
    }
  }


  useEffect(() => {
    // 마운트 시
    document.body.style.overflow = 'hidden';

    return () => { // 언마운트 시 원래대로 복원 : 해당 훅이 없어질 때 동작?
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed w-screen h-screen top-0 left-0 z-80 flex justify-center items-center">
      {/*  modal 노출시 전체 화면 wrapper  */}
      <div
        className="modal-wrapper z-1 bg-white rounded-2xl overflow-hidden flex flex-col justify-between"
        style={{ width: width, minHeight: height, maxHeight: "90vh" }}
      >
        <div className="modal-header bg-green-50">
          <div className="border-b border-green-800 flex justify-between pb-4 pt-4 pl-10 pr-10 bg-green-50">
            <h2 className="flex flex-col justify-center w-full text-ellipsis overflow-hidden text-xl font-bold">
              {title}
            </h2>
            {/* X 버튼 중앙 정렬 */}
            <div className="flex flex-col justify-center">
              <button onClick={closeEvent}>
                <X />
              </button>
            </div>
          </div>
        </div>

        {/* 모달의 콘텐츠가 입력되는 wrapper - 스크롤 추가 */}
        <div className="modal-contents-wrapper pb-4 pt-4 pl-10 pr-10 overflow-y-auto flex-1">
          {children}
        </div>

        <div className="modal-footer pb-4 pt-4 pl-10 pr-10 text-right">
          {
            // 확인 버튼 이벤트 있는 경우 확인 버튼 노출
            okEvent && (
              <button className="ok" onClick={okEvent}>
                확인
              </button>
            )
          }
          {
            // 취소 버튼 이벤트 있는 경우 취소 버튼 노출
            cancelEvent && (
              <button className="cancel ml-2" onClick={cancelEvent}>
                취소
              </button>
            )
          }
        </div>
      </div>

      {/*  modal 노출시 회색 백그라운드(다른 곳 클릭 방지 겸, 모달에 시선 집중 처리)  */}
      <div className="absolute w-full h-full bg-gray-500 opacity-70"></div>
    </div>
  );
};

export default StandardModal;
