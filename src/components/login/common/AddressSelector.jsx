import React from 'react'
import DaumPostcode from "react-daum-postcode";
import StandardModal from '../../cmmn/StandardModal';
const AddressSelector = ({setZipCode, setAddress, completeEvent}) => {
  const handleComplete = (data) => {
    setZipCode&&setZipCode(data.zonecode);
    setAddress&&setAddress(data.address);
    completeEvent&&completeEvent();
  };
  return (
    <DaumPostcode onComplete={handleComplete} autoClose />
  )
}

export const AddressSelectorWithModal = ({setZipCode, setAddress, isOpen, setIsOpen}) =>{
  const handleCancel = ()=>{
    setIsOpen(false);
  }

  return(
    <>
      {isOpen?(
        <StandardModal 
        cancelEvent={handleCancel}
        closeEvent={handleCancel}
        >
          <AddressSelector setZipCode={setZipCode} setAddress={setAddress} 
          completeEvent={()=>setIsOpen&&setIsOpen(false)}
          />
        </StandardModal>
      ):""}
    </>
  )
}

export default AddressSelector
