// src/utils/googleForm.js

// 1) 폼 제출 URL
const GOOGLE_FORM_ACTION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScyoX2Y0oLjkouCDuxv9ecqfp0c0rb0h3aIvRZt3HKsmXp6eQ/formResponse";

// 2) entry 매핑 (선생님이 찾은 순서 그대로)
const ENTRY = {
  name: "entry.458059330",      // 이름
  number: "entry.1477867723",   // 번호
  mission: "entry.860711716",   // 미션
  score: "entry.18658829",      // 점수
  result: "entry.806133920",    // 결과
};

// 3) 제출 함수
export async function submitToGoogleForm({
  name,
  number,
  mission,
  score,
  result,
}) {
  const formData = new FormData();

  formData.append(ENTRY.name, name);
  formData.append(ENTRY.number, number);
  formData.append(ENTRY.mission, mission);
  formData.append(ENTRY.score, String(score));
  formData.append(ENTRY.result, result);

  try {
    await fetch(GOOGLE_FORM_ACTION_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    });

    console.log("📌 구글 폼 제출 시도:", { name, number, mission, score, result });
  } catch (err) {
    console.error("❌ 구글 폼 제출 실패:", err);
  }
}

