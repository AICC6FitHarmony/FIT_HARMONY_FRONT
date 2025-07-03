// import { request } from "../config/requests";

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
  const response = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/community/${board_id}`);
  const res = await response.json();
  // console.log(res);
  setPosts(res);
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

export const getComments = async(postId, setComments)=>{
  const response = await fetch(`${import.meta.env.VITE_BACKEND_DOMAIN}/community/comments/${postId}`);
  const res = await response.json();
  // console.log(res);
  setComments(res);
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
  return res;
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