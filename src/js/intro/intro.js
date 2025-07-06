// API URL 설정
import { useRequest } from "../config/requests";
import { toast } from "react-toastify";

// 사용자 활동 내역 조회 훅
const useGetIntroData = () => {
    const request = useRequest();

    return async function getIntroData({callback}) {
        try {
            const result = await request(`/`, { method: "get" });
            console.log("result" , result)
            const { success, message, data } = result;
            
            if (success) {
                if (callback) {
                    callback(result);
                } else {
                    return result;
                }
            } else {
                toast.error("서버 연결 오류가 발생했습니다.", {
                    position: "bottom-center"
                });
            }
        } catch (error) {
            console.error('서버 연결 오류:', error);
            toast.error("서버 연결 오류가 발생했습니다.", {
                position: "bottom-center"
            });
        }
    }
};

// 사용자 데이터 조회 함수
const selectUserData = async (userId) => {
    const userQuery = `
        SELECT
            user_id,
            user_name,
            file_id,
            nick_name,
            phone_number,
            age,
            height,
            weight,
            fit_history,
            fit_goal,
            introduction,
			gym_id,
            role
        FROM "USER"
        WHERE user_id = $1
    `;

    return await sendQuery(userQuery, [userId]);
};

    export {
    useGetIntroData,
}