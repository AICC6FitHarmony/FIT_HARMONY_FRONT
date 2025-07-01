import React, { useState } from "react";

const MyActivity = () => {
  // 샘플 데이터 (실제 연동 시 API로 대체)
  const [workoutRecords] = useState([
    { date: "2024-06-01", type: "런닝", duration: 30 },
    { date: "2024-06-02", type: "웨이트", duration: 45 },
  ]);
  const [goals] = useState({
    total: 10,
    achieved: 7,
  });
  const [challenges] = useState([
    { name: "6월 플랭크 챌린지", status: "참여중" },
    { name: "5월 만보 걷기", status: "완료" },
  ]);
  const [posts] = useState([
    { title: "오늘의 운동 인증", date: "2024-06-01" },
    { title: "식단 공유", date: "2024-05-30" },
  ]);
  const [comments] = useState([
    { content: "멋져요!", date: "2024-06-01" },
    { content: "화이팅!", date: "2024-05-29" },
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <h2 className="text-2xl font-bold mb-4 text-center">내 활동</h2>
      {/* 운동 기록 조회 */}
      <section className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">운동 기록</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="px-2 py-1">날짜</th>
                <th className="px-2 py-1">운동 종류</th>
                <th className="px-2 py-1">운동 시간(분)</th>
              </tr>
            </thead>
            <tbody>
              {workoutRecords.map((rec, i) => (
                <tr key={i} className="border-b">
                  <td className="px-2 py-1">{rec.date}</td>
                  <td className="px-2 py-1">{rec.type}</td>
                  <td className="px-2 py-1">{rec.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {/* 목표 달성 현황 및 통계 */}
      <section className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">목표 달성 현황</h3>
        <div className="flex items-center gap-4">
          <div className="w-32 h-32 flex items-center justify-center rounded-full border-4 border-blue-400 text-2xl font-bold">
            {Math.round((goals.achieved / goals.total) * 100)}%
          </div>
          <div>
            <div>총 목표: {goals.total}개</div>
            <div>달성: {goals.achieved}개</div>
          </div>
        </div>
      </section>
      {/* 참여한 챌린지/프로그램 목록 */}
      <section className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">참여한 챌린지/프로그램</h3>
        <ul className="list-disc pl-5">
          {challenges.map((c, i) => (
            <li key={i} className="mb-1">
              <span className="font-medium">{c.name}</span>{" "}
              <span className="text-xs text-gray-500">({c.status})</span>
            </li>
          ))}
        </ul>
      </section>
      {/* 작성한 게시물/댓글 관리 */}
      <section className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-2">작성한 게시물</h3>
        <ul className="list-disc pl-5">
          {posts.map((p, i) => (
            <li key={i} className="mb-1">
              <span className="font-medium">{p.title}</span>{" "}
              <span className="text-xs text-gray-500">({p.date})</span>
            </li>
          ))}
        </ul>
        <h3 className="font-semibold mt-4 mb-2">작성한 댓글</h3>
        <ul className="list-disc pl-5">
          {comments.map((c, i) => (
            <li key={i} className="mb-1">
              <span>{c.content}</span>{" "}
              <span className="text-xs text-gray-500">({c.date})</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default MyActivity;
