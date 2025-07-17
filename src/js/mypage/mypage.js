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

// 사용자 계정 비활성화 훅
const useUpdateUserActive = () => {
    const request = useRequest();

    return async function updateUserActive({ userId, bodyData, callback }) {
        try {
            const option = {
                method: "put",
                body: bodyData
            };
            const result = await request(`/mypage/active/${userId}`, option);
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
                } else {
                    toast.error("계정 비활성화 중 오류가 발생했습니다.", {
                        position: "bottom-center"
                    });
                }
            }
        } catch (error) {
            console.error('사용자 계정 비활성화 오류:', error);
            toast.error("서버 연결 오류가 발생했습니다.", {
                position: "bottom-center"
            });
        }
    }
};

// 회원 관리 관련 API 함수들
export const useGetMembers = () => {
  const request = useRequest();
  
  return async ({ page = 1, limit = 10, search = '', status = '', role = '', callback }) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (role) params.append('role', role);
    
    return await request(`/mypage/admin/members?${params.toString()}`, {
      method: 'GET',
      callback
    });
  };
};

export const useUpdateMemberStatus = () => {
  const request = useRequest();
  
  return async ({ userId, status, reason = '', callback }) => {
    return await request('/mypage/admin/member/status', {
      method: 'PUT',
      body: { userId, status, reason },
      callback
    });
  };
};

export const useGetMemberDetail = () => {
  const request = useRequest();
  
  return async ({ userId, callback }) => {
    return await request(`/mypage/admin/member/${userId}`, {
      method: 'GET',
      callback
    });
  };
};

    export {
    useGetUserData,
    useUpdateUserData,
    useCheckNicknameDuplicate,
    useGetUserActivity,
    useUpdateUserActive
}