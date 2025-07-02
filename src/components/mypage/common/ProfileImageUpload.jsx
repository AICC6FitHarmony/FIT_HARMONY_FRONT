import React, { useRef, useState } from "react";

const defaultProfileImg = "/defaultProfileImg.png";

const ProfileImageUpload = ({ profileImg, onImageChange, onImageDelete }) => {
  const fileInput = useRef();

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => onImageChange(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImgDelete = () => {
    onImageDelete("");
  };

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-12 p-6 rounded-xl">
      <div className="relative flex items-center justify-center w-40 h-40">
        <img
          src={profileImg || defaultProfileImg}
          alt="프로필"
          className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
        />
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">
          프로필 사진
        </h3>
        <div className="flex gap-3">
          <button
            type="button"
            className="px-6 py-3 ok"
            onClick={() => fileInput.current.click()}
          >
            사진 변경
          </button>
          <button
            type="button"
            className="px-6 py-3 cancel"
            onClick={handleImgDelete}
          >
            삭제
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInput}
            className="hidden"
            onChange={handleImgChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileImageUpload;
