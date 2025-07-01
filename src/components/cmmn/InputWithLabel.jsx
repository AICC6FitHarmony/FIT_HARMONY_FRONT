import React from 'react'

const InputWithLabel = ({label, name, value, onChange, isNumber, waringText, isWaring}) => {

  const handleNumberChange = (e)=>{
    let {name, value } = e.target;
    value = value.replace(/[^0-9]/g, "");
    onChange({target:{name, value}})
  }

  return (
    <div className="input-label w-full relative flex gap-2 items-center justify-between">
      {label&&(<div className='label'>{label}</div>)}
      <div className={`input-wrapper flex flex-col ${label?"w-[80%]":"w-full"}`}>
        <input
          name={name}
          onChange={isNumber?handleNumberChange:onChange}
          className={`text-center border py-2 w-full ${isWaring?"border-red-500":""}`}
          value={value}
          type="text"
          />
        {isWaring ? (
              <p className="text-sm text-red-500 absolute bottom-[-17px]">
                {waringText}
              </p>
            ) : (
              ""
            )}
      </div>
    </div>
  )
}

export default InputWithLabel
