import React from 'react'

const SignInputTab = ({idx, thisIdx, children}) => {

  return (
    <div className={`py-5 px-5 ${idx===thisIdx?'':'hidden'}`}>
      {children}
    </div>
  )
}

export default SignInputTab
