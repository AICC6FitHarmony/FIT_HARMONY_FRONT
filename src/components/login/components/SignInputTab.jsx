import React from 'react'

const SignInputTab = ({classname, idx, targetIdx, children}) => {

  return (
    <div className={`${classname} ${idx===targetIdx?'':'hidden'}`}>
      {children}
    </div>
  )
}

export default SignInputTab
