import React from 'react'

const InputWithLabel = ({label, name, value, onChange, isNumber, waringText, isWaring, placeholder, className, readOnly}) => {

  if(!className){
    className = "w-full flex gap-2 items-center justify-between"
  }

  const handleNumberChange = (e)=>{
    let {name, value } = e.target;
    value = value.replace(/[^0-9]/g, "");
    onChange({target:{name, value}})
  }

  return (
    <div className={"input-with-label "+className}>
      {label&&(<div className='label whitespace-nowrap'>{label}</div>)}
      <div className={`input-wrapper relative flex flex-col ${label?"w-[80%]":"w-full"}`}>
        <input
          name={name}
          onChange={isNumber?handleNumberChange:onChange}
          placeholder={placeholder}
          className={`text-center border py-2 w-full ${isWaring?"border-red-500":""} ${readOnly?"bg-orange-50":""}`}
          value={value}
          type="text"
          readOnly = {readOnly}
          />
        {isWaring ? (
              <p className="waring-text text-sm text-red-500 absolute bottom-[-17px]">
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
