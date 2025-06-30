import React, { useState } from "react";
import { format } from "date-fns";

const InbodyRegisterForm = ({ onClose, onSubmit }) => {
  const [inputMode, setInputMode] = useState(null); // 'photo' 또는 'manual'
  const [formData, setFormData] = useState({
    name: "",
    date: format(new Date(), "yyyy-MM-dd"),
    weight: "",
    bodyWater: "",
    inbodyScore: "",
    protein: "",
    bodyMineral: "",
    bodyFat: "",
    bodyFatPercent: "",
    bmi: "",
    skeletalMuscle: "",
    trunkMuscle: "",
    leftArmMuscle: "",
    rightArmMuscle: "",
    leftLegMuscle: "",
    rightLegMuscle: "",
    trunkFat: "",
    leftArmFat: "",
    rightArmFat: "",
    leftLegFat: "",
    rightLegFat: "",
  });

  // 폼 입력 핸들러
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleManualInput = () => {
    setInputMode("manual");
  };

  const handlePhotoInput = () => {
    setInputMode("photo");
    console.log("사진으로 입력 선택");
  };

  const handleBackToSelection = () => {
    setInputMode(null);
    setFormData({
      name: "",
      date: format(new Date(), "yyyy-MM-dd"),
      weight: "",
      bodyWater: "",
      inbodyScore: "",
      protein: "",
      bodyMineral: "",
      bodyFat: "",
      bodyFatPercent: "",
      bmi: "",
      skeletalMuscle: "",
      trunkMuscle: "",
      leftArmMuscle: "",
      rightArmMuscle: "",
      leftLegMuscle: "",
      rightLegMuscle: "",
      trunkFat: "",
      leftArmFat: "",
      rightArmFat: "",
      leftLegFat: "",
      rightLegFat: "",
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="p-6">
      {inputMode === null && (
        <>
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-4">
              인바디 데이터 입력 방법을 선택하세요
            </h3>
          </div>
          <div className="flex flex-col gap-4">
            <button
              className="bg-green-500 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-green-600 transition-colors"
              onClick={handlePhotoInput}
            >
              📷 사진으로 입력
            </button>
            <button
              className="bg-blue-500 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-blue-600 transition-colors"
              onClick={handleManualInput}
            >
              ✏️ 직접 입력
            </button>
          </div>
        </>
      )}

      {inputMode === "manual" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">직접 입력</h3>
            <button
              onClick={handleBackToSelection}
              className="text-gray-500 hover:text-gray-700"
            >
              ← 뒤로가기
            </button>
          </div>

          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">이름</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                placeholder="이름을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">날짜</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          {/* 인바디 데이터 입력 */}
          <div className="space-y-4">
            <h4 className="font-semibold text-green-600">기본 측정값</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  체중 (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  인바디 점수
                </label>
                <input
                  type="number"
                  value={formData.inbodyScore}
                  onChange={(e) =>
                    handleInputChange("inbodyScore", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  체수분 (L)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.bodyWater}
                  onChange={(e) =>
                    handleInputChange("bodyWater", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  단백질 (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.protein}
                  onChange={(e) => handleInputChange("protein", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  무기질 (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.bodyMineral}
                  onChange={(e) =>
                    handleInputChange("bodyMineral", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  체지방 (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.bodyFat}
                  onChange={(e) => handleInputChange("bodyFat", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  체지방률 (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.bodyFatPercent}
                  onChange={(e) =>
                    handleInputChange("bodyFatPercent", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  BMI (kg/m²)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.bmi}
                  onChange={(e) => handleInputChange("bmi", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  골격근량 (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.skeletalMuscle}
                  onChange={(e) =>
                    handleInputChange("skeletalMuscle", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="0.0"
                />
              </div>
            </div>

            <h4 className="font-semibold text-green-600">근육량 분석</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  몸통 근육량 (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.trunkMuscle}
                  onChange={(e) =>
                    handleInputChange("trunkMuscle", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  왼팔 근육량 (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.leftArmMuscle}
                  onChange={(e) =>
                    handleInputChange("leftArmMuscle", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  오른팔 근육량 (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.rightArmMuscle}
                  onChange={(e) =>
                    handleInputChange("rightArmMuscle", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  왼다리 근육량 (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.leftLegMuscle}
                  onChange={(e) =>
                    handleInputChange("leftLegMuscle", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  오른다리 근육량 (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.rightLegMuscle}
                  onChange={(e) =>
                    handleInputChange("rightLegMuscle", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="0.0"
                />
              </div>
            </div>

            <h4 className="font-semibold text-green-600">체지방 분석</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  몸통 체지방 (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.trunkFat}
                  onChange={(e) =>
                    handleInputChange("trunkFat", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  왼팔 체지방 (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.leftArmFat}
                  onChange={(e) =>
                    handleInputChange("leftArmFat", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  오른팔 체지방 (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.rightArmFat}
                  onChange={(e) =>
                    handleInputChange("rightArmFat", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  왼다리 체지방 (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.leftLegFat}
                  onChange={(e) =>
                    handleInputChange("leftLegFat", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="0.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  오른다리 체지방 (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.rightLegFat}
                  onChange={(e) =>
                    handleInputChange("rightLegFat", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                  placeholder="0.0"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}

      {inputMode === "photo" && (
        <div className="text-center">
          <p className="text-gray-500">사진으로 입력 기능은 준비 중입니다.</p>
          <button
            onClick={handleBackToSelection}
            className="mt-4 px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            뒤로가기
          </button>
        </div>
      )}
    </div>
  );
};

export default InbodyRegisterForm;
