// src/pages/TeacherPage.jsx
import { useTeacherDashboardData } from "../hooks/useTeacherDashboardData";

// 미션 메타 정보 (라벨 + 색상)
const MISSION_META = {
  "1차시": { label: "🔍 AI는 무엇일까?", barColor: "bg-emerald-400" },
  "2차시": { label: "🤖 로봇을 움직여봐요!", barColor: "bg-sky-400" },
  "4차시": { label: "🌱 환경을 지키는 AI!", barColor: "bg-lime-500" },
};

// 유형 메타 정보 (라벨 + 색상)
const TYPE_META = {
  균형잡이: {
    label: "⚖️ 균형잡이",
    pillClass: "bg-violet-100 text-violet-700",
  },
  환경지킴이: {
    label: "🌱 환경지킴이",
    pillClass: "bg-emerald-100 text-emerald-700",
  },
  사람지킴이: {
    label: "🤝 사람지킴이",
    pillClass: "bg-orange-100 text-orange-700",
  },
};

export default function TeacherPage() {
  // ✅ 훅은 여기 딱 한 번만!
  const { loading, error, stats } = useTeacherDashboardData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-eco-light">
        <div className="bg-white shadow-lg rounded-2xl px-8 py-6">
          데이터를 불러오는 중입니다...
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white shadow-lg rounded-2xl px-8 py-6 text-red-600">
          대시보드 데이터를 불러오는 중 오류가 발생했습니다.
          <br />
          시트 공개 설정과 CSV 주소를 확인해 주세요.
        </div>
      </div>
    );
  }

  const {
    totalStudents,
    completedStudents,
    completionRate,
    averageProgress,
    missionStats,
    aiTypeStats,
  } = stats;

  return (
    <div className="min-h-screen bg-eco-light">
      {/* 상단 헤더 */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              🤖 지구를 지키는 AI 용사들
            </h1>
            <p className="text-sm text-gray-500">선생님용 대시보드</p>
          </div>
        </div>
      </header>

      {/* 본문 */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* 요약 카드 */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            🧑‍🏫 수업 현황 한눈에 보기
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              title="전체 학생"
              icon="👥"
              main={`${totalStudents}명`}
              sub="설정된 학급 인원"
            />
            <StatCard
              title="완료율"
              icon="✅"
              main={`${completionRate}%`}
              sub={`${completedStudents}명 / ${totalStudents}명`}
            />
            <StatCard
              title="평균 진행률"
              icon="📊"
              main={`${averageProgress}%`}
              sub="1인당 평균 완료 비율"
            />
          </div>
        </section>

        {/* 차시별 완료 현황 */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            📚 차시별 완료 현황
          </h2>
          <div className="bg-white rounded-2xl shadow p-4 space-y-3">
            {missionStats.length === 0 && (
              <div className="text-gray-400 text-sm">
                아직 제출된 데이터가 없습니다.
              </div>
            )}
            {missionStats.map((m) => {
              const meta = MISSION_META[m.missionId] ?? {
                label: m.missionId,
                barColor: "bg-emerald-400",
              };
              return (
                <ProgressRow
                  key={m.missionId}
                  label={meta.label}
                  barColor={meta.barColor}
                  count={m.count}
                  total={totalStudents}
                />
              );
            })}
          </div>
        </section>

        {/* AI 윤리 유형 분포 */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            ⚖️ AI 윤리 유형 분포
          </h2>
          <div className="bg-white rounded-2xl shadow p-4 space-y-3">
            {aiTypeStats.length === 0 && (
              <div className="text-gray-400 text-sm">
                아직 유형 결과가 없습니다.
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {aiTypeStats.map((t) => {
                const meta = TYPE_META[t.type] ?? {
                  label: t.type || "기타",
                  pillClass: "bg-gray-100 text-gray-700",
                };
                return (
                  <span
                    key={t.type}
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${meta.pillClass}`}
                  >
                    <span>{meta.label}</span>
                    <span className="opacity-80">{t.count}명</span>
                  </span>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, icon, main, sub }) {
  return (
    <div className="bg-white rounded-2xl shadow px-6 py-4 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{title}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="text-2xl font-bold">{main}</div>
      {sub && <div className="text-xs text-gray-400">{sub}</div>}
    </div>
  );
}

function ProgressRow({ label, barColor, count, total }) {
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span>
          {count}/{total} ({percent}%)
        </span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
