import React, { useState, useEffect } from "react";
import { useGetUserActivity } from "../../js/mypage/mypage";
import { format } from "date-fns";

const MyActivity = ({ userId }) => {
  const [activityData, setActivityData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 활동 내역 조회 훅
  const getUserActivity = useGetUserActivity();

  useEffect(() => {
    console.log("userId :: ", userId);
    if (userId) {
      getUserActivity({
        userId,
        callback: (data) => {
          setActivityData(data);
          setLoading(false);
        },
      });
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-10">
        <h2 className="text-2xl font-bold mb-4 text-center">내 활동</h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-500">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!activityData) {
    return (
      <div className="max-w-4xl mx-auto space-y-10">
        <h2 className="text-2xl font-bold mb-4 text-center">내 활동</h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-500">
            활동 내역을 불러올 수 없습니다.
          </div>
        </div>
      </div>
    );
  }
  const { scheduleActivity, dietActivity, recentPostActivity } = activityData;

  // 스케쥴 달성률 계산
  const scheduleCompletionRate =
    scheduleActivity.totalSchedules > 0
      ? Math.round(
          (scheduleActivity.completedSchedules /
            scheduleActivity.totalSchedules) *
            100
        )
      : 0;

  // 평균 칼로리 계산
  const avgCalorie = dietActivity.avgCalorie
    ? Math.round(dietActivity.avgCalorie)
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <h2 className="text-2xl font-bold mb-4 text-center">내 활동</h2>

      {/* 스케쥴 활동 통계 */}
      <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-4 text-lg">스케쥴 활동 통계</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {scheduleActivity.totalSchedules || 0}
            </div>
            <div className="text-sm text-gray-600">총 스케쥴</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {scheduleActivity.completedSchedules || 0}
            </div>
            <div className="text-sm text-gray-600">목표 성공</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">
              {scheduleActivity.notStartedSchedules || 0}
            </div>
            <div className="text-sm text-gray-600">진행 예정</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              {scheduleActivity.missedSchedules || 0}
            </div>
            <div className="text-sm text-gray-600">목표 실패</div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <div className="w-24 h-24 flex items-center justify-center rounded-full border-4 border-blue-400 text-xl font-bold">
            {scheduleCompletionRate}%
          </div>
          <div>
            <div className="text-sm text-gray-600">스케쥴 달성률</div>
            <div className="text-lg font-semibold">
              {scheduleActivity.completedSchedules || 0} /{" "}
              {scheduleActivity.totalSchedules || 0}
            </div>
          </div>
        </div>
      </section>

      {/* 식단 활동 통계 */}
      <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-4 text-lg">식단 활동 통계</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {dietActivity.totalDiets || 0}
            </div>
            <div className="text-sm text-gray-600">총 식단 기록</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              {avgCalorie}
            </div>
            <div className="text-sm text-gray-600">평균 칼로리</div>
          </div>
        </div>
      </section>

      {/* 최근 활동 내역 */}
      <section className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-4 text-lg">최근 커뮤니티 활동</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2 text-left">날짜</th>
                <th className="px-4 py-2 text-left">카테고리</th>
                <th className="px-4 py-2 text-left">제목 / 내용</th>
              </tr>
            </thead>
            <tbody>
              {recentPostActivity && recentPostActivity.length > 0 ? (
                recentPostActivity.map((activity, i) => (
                  <tr key={i} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2">
                      {format(new Date(activity.date), "yyyy-MM-dd HH:mm")}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          activity.type === "post"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {activity.type === "post" ? "게시글" : "댓글"}
                      </span>
                    </td>
                    <td className="px-4 py-2">{activity.activity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    아직 활동 내역이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default MyActivity;
