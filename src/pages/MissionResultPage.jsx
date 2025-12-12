// src/pages/MissionResultPage.jsx
import { submitToGoogleForm } from "../utils/googleForm";

export default function MissionResultPage({ missionId, score, summary }) {
  // 이름 / 번호는 이미 앞에서 입력받아 localStorage에 저장해 두었다고 가정
  const handleSubmit = async () => {
    const name = localStorage.getItem("studentName") || localStorage.getItem("userName") || "이름없음";
    const number = localStorage.getItem("studentNumber") || "번호없음";

    // 1) (선택) 로컬에도 저장
    const prev = JSON.parse(localStorage.getItem("robotResults") || "[]");
    prev.push({ name, number, missionId, score, summary });
    localStorage.setItem("robotResults", JSON.stringify(prev));

    // 2) 구글 폼으로 전송
    await submitToGoogleForm({
      name,
      number,
      mission: missionId, // 예: "1차시", "2차시", "4차시"
      score,
      result: summary,    // 예: "균형잡이", "환경지킴이" 같은 유형/설명
    });

    alert("제출 완료! 선생님 화면에서 통계가 갱신됩니다.");
  };

  return (
    <div className="min-h-screen bg-emerald-100 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-eco-dark mb-4">미션 결과</h1>
          
          <div className="space-y-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">미션</p>
              <p className="font-semibold">{missionId || "미션 정보 없음"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">점수</p>
              <p className="font-semibold">{score || 0}점</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">결과 요약</p>
              <p className="font-semibold">{summary || "결과 없음"}</p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 w-full px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
          >
            제출하기
          </button>
        </div>
      </div>
    </div>
  );
}





