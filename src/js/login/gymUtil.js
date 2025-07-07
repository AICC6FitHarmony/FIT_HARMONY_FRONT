
export const getGyms = async ()=>{
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_DOMAIN}/login/gym`,
    {
      method:"GET"
    }
  );
  return await res.json();
}

export const createGym = async (body)=>{
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_DOMAIN}/login/gym`,
    {
      method:"POST",
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        charset: 'UTF-8',
      },
      body:JSON.stringify(body)
    }
  );
  return await res.json();
}