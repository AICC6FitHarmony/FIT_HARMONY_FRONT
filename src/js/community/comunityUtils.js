
//formData : 회원가입 정보
export const postCreate = async (formData)=>{
  const response = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/community/post`, {
    method: 'POST',
    credentials: 'include',
    // headers: { 'Content-Type': 'multipart/form-data'},
    // body: JSON.stringify(formData)
    body: formData
  });
  // 2. 직접 리디렉션 (백엔드가 바로 구글로 리디렉션하지 않고 URL만 응답하는 구조)
  const result = await response.json();
  return result;
}