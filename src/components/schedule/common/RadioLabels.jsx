import { CheckSquare, Square } from 'lucide-react'
import React from 'react'

const RadioLabels = ({labels, labelId, labelName, radioUseState, radioUseStateHandleChange, disabled}) => {
    return (
        <>
              {
                labels?.map((label, idx) => (
                    (
                      label.codeId != 'D' ?  
                      <div key={idx} className={`flex justify-between items-center gap-0.5 scale-120 ${(disabled && radioUseState != label.codeId) ? 'opacity-30' : ''}`}>
                          <label className={`relative ${disabled ? '' : 'cursor-pointer'}`} htmlFor={`${labelId}-${label.codeId}`} disabled={disabled}>
                              <div className='w-[14px] h-[14px] m-[5px]' style={{backgroundColor:label.description}}></div>
                              <div className='absolute top-0 left-0 w-[24px] h-[24px]'>
                                {(radioUseState == label.codeId ? <CheckSquare/> : <Square/>)}
                              </div>
                          </label>
                          <div>{label.codeName}</div>
                          <input 
                                type="radio" 
                                name={labelName} 
                                id={`${labelId}-${label.codeId}`} 
                                value={label.codeId} 
                                checked={(radioUseState == label.codeId)}
                                onChange={radioUseStateHandleChange}
                                disabled={disabled}/>
                      </div>
                      : 
                      ''
                    )
                ))
              }
        </>
    )
}

export default RadioLabels
