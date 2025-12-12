// src/pages/TeacherPage.jsx
import { useTeacherDashboardData } from "../hooks/useTeacherDashboardData";

// 🔎 미션별 라벨 + 아이콘 + 색상
const MISSION_META = {
  "1차시": {
    label: "🔍 1차시 · AI는 무엇일까?",
    barColor: "bg-emerald-400",
  },
  "2차시": {
    label: "🤖 2차시 · 로봇을 움직여봐요!",
    barColor: "bg-sky-400",
  },
  "3차시": {
    label: "⚡ 3차시 · 전기도 탐구해요",
    barColor: "bg-amber-400",
  },
  "4차시": {
    label: "🌱 4차시 · AI 윤리와 나",
    barColor: "bg-lime-500",
  },
};

// ⚖️ AI 윤리 유형별 라벨 + 색상
const TYPE_META = {
  균형잡이: {
    label: "⚖️ 균형잡이",
    description: "상황에 따라 균형 있게 판단하는 타입",
    pillClass: "bg-violet-100 text-violet-700",
  },
  환경지킴이: {
    label: "🌱 환경지킴이",
    description: "지구와 자연을 먼저 떠올리는 타입",
    pillClass: "bg-emerald-100 text-emerald-700",
  },
  사람지킴이: {
    label: "🤝 사람지킴이",
    description: "사람의 안전과 권리를 중요하게 생각하는 타입",
    pillClass: "bg-orange-100 text-orange-700",
  },
};

export default function TeacherPage() {
  const { loading, error, stats } = useTeacherDashboardData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-eco-light">
        <div className="bg-white shadow-xl rounded-3xl px-10 py-8 text-center space-y-2">
          <div className="text-2xl">📡</div>
          <p className="font-semibold">구글 시트에서 데이터를 불러오는 중이에요…</p>
          <p className="text-xs text-gray-400">
            잠시 후에 선생님 대시보드가 자동으로 채워집니다.
          </p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white shadow-xl rounded-3xl px-10 py-8 text-center text-red-600 space-y-2">
          <div className="text-2xl">⚠️</div>
          <p className="font-semibold">대시보드 데이터를 불러오는 중 오류가 발생했어요.</p>
          <p className="text-xs text-gray-500">
            구글 시트 공개 설정과 CSV 주소를 한 번만 다시 확인해 주세요.
          </p>
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

  // AI 유형은 많은 것부터 순서대로 보여주기
  const sortedAiTypes = [...aiTypeStats].sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-eco-light">
      {/* 상단 헤더 */}
      <header className="bg-white/90 border-b shadow-sm backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold flex items-center gap-2">
              <span>🧑‍🏫 지구를 지키는 AI 용사들</span>
              <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 text-xs px-3 py-1">
                선생님용 대시보드
              </span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              학생들이 구글 폼으로 제출한 결과를 실시간으로 정리해 보여주는 화면입니다.
            </p>
          </div>
        </div>
      </header>

      {/* 본문 */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* 요약 카드 */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
              🧾 수업 현황 한눈에 보기
            </h2>
            <span className="text-[11px] text-gray-400">
              * 전체 {totalStudents}명 기준으로 자동 계산됩니다.
            </span>
          </div>

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
              highlight
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
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
              📚 차시별 완료 현황
            </h2>
            <span className="text-[11px] text-gray-400">
              각 차시별로 몇 명의 학생이 활동을 완료했는지 보여줍니다.
            </span>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-4 md:p-6 space-y-4">
            {missionStats.length === 0 && (
              <div className="text-gray-400 text-sm">
                아직 제출된 데이터가 없습니다. 학생들이 활동을 제출하면 이곳에
                차시별로 자동 집계됩니다.
              </div>
            )}

            {missionStats.map((m) => {
              const meta = MISSION_META[m.missionId] ?? {
                label: `🧪 ${m.missionId || "테스트 미션"}`,
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
        <section className="space-y-3 pb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
              ⚖️ AI 윤리 유형 분포
            </h2>
            <span className="text-[11px] text-gray-400">
              학생들이 어떤 가치(사람 / 환경 / 균형)를 더 중요하게 생각하는지
              한눈에 볼 수 있어요.
            </span>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-4 md:p-6 space-y-4">
            {sortedAiTypes.length === 0 && (
              <div className="text-gray-400 text-sm">
                아직 AI 윤리 유형 결과가 없습니다. 4차시 활동을 진행한 후
                다시 확인해 주세요.
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {sortedAiTypes.map((t) => {
                const meta = TYPE_META[t.type] ?? {
                  label: `🔍 ${t.type || "기타"}`,
                  description: "",
                  pillClass: "bg-gray-100 text-gray-700",
                };
                return (
                  <div
                    key={t.type}
                    className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-gray-50 border text-xs md:text-sm"
                  >
                    <span
                      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-medium ${meta.pillClass}`}
                    >
                      {meta.label}
                    </span>
                    <span className="text-gray-600">
                      {t.count}명
                      {meta.description && (
                        <span className="hidden md:inline text-gray-400 ml-1">
                          · {meta.description}
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ----------------- 작은 컴포넌트들 ----------------- */

function StatCard({ title, icon, main, sub, highlight = false }) {
  return (
    <div
      className={`rounded-3xl px-6 py-5 flex flex-col gap-1 border bg-white ${
        highlight ? "shadow-lg border-emerald-100" : "shadow-sm border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{title}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <div
        className={`text-2xl font-extrabold ${
          highlight ? "text-emerald-600" : "text-gray-800"
        }`}
      >
        {main}
      </div>
      {sub && <div className="text-[11px] text-gray-400">{sub}</div>}
    </div>
  );
}

function ProgressRow({ label, barColor, count, total }) {
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs md:text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">
          {count}명 / {total}명 · {percent}%
        </span>
      </div>
      <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
