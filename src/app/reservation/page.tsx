"use client";
import { useState } from "react";

export default function ReservationPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    people: "",
    class: "",
    customClass: "",
    message: "",
    privacy: false,
  });
  const [showCustomClass, setShowCustomClass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;
    if (type === "checkbox") {
      fieldValue = (e.target as HTMLInputElement).checked;
    }
    setForm((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
    if (name === "class") {
      setShowCustomClass(value === "기타");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.privacy) {
      setResult("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }
    setLoading(true);
    setResult(null);
    const payload = {
      ...form,
      class: form.class === "기타" ? form.customClass : form.class,
    };
    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.result === "success") {
        setResult("예약 신청이 완료되었습니다!");
        setForm({
          name: "",
          phone: "",
          email: "",
          date: "",
          people: "",
          class: "",
          customClass: "",
          message: "",
          privacy: false,
        });
        setShowCustomClass(false);
      } else {
        setResult("예약 전송에 실패했습니다.");
      }
    } catch {
      setResult("예약 전송에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="reservation" className="reservation">
      <div className="container">
        <h2 className="section-title">수업 예약</h2>
        <div className="reservation-container">
          <div className="reservation-info">
            <h3>예약 안내</h3>
            <div className="info-item">
              <h4>📍 위치</h4>
              <p><a href="https://naver.me/5noi3nVL" target="_blank" rel="noopener noreferrer">전남 여수시 신기동 108-3 2층 알록달록테이블</a></p>
            </div>
            <div className="info-item">
              <h4>⏰ 운영시간</h4>
              <p>100% 예약제 운영</p>
              <p>매일 10:00 - 22:00</p>
            </div>
            <div className="info-item">
              <h4>📞 연락처</h4>
              <p>전화: 010-7574-5612</p>
              <p>카카오톡 ID: Colorfultabe</p>
              <p>인스타그램: @colorful_table</p>
            </div>
          </div>
          <div className="reservation-form-container">
            <form id="reservationForm" className="reservation-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">예약자 성명 <span className="required">*</span></label>
                  <input type="text" id="name" name="name" required value={form.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">전화번호 <span className="required">*</span></label>
                  <input type="tel" id="phone" name="phone" placeholder="010-0000-0000" required value={form.phone} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="email">이메일 (선택)</label>
                <input type="email" id="email" name="email" placeholder="example@email.com" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">희망 날짜 <span className="required">*</span></label>
                  <input type="date" id="date" name="date" required value={form.date} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="people">인원</label>
                  <input type="text" id="people" name="people" placeholder="예: 2명" required value={form.people} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="class">수업 종류 <span className="required">*</span></label>
                <select id="class" name="class" required value={form.class} onChange={handleChange}>
                  <option value="">수업을 선택해주세요</option>
                  <option value="딸기모찌 컵케이크">딸기모찌 컵케이크</option>
                  <option value="까눌레">까눌레</option>
                  <option value="스콘">스콘</option>
                  <option value="마카롱">마카롱</option>
                  <option value="휘낭시에">휘낭시에</option>
                  <option value="케이크">케이크</option>
                  <option value="기타">기타 (직접 입력)</option>
                </select>
              </div>
              {showCustomClass && (
                <div className="form-group" id="customClassGroup">
                  <label htmlFor="customClass">기타 수업 내용</label>
                  <input type="text" id="customClass" name="customClass" placeholder="원하시는 수업을 입력해주세요" value={form.customClass} onChange={handleChange} />
                </div>
              )}
              <div className="form-group">
                <label htmlFor="message">문의내용</label>
                <textarea id="message" name="message" rows={4} placeholder="추가 요청사항이나 문의사항을 적어주세요" value={form.message} onChange={handleChange}></textarea>
              </div>
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input type="checkbox" id="privacy" name="privacy" checked={form.privacy} onChange={handleChange} required />
                  <span className="checkmark"></span>
                  개인정보 수집 및 이용에 동의합니다 <span className="required">*</span>
                </label>
                <div className="privacy-details">
                  <p><strong>수집 항목:</strong> 성명, 전화번호, 이메일(선택), 수업 관련 정보</p>
                  <p><strong>수집 목적:</strong> 수업 예약 및 상담, 서비스 제공</p>
                  <p><strong>보유 기간:</strong> 서비스 제공 완료 후 1년</p>
                </div>
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>{loading ? "예약 중..." : "예약 신청하기"}</button>
              {result && <div style={{ marginTop: 16, color: result.includes("완료") ? "#28a745" : "#dc3545" }}>{result}</div>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
} 