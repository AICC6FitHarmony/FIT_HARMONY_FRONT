import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import {
  insertInbodyData,
  clearInsertSuccess,
} from "../../js/redux/slice/sliceInbody";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

const InbodyRegisterForm = ({ onClose, onSubmit, userName, userId }) => {
  const dispatch = useDispatch();
  const { loading, insertSuccess, error } = useSelector(
    (state) => state.inbody
  );
  const [inputMode, setInputMode] = useState(null); // 'photo' 또는 'manual'
  const [formData, setFormData] = useState({
    name: userName,
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

  const handleCancel = () => {
    Swal.fire({
      title: "취소하시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        onClose();
      }
    });
  };

  const handleOk = () => {
    Swal.fire({
      title: "등록하시겠습니까?",
      icon: "success",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({ html: `등록완료` }).then(() => {
          onSubmit(formData);
        });
      }
    });
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
      name: userName,
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

  const handleSubmit = async () => {
    if (!userId) {
      toast.error("사용자 ID가 없습니다.");
      return;
    }

    // 숫자 변환 및 유효성 검사
    const inbodyData = {
      weight: parseFloat(formData.weight),
      bodyWater: parseFloat(formData.bodyWater),
      inbodyScore: parseInt(formData.inbodyScore),
      protein: parseFloat(formData.protein),
      bodyMineral: parseFloat(formData.bodyMineral),
      bodyFat: parseFloat(formData.bodyFat),
      bodyFatPercent: parseFloat(formData.bodyFatPercent),
      bmi: parseFloat(formData.bmi),
      skeletalMuscle: parseFloat(formData.skeletalMuscle),
      trunkMuscle: parseFloat(formData.trunkMuscle),
      leftArmMuscle: parseFloat(formData.leftArmMuscle),
      rightArmMuscle: parseFloat(formData.rightArmMuscle),
      leftLegMuscle: parseFloat(formData.leftLegMuscle),
      rightLegMuscle: parseFloat(formData.rightLegMuscle),
      trunkFat: parseFloat(formData.trunkFat),
      leftArmFat: parseFloat(formData.leftArmFat),
      rightArmFat: parseFloat(formData.rightArmFat),
      leftLegFat: parseFloat(formData.leftLegFat),
      rightLegFat: parseFloat(formData.rightLegFat),
      inbodyTime: formData.date,
    };

    // 선택적 필드 검증 (입력된 경우에만)
    const validationChecks = [
      { field: "weight", name: "체중", value: inbodyData.weight },
      { field: "bodyWater", name: "체수분", value: inbodyData.bodyWater },
      {
        field: "inbodyScore",
        name: "인바디 점수",
        value: inbodyData.inbodyScore,
      },
      { field: "protein", name: "단백질", value: inbodyData.protein },
      { field: "bodyMineral", name: "무기질", value: inbodyData.bodyMineral },
      { field: "bodyFat", name: "체지방", value: inbodyData.bodyFat },
      {
        field: "bodyFatPercent",
        name: "체지방률",
        value: inbodyData.bodyFatPercent,
      },
      { field: "bmi", name: "BMI", value: inbodyData.bmi },
      {
        field: "skeletalMuscle",
        name: "골격근량",
        value: inbodyData.skeletalMuscle,
      },
      {
        field: "trunkMuscle",
        name: "몸통 근육량",
        value: inbodyData.trunkMuscle,
      },
      {
        field: "leftArmMuscle",
        name: "왼팔 근육량",
        value: inbodyData.leftArmMuscle,
      },
      {
        field: "rightArmMuscle",
        name: "오른팔 근육량",
        value: inbodyData.rightArmMuscle,
      },
      {
        field: "leftLegMuscle",
        name: "왼다리 근육량",
        value: inbodyData.leftLegMuscle,
      },
      {
        field: "rightLegMuscle",
        name: "오른다리 근육량",
        value: inbodyData.rightLegMuscle,
      },
      { field: "trunkFat", name: "몸통 체지방", value: inbodyData.trunkFat },
      {
        field: "leftArmFat",
        name: "왼팔 체지방",
        value: inbodyData.leftArmFat,
      },
      {
        field: "rightArmFat",
        name: "오른팔 체지방",
        value: inbodyData.rightArmFat,
      },
      {
        field: "leftLegFat",
        name: "왼다리 체지방",
        value: inbodyData.leftLegFat,
      },
      {
        field: "rightLegFat",
        name: "오른다리 체지방",
        value: inbodyData.rightLegFat,
      },
    ];

    for (const check of validationChecks) {
      // 값이 입력되었지만 유효하지 않은 경우
      if (isNaN(check.value) || check.value < 0) {
        toast.error(`올바른 ${check.name}을(를) 입력해주세요.`);
        return;
      }
    }

    // 특별한 범위 검증
    if (
      inbodyData.bodyFatPercent &&
      (inbodyData.bodyFatPercent < 0 || inbodyData.bodyFatPercent > 100)
    ) {
      toast.error("체지방률은 0%에서 100% 사이의 값이어야 합니다.");
      return;
    }

    if (inbodyData.inbodyScore && inbodyData.inbodyScore < 0) {
      toast.error("인바디 점수는 0보다 커야합니다.");
      return;
    }

    try {
      const result = await dispatch(
        insertInbodyData({ userId, inbodyData })
      ).unwrap();

      if (result.success) {
        handleOk();
      }
    } catch (error) {
      toast.error("에러가 발생했습니다.\n잠시후 다시 이용해주세요.", {
        position: "bottom-center",
      });
    }
  };

  // 등록 성공 시 처리
  useEffect(() => {
    if (insertSuccess) {
      dispatch(clearInsertSuccess());
    }
  }, [insertSuccess, dispatch]);

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
              <button onClick={handleCancel} className="cancel">
                취소
              </button>
              <button onClick={handleSubmit} className="ok" disabled={loading}>
                {loading ? "등록 중..." : "등록"}
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
      <ToastContainer />
    </div>
  );
};

export default InbodyRegisterForm;
