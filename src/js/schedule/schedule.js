import { useRequest } from "../config/requests";
import { toast } from "react-toastify";

const useUpdateScheduleStatus = () => {
    const request = useRequest();

    return async function updateScheduleStatus(formData, callback) {
        const option = {
            method:"PATCH",
            body : Object.fromEntries(formData.entries())
        }
        const result = await request("/schedule/updateSchedule", option);
        const { success, message } = result;
    
        if(success){
            if(callback){
                callback();
            }else{
                return result;
            }
        }else{
          if(message == "noAuth"){
              toast.error("로그인 후 이용 가능한 서비스 입니다.", {
                  position: "bottom-center"
              });
          }else{
              toast.error("에러가 발생했습니다.\n잠시후 다시 이용해주세요.", {
                  position: "bottom-center"
              });
          }
        }
    }
}



const useGetScheduleList = () => {
    const request = useRequest();

    return async function getScheduleList ({startTime, endTime, checkedStatus, callback}){
        const queryParamString = (checkedStatus ? `?status=${checkedStatus}` : '');
        const result = await request(`/schedule/calendar/${startTime}/${endTime}${queryParamString}`, {method:"get"});

        const { success, message, data } = result;
        if(success){
            if(callback){
                callback(data);
            }else{
                return result;
            }
        }else{
            if(message == "noAuth") {
                toast.error("로그인 후 이용 가능한 서비스 입니다.", {
                    position: "bottom-center"
                });
            } else if(message == "noBuyer"){
                toast.error("강사님의 회원 정보만 조회할 수 있습니다.", {
                    position: "bottom-center"
                });
            } else {
                toast.error("에러가 발생했습니다.\n잠시후 다시 이용해주세요.", {
                    position: "bottom-center"
                });
            }
        }
    }
}




export {
    useUpdateScheduleStatus,
    useGetScheduleList
}