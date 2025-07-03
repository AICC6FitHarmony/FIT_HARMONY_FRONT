// API URL 설정
import { useRequest } from "../config/requests";
import { toast } from "react-toastify";

// 유저 데이터 가져오기 훅
const useGetUserData = () => {
    const request = useRequest();

    return async function getUserData({ userId, callback }) {
        try {
            const result = await request(`/mypage/${userId}`, { method: "get" });
            const { success, message, data } = result;
            
            if (success) {
                
                if (callback) {
                    callback(result);
                } else {
                    return result;
                }
            } else {
                if (message === "noAuth") {
                    toast.error("로그인 후 이용 가능한 서비스 입니다.", {
                        position: "bottom-center"
                    });
                } else {
                    toast.error("서버 연결 오류가 발생했습니다.", {
                        position: "bottom-center"
                    });
                }
            }
        } catch (error) {
            console.error('유저 데이터 가져오기 오류:', error);
            toast.error("서버 연결 오류가 발생했습니다.", {
                position: "bottom-center"
            });
        }
    }
};

// 유저 데이터 수정 훅
const useUpdateUserData = () => {
    const request = useRequest();

    return async function updateUserData({ userId, userData, callback }) {
        try {
            const option = {
                method: "PUT",
                body: userData
            };
            const result = await request(`/mypage/${userId}`, option);
            const { success, message } = result;

            if (success) {
                if (callback) {
                    callback();
                } else {
                    return result;
                }
            } else {
                if (message === "noAuth") {
                    toast.error("로그인 후 이용 가능한 서비스 입니다.", {
                        position: "bottom-center"
                    });
                } else if (message === "duplicateEmail") {
                    toast.error("이미 사용 중인 이메일입니다.", {
                        position: "bottom-center"
                    });
                } else if (message === "duplicateNickname") {
                    toast.error("이미 사용 중인 닉네임입니다.", {
                        position: "bottom-center"
                    });
                } else if (message === "noParam") {
                    toast.error("필수 정보를 입력해주세요.", {
                        position: "bottom-center"
                    });
                } else {
                    toast.error("서버 연결 오류가 발생했습니다.", {
                        position: "bottom-center"
                    });
                }
            }
        } catch (error) {
            console.error('유저 데이터 수정 오류:', error);
            toast.error("서버 연결 오류가 발생했습니다.", {
                position: "bottom-center"
            });
        }
    }
};

// 닉네임 중복체크 훅
const useCheckNicknameDuplicate = () => {
    const request = useRequest();

    return async function checkNicknameDuplicate(nickname) {
        try {
            const option = {
                method: "POST",
                body: { nickname }
            };
            const result = await request("/mypage/check-nickname", option);
            
            if (result.success) {
                return result;
            } else {
                if (result.message === "invalidNickname") {
                    toast.error("닉네임은 한글, 영문, 숫자, 언더바(_)만 사용할 수 있습니다.", {
                        position: "bottom-center"
                    });
                } else if (result.message === "noParam") {
                    toast.error("닉네임을 입력해주세요.", {
                        position: "bottom-center"
                    });
                } else {
                    toast.error(result.message || "중복체크 중 오류가 발생했습니다.", {
                        position: "bottom-center"
                    });
                }
                return {
                    success: false,
                    message: result.message || "중복체크 중 오류가 발생했습니다.",
                    isDuplicate: false
                };
            }
        } catch (error) {
            console.error('닉네임 중복체크 오류:', error);
            toast.error("서버 연결 오류가 발생했습니다.", {
                position: "bottom-center"
            });
            return {
                success: false,
                message: "서버 연결 오류가 발생했습니다.",
                isDuplicate: false
            };
        }
    }
};

// 이메일 중복체크 훅
const useCheckEmailDuplicate = () => {
    const request = useRequest();

    return async function checkEmailDuplicate(email) {
        try {
            const option = {
                method: "POST",
                body: { email }
            };
            const result = await request("/mypage/check-email", option);
            
            if (result.success) {
                return result;
            } else {
                if (result.message === "invalidEmail") {
                    toast.error("올바른 이메일 형식을 입력해주세요.", {
                        position: "bottom-center"
                    });
                } else if (result.message === "noParam") {
                    toast.error("이메일을 입력해주세요.", {
                        position: "bottom-center"
                    });
                } else {
                    toast.error(result.message || "중복체크 중 오류가 발생했습니다.", {
                        position: "bottom-center"
                    });
                }
                return {
                    success: false,
                    message: result.message || "중복체크 중 오류가 발생했습니다.",
                    isDuplicate: false
                };
            }
        } catch (error) {
            console.error('이메일 중복체크 오류:', error);
            toast.error("서버 연결 오류가 발생했습니다.", {
                position: "bottom-center"
            });
            return {
                success: false,
                message: "서버 연결 오류가 발생했습니다.",
                isDuplicate: false
            };
        }
    }
};

// 사용자 활동 내역 조회 훅
const useGetUserActivity = () => {
    const request = useRequest();

    return async function getUserActivity({ userId, callback }) {
        try {
            const result = await request(`/mypage/activity/${userId}`, { method: "get" });
            const { success, message, data } = result;
            
            if (success) {
                if (callback) {
                    callback(data);
                } else {
                    return data;
                }
            } else {
                if (message === "noAuth") {
                    toast.error("로그인 후 이용 가능한 서비스 입니다.", {
                        position: "bottom-center"
                    });
                } else {
                    toast.error("활동 내역 조회 중 오류가 발생했습니다.", {
                        position: "bottom-center"
                    });
                }
            }
        } catch (error) {
            console.error('사용자 활동 내역 조회 오류:', error);
            toast.error("서버 연결 오류가 발생했습니다.", {
                position: "bottom-center"
            });
        }
    }
};

export {
    useGetUserData,
    useUpdateUserData,
    useCheckNicknameDuplicate,
    useCheckEmailDuplicate,
    useGetUserActivity
}