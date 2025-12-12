// src/hooks/useTeacherDashboardData.js
import { useEffect, useState } from "react";

// ✅ 구글 시트 "CSV" 주소 (HTML 말고!)
// 이 주소 그대로 쓰세요.
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1haRcmsXtyZucVhO8ypSuRR3E5UkPCkm8aYQc0LzW1sw/export?format=csv&gid=0";

// 학급 학생 수 / 총 미션 수 (상황에 맞게 수정 가능)
const TOTAL_STUDENTS = 25; // 예: 25명
const TOTAL_MISSIONS = 3;  // 예: 1차시, 2차시, 4차시 → 3개

// 아주 단순한 CSV 파서 (쉼표 안에 , 가 안 들어간다는 가정)
function parseCsv(text) {
  const lines = text.trim().split("\n");
  const rows = lines.map((line) =>
    line
      .split(",")
      .map((cell) => cell.replace(/^"|"$/g, "").trim())
  );
  return rows;
}

export function useTeacherDashboardData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // 👇 캐시 방지용 파라미터 추가 (옵션)
        const url = `${SHEET_CSV_URL}&t=${Date.now()}`;

        const res = await fetch(url);
        const csvText = await res.text();
        const rows = parseCsv(csvText);

        if (!rows || rows.length < 2) {
          setStats(makeEmptyStats());
          setLoading(false);
          return;
        }

        // 첫 줄은 헤더, 나머지는 데이터
        const [header, ...dataRows] = rows;

        // 시트 구조(가정):
        // 0: Timestamp
        // 1: 이름
        // 2: 번호(학생 ID)
        // 3: 미션 (예: 1차시 / 2차시 / 4차시)
        // 4: 점수
        // 5: 결과(유형: 균형잡이/환경지킴이/사람지킴이 등)
        
const records = dataRows
  .filter((cols) => {
    if (!cols || cols.length < 6) return false;

    const name = cols[1]?.trim();
    const studentId = cols[2]?.trim();
    const missionId = cols[3]?.trim();
    const resultType = cols[5]?.trim();

    // 1) 이름/번호/미션이 비어 있으면 버림
    if (!name || !studentId || !missionId) return false;

    // 2) 너무 길거나 코드처럼 보이는 미션/결과는 버림
    const badPieces = ["<", ">", "http", "function", "{", "}", "=", ";"];
    if (missionId.length > 40) return false;
    if (badPieces.some((ch) => missionId.includes(ch))) return false;
    if (resultType && badPieces.some((ch) => resultType.includes(ch)))
      return false;

    // ✅ 여기까지 통과하면 “사람이 입력한 정상 응답”이라고 보고 사용
    return true;
  })
  .map((cols) => ({
    timestamp: cols[0],
    name: cols[1],
    studentId: cols[2],
    missionId: cols[3],      // "테스트미션" / "1차시" / "AI윤리" 등 뭐든 OK
    score: Number(cols[4]) || 0,
    resultType: cols[5],
    extra: cols.slice(6),
  }));

        const computed = computeStats(records);
        setStats(computed);
      } catch (err) {
        console.error(err);
        setError(err);
        setStats(makeEmptyStats());
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { loading, error, stats };
}

function makeEmptyStats() {
  return {
    totalStudents: TOTAL_STUDENTS,
    completedStudents: 0,
    completionRate: 0,
    averageProgress: 0,
    missionStats: [],
    aiTypeStats: [],
  };
}

/**
 * 통계 계산:
 * - 같은 학생ID + 미션ID 는 "마지막 제출"만 사용 (중복 제출 방지)
 * - 전체 학생 수 / 완료율 / 평균 진행률
 * - 미션별 완료 수
 * - AI 유형 분포
 */
function computeStats(records) {
  if (!records || records.length === 0) {
    return makeEmptyStats();
  }

  // 학생ID + 미션ID 기준으로 마지막 제출만 남기기
  const dedupMap = new Map(); // key: `${studentId}|${missionId}`

  records.forEach((r) => {
    const key = `${r.studentId}|${r.missionId}`;
    dedupMap.set(key, r); // 나중에 온 게 덮어써짐 → "마지막 제출"만 남음
  });

  const uniqueRecords = Array.from(dedupMap.values());

  const missionsByStudent = new Map(); // studentId -> Set(missionId)
  const missionCounts = new Map();     // missionId -> 인원 수
  const aiTypeCounts = new Map();      // resultType -> 인원 수

  uniqueRecords.forEach((r) => {
    // 학생별 완료 미션 세기
    if (!missionsByStudent.has(r.studentId)) {
      missionsByStudent.set(r.studentId, new Set());
    }
    missionsByStudent.get(r.studentId).add(r.missionId);

    // 미션별 완료 인원
    missionCounts.set(r.missionId, (missionCounts.get(r.missionId) || 0) + 1);

    // AI 유형 분포
    if (r.resultType) {
      aiTypeCounts.set(r.resultType, (aiTypeCounts.get(r.resultType) || 0) + 1);
    }
  });

  const completedStudents = missionsByStudent.size;
  const completionRate =
    TOTAL_STUDENTS > 0
      ? Math.round((completedStudents / TOTAL_STUDENTS) * 100)
      : 0;

  // 평균 진행률 = (학생별 완료 미션 비율의 평균) × 100
  let progressSum = 0;
  missionsByStudent.forEach((missionSet) => {
    const ratio = missionSet.size / TOTAL_MISSIONS;
    progressSum += ratio;
  });
  const averageProgress =
    missionsByStudent.size > 0
      ? Math.round((progressSum / missionsByStudent.size) * 100)
      : 0;

  const missionStats = Array.from(missionCounts.entries()).map(
    ([missionId, count]) => ({
      missionId,
      count,
    })
  );

  const aiTypeStats = Array.from(aiTypeCounts.entries()).map(
    ([type, count]) => ({
      type,
      count,
    })
  );

  return {
    totalStudents: TOTAL_STUDENTS,
    completedStudents,
    completionRate,
    averageProgress,
    missionStats,
    aiTypeStats,
  };
}
