// import { request } from "../config/requests";

export const PERMISSION_TYPES = ["read", "write", "reply", "comment"];
export const PERMISSION_ROLES = ["ADMIN","TRAINER","MEMBER","OTHERS"];

export const getPermission = async ({role, boardId, permission}) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/community/permission?role=${role}&boardId=${boardId}&permission=${permission}`);
  return await response.json();
}

export const getPermissions = async ({boardId})=>{
  const response = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/community/permissions/${boardId}`);
  return await response.json();
}

export const updatePermission = async (body)=>{
  const response = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/community/permission`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      charset: 'UTF-8',
    },
    body: JSON.stringify(body)
  });
  const res = await response.json();
  return res;
}

export const updateBoard = async (body)=>{
  const response = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/community/board`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      charset: 'UTF-8',
    },
    body: JSON.stringify(body)
  });
  return await response.json();
}

export const getBoards = async ()=>{
  const response = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/community/board/list`);
  return await response.json();
}

export const getFilteredBoards = async (role, permission)=>{
  const response = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/community/filteredBoards?role=${role}&permission=${permission}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      charset: 'UTF-8',
    }
  });
  return await response.json();
}

export const getBoardInfo = async (boardId)=>{
  const response = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/community/board/${boardId}`);
  return await response.json();
}

export const postCreate = async (formData)=>{
  const response = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/community/post`, {
    method: 'POST',
    credentials: 'include',
    body: formData
  });
  const result = await response.json();
  return result;
}

export const postUpdate = async (formData)=>{
  const response = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/community/post`, {
    method: 'PUT',
    credentials: 'include',
    body: formData
  });
  const result = await response.json();
  return result;
}

export const getPosts = async (board_id, setPosts)=>{
  const url = `${import.meta.env.VITE_BACKEND_DOMAIN}/community/${board_id}${query}`;

  const response = await fetch(url);
  const res = await response.json();
  // console.log(res);
  setPosts(res);
  console.log(res);
  return res;
}

export const searchQuery = ({board_id, keyword, key_type, page})=>{
  const queryStrings = [];
  keyword&&queryStrings.push(`keyword=${keyword}`);
  page&&queryStrings.push(`page=${page}`);
  key_type&&queryStrings.push(`key_type=${key_type}`);
  console.log(queryStrings);
  const query = `${board_id?board_id:""}?${queryStrings.join('&')}`;
  return query;
}

export const searchPost = async ({board_id, query, setPosts})=>{

  const url = `${import.meta.env.VITE_BACKEND_DOMAIN}/community/${board_id}${query}`;

  const response = await fetch(url);
  const res = await response.json();
  // console.log(res);
  if(res.success){
    setPosts(res.data.posts);
  }
  // console.log(res);
  return res;
}

export const searchPost2 = async ({board_id, query, setPosts})=>{

  const url = `${import.meta.env.VITE_BACKEND_DOMAIN}/community/getPosts/${board_id}${query}`;

  const response = await fetch(url);
  const res = await response.json();
  // console.log(res);
  if(res.success){
    setPosts(res.data.posts);
  }
  // console.log(res);
  return res;
}

export const getPost = async (postId) =>{
  const response = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/community/post/${postId}`);
  const res = await response.json();
  // console.log(res);
  return res;
}

export const deletePost = async(body)=>{
  // await request(`${import.meta.env.VITE_BACKEND_DOMAIN}/community/delete`,{
  //   method:"DELETE",
  //   body:body
  // })
  
  const res = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/community/delete`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      charset: 'UTF-8',
    },
    body: JSON.stringify(body)
  });
  return res;
}
export const findComment = async(postId, commentId) =>{
  const response = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/community/comment/${postId}/${commentId}`);
  const res = await response.json();
  return res;
}

export const getComments = async(postId, page, setComments)=>{
  const response = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/community/comments/${postId}?page=${page}`);
  const res = await response.json();
  // console.log(res);
  if(res.success&&setComments)
    setComments(res.data.comments);
  // console.log(res);
  return res;
}

export const createComment = async(body)=>{
  const res = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/community/comment/create`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      charset: 'UTF-8',
    },
    body: JSON.stringify(body)
  });
  return await res.json();
}

export const deleteComment = async(body)=>{
  const res = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/community/comment`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      charset: 'UTF-8',
    },
    body: JSON.stringify(body)
  });
  return res;
}

export const updateComment = async(body)=>{
  const res = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/community/comment`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      charset: 'UTF-8',
    },
    body: JSON.stringify(body)
  });
  return res;
}