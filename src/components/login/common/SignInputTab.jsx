import React from 'react'

const SignInputTab = ({idx, thisIdx, children, title}) => {

  return (
    <div className={`${idx===thisIdx?'':'hidden'}`}>
      {title&&(
        <div className='text-2xl font-bold pb-4 text-center'>{title}</div>
      )}
      <div className="py-5 px-5">
      
        {children}
      </div>
    </div>
  )
}

export default SignInputTab
