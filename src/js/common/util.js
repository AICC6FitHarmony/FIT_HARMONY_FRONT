// UTIL 기능 소스 작성

import { useFormRequest, useRequest } from "../config/requests"

// 통합 업로드 HOOK
export const useFileUpload = () => {
    const request = useFormRequest();
    return async function(formData){
        const result = await uploadRequest("/common/file/doc/upload", formData, request);
        return result;
    }
}

// 문서 업로드 HOOK
export const useDocFileUpload = () => {
    const request = useFormRequest();
    return async function(formData){
        const result = await uploadRequest("/common/file/doc/upload", formData, request);
        return result;
    }
}

// 이미지 업로드 HOOK
export const useImageFileUpload = () => {
    const request = useFormRequest();
    return async function(formData){
        const result = await uploadRequest("/common/file/image/upload", formData, request);
        return result;
    }
}

export const useUpdateGroupId = () => {
    const request = useRequest();
    return async function updateGroupId(body){
        const option = {
            method:"PATCH",
            body : body
        }
        const result = await request("/common/file/update/groupId", option);
        return result;
    }
}



const uploadRequest = async (url, formData, request) => {
    const option = {
        method:"POST",
        body : formData
    }
    const result = await request(url, option);
    return result;
}



// String Format 02d
// ex) pad(6, 2); => '06'
// ex) pad(6, 3); => '006'
// ex) pad(6, 4); => '0006'
const pad = (n, width) => {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}
