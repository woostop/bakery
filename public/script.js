// 기타 수업 입력란 토글
function toggleCustomClass() {
    const classSelect = document.getElementById('class');
    const customClassGroup = document.getElementById('customClassGroup');
    
    if (classSelect.value === '기타') {
        customClassGroup.style.display = 'block';
        document.getElementById('customClass').required = true;
    } else {
        customClassGroup.style.display = 'none';
        document.getElementById('customClass').required = false;
    }
}

// 예약 데이터를 Supabase 연동 Vercel API로 전송
function submitReservation(formData) {
  fetch('http://localhost:5000/reserve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  .then(res => res.json())
  .then(data => {
    if (data.result === 'success') {
      alert('예약 신청이 완료되었습니다!');
    } else {
      alert('예약 전송에 실패했습니다.');
    }
  })
  .catch(() => {
    alert('예약 전송에 실패했습니다.');
  });
}

// 폼 제출 처리
document.addEventListener('DOMContentLoaded', function() {
    const reservationForm = document.getElementById('reservationForm');
    
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 개인정보 동의 확인
            const privacyCheckbox = document.getElementById('privacy');
            if (!privacyCheckbox.checked) {
                alert('개인정보 수집 및 이용에 동의해주세요.');
                return;
            }
            
            // 폼 데이터 수집
            const classValue = document.getElementById('class').value;
            const customClassValue = document.getElementById('customClass').value;
            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                date: document.getElementById('date').value,
                people: document.getElementById('people').value,
                class: classValue === '기타' ? customClassValue : classValue,
                message: document.getElementById('message').value
            };

            // 예약 데이터 전송
            submitReservation(formData);
            
            // 폼 초기화
            this.reset();
            toggleCustomClass(); // 기타 수업 입력란 숨기기
        });
    }
    
    // admin.html이 아닌 경우에만 슬라이더 초기화
    if (!window.location.pathname.includes('admin')) {
        // 슬라이더 요소가 있을 때만 실행
        if (document.getElementById('dots-store1')) initSlider('store1');
        if (document.getElementById('dots-store2')) initSlider('store2');
        if (document.getElementById('dots-store3')) initSlider('store3');
    }

    // 모바일 스크롤 시 상단바 숨김/표시
    let lastScrollY = window.scrollY;
    const navbar = document.getElementById('navbar');
    if (navbar) {
      window.addEventListener('scroll', function() {
          if (window.innerWidth > 768) return;
          if (window.scrollY > lastScrollY && window.scrollY > 40) {
              navbar.classList.add('hide');
          } else {
              navbar.classList.remove('hide');
          }
          lastScrollY = window.scrollY;
      });
    }
});

// 여러 슬라이더 상태 관리
const sliderState = {
    store1: 0,
    store2: 0,
    store3: 0
};

const sliderInfo = {
    store1: {
        slides: document.querySelectorAll('#slider-store1 .slide'),
        dotsContainer: document.getElementById('dots-store1'),
        interval: null
    },
    store2: {
        slides: document.querySelectorAll('#slider-store2 .slide'),
        dotsContainer: document.getElementById('dots-store2'),
        interval: null
    },
    store3: {
        slides: document.querySelectorAll('#slider-store3 .slide'),
        dotsContainer: document.getElementById('dots-store3'),
        interval: null
    }
};

function initSlider(sliderId) {
    const info = sliderInfo[sliderId];
    if (!info.dotsContainer) return; // 요소 없으면 실행 안 함
    // 도트 생성
    info.dotsContainer.innerHTML = '';
    info.slides.forEach((_, idx) => {
        const dot = document.createElement('span');
        dot.className = 'dot' + (idx === 0 ? ' active' : '');
        dot.onclick = () => goToSlide(sliderId, idx);
        info.dotsContainer.appendChild(dot);
    });
    updateSlider(sliderId);
    // 자동 슬라이드
    if (info.interval) clearInterval(info.interval);
    info.interval = setInterval(() => nextSlide(sliderId), 5000);
}

function updateSlider(sliderId) {
    const info = sliderInfo[sliderId];
    const current = sliderState[sliderId];
    const slider = document.querySelector(`#slider-${sliderId} .slider`);
    slider.style.transform = `translateX(-${current * 100}%)`;
    // 도트 업데이트
    Array.from(info.dotsContainer.children).forEach((dot, idx) => {
        dot.classList.toggle('active', idx === current);
    });
}

function nextSlide(sliderId) {
    const info = sliderInfo[sliderId];
    sliderState[sliderId] = (sliderState[sliderId] + 1) % info.slides.length;
    updateSlider(sliderId);
}

function prevSlide(sliderId) {
    const info = sliderInfo[sliderId];
    sliderState[sliderId] = (sliderState[sliderId] - 1 + info.slides.length) % info.slides.length;
    updateSlider(sliderId);
}

function goToSlide(sliderId, idx) {
    sliderState[sliderId] = idx;
    updateSlider(sliderId);
}

// 관리자 로그인 모달 표시
function showAdminLogin() {
    document.getElementById('adminModal').style.display = 'block';
    document.getElementById('adminPassword').focus();
}

// 관리자 모달 닫기
function closeAdminModal() {
    document.getElementById('adminModal').style.display = 'none';
    document.getElementById('adminPassword').value = '';
}

// 관리자 로그인 처리
function adminLogin(event) {
    event.preventDefault();
    
    const password = document.getElementById('adminPassword').value;
    const correctPassword = 'clf5612';
    
    if (password === correctPassword) {
        // 로그인 성공
        closeAdminModal();
        window.open('admin.html', '_blank');
    } else {
        // 로그인 실패
        alert('비밀번호가 올바르지 않습니다.');
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminPassword').focus();
    }
}

// 모달 외부 클릭 시 닫기
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('adminModal');
    
    window.onclick = function(event) {
        if (event.target === modal) {
            closeAdminModal();
        }
    }
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeAdminModal();
        }
    });
});

function editReservation(id) {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const reservation = reservations.find(r => r.id === id);
    if (!reservation) return alert('예약 정보를 찾을 수 없습니다.');

    // 간단한 prompt로 수정 (실제 서비스에서는 모달 폼 권장)
    const newDate = prompt('희망 날짜를 수정하세요:', reservation.date);
    if (newDate === null) return; // 취소
    const newPeople = prompt('인원을 수정하세요:', reservation.people);
    if (newPeople === null) return;
    const newClass = prompt('수업 종류를 수정하세요:', reservation.class);
    if (newClass === null) return;
    const newMessage = prompt('문의내용을 수정하세요:', reservation.message || '');
    if (newMessage === null) return;

    reservation.date = newDate;
    reservation.people = newPeople;
    reservation.class = newClass;
    reservation.message = newMessage;

    localStorage.setItem('reservations', JSON.stringify(reservations));
    loadReservations();
    alert('예약 정보가 수정되었습니다.');
}

window.editReservation = editReservation;

// 예약 목록 관련 함수 (관리자 페이지용)
function loadReservations() {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const reservationList = document.getElementById('reservationList');
    const stats = document.getElementById('stats');
    
    // 통계 정보 업데이트
    if (typeof updateStats === 'function') {
        updateStats(reservations);
    } else if (stats) {
        // updateStats가 없으면 간단히 표시
        stats.innerHTML = `<div class="stat-card"><div class="stat-number">${reservations.length}</div><div class="stat-label">총 예약 수</div></div>`;
    }
    
    if (!reservationList) return;
    if (reservations.length === 0) {
        reservationList.innerHTML = '<div class="no-reservations">아직 예약이 없습니다.</div>';
        return;
    }
    reservationList.innerHTML = reservations
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .map(reservation => createReservationHTML(reservation))
        .join('');
}

function updateStats(reservations) {
    const stats = document.getElementById('stats');
    const totalReservations = reservations.length;
    const todayReservations = reservations.filter(r => {
        const today = new Date().toDateString();
        const reservationDate = new Date(r.timestamp).toDateString();
        return today === reservationDate;
    }).length;
    if (!stats) return;
    stats.innerHTML = `
        <div class="stat-card">
            <div class="stat-number">${totalReservations}</div>
            <div class="stat-label">총 예약 수</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${todayReservations}</div>
            <div class="stat-label">오늘 예약 수</div>
        </div>
    `;
}

function createReservationHTML(reservation) {
    const date = new Date(reservation.timestamp);
    const formattedDate = date.toLocaleString('ko-KR');
    const classType = reservation.class === '기타' ? reservation.customClass : reservation.class;
    return `
        <div class="reservation-item">
            <div class="reservation-header">
                <div class="reservation-name">${reservation.name}</div>
                <div class="reservation-date">${formattedDate}</div>
            </div>
            <div class="reservation-details">
                <div class="detail-item">
                    <div class="detail-label">전화번호</div>
                    <div class="detail-value">${reservation.phone}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">이메일</div>
                    <div class="detail-value">${reservation.email || '제공안함'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">희망 날짜</div>
                    <div class="detail-value">${reservation.date}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">인원</div>
                    <div class="detail-value">${reservation.people}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">수업 종류</div>
                    <div class="detail-value">${classType}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">문의내용</div>
                    <div class="detail-value">${reservation.message || '없음'}</div>
                </div>
            </div>
            <div class="reservation-actions">
                <button class="btn btn-edit" onclick="editReservation(${reservation.id})">
                    수정하기
                </button>
                <button class="btn btn-delete" onclick="deleteReservation(${reservation.id})">
                    삭제
                </button>
            </div>
        </div>
    `;
}

function deleteReservation(id) {
    if (confirm('이 예약을 삭제하시겠습니까?')) {
        const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
        const updatedReservations = reservations.filter(r => r.id !== id);
        localStorage.setItem('reservations', JSON.stringify(updatedReservations));
        loadReservations();
    }
}

// 페이지 로드 시 예약 데이터 표시 (관리자 페이지에서만)
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('reservationList')) {
        loadReservations();
        setInterval(loadReservations, 30000);
    }
}); 

// 관리자(admin.html)에서 예약 내역 조회 함수
function loadReservations() {
  const table = document.getElementById('reservationTable').getElementsByTagName('tbody')[0];
  fetch('http://localhost:5000/reservations')
    .then(res => res.json())
    .then(data => {
      table.innerHTML = '';
      if (data && data.length > 0) {
        data.forEach(row => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${row.name || ''}</td>
            <td>${row.phone || ''}</td>
            <td>${row.email || ''}</td>
            <td>${row.date ? new Date(row.date).toLocaleDateString('ko-KR') : ''}</td>
            <td>${row.people || ''}</td>
            <td>${row.class || ''}</td>
            <td>${row.message || ''}</td>
            <td>${row.createdAt ? new Date(row.createdAt).toLocaleString('ko-KR') : ''}</td>
            <td><button class="btn btn-edit" style="background:linear-gradient(135deg,#a18cd1 0%,#fbc2eb 100%);color:white;" onclick="openEditModal('${row.id}')">수정</button></td>
            <td><button class="btn btn-delete" onclick="deleteReservation('${row.id}')">삭제</button></td>
          `;
          table.appendChild(tr);
        });
      } else {
        table.innerHTML = '<tr><td colspan="10">예약 내역이 없습니다.</td></tr>';
      }
    })
    .catch(() => {
      table.innerHTML = '<tr><td colspan="10">예약 내역을 불러오지 못했습니다.</td></tr>';
    });
}
window.loadReservations = loadReservations;

document.addEventListener('DOMContentLoaded', loadReservations);

// 수정 모달 열기/닫기 및 데이터 채우기
window.openEditModal = function(id) {
  fetch('http://localhost:5000/reservations')
    .then(res => res.json())
    .then(data => {
      const row = data.find(r => r.id === id);
      if (!row) return alert('예약 정보를 찾을 수 없습니다.');
      document.getElementById('editId').value = row.id;
      document.getElementById('editName').value = row.name || '';
      document.getElementById('editPhone').value = row.phone || '';
      document.getElementById('editEmail').value = row.email || '';
      document.getElementById('editDate').value = row.date || '';
      document.getElementById('editPeople').value = row.people || '';
      document.getElementById('editClass').value = row.class || '';
      document.getElementById('editMessage').value = row.message || '';
      document.getElementById('editModal').style.display = 'flex';
    });
}
window.closeEditModal = function() {
  document.getElementById('editModal').style.display = 'none';
}

// 예약 테이블 렌더링 및 수정/삭제 기능 (admin.html에서만)
if (document.getElementById('reservationTable')) {
  window.loadReservations = loadReservations;
  document.addEventListener('DOMContentLoaded', loadReservations);
}

// 수정 모달 onsubmit (admin.html에서만)
if (document.getElementById('editForm')) {
  document.getElementById('editForm').onsubmit = function(e) {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const data = {
      name: document.getElementById('editName').value,
      phone: document.getElementById('editPhone').value,
      email: document.getElementById('editEmail').value,
      date: document.getElementById('editDate').value,
      people: document.getElementById('editPeople').value,
      class: document.getElementById('editClass').value,
      message: document.getElementById('editMessage').value
    };
    fetch(`http://localhost:5000/reserve/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(res => {
        if (res.result === 'success') {
          alert('예약 정보가 수정되었습니다.');
          closeEditModal();
          loadReservations();
        } else {
          alert('수정에 실패했습니다.');
        }
      });
  };
}

// 삭제 기능
function deleteReservation(id) {
  if (!confirm('이 예약을 삭제하시겠습니까?')) return;
  fetch(`http://localhost:5000/reserve/${id}`, {
    method: 'DELETE'
  })
  .then(res => res.json())
  .then(res => {
    if (res.result === 'success') {
      alert('예약이 삭제되었습니다.');
      loadReservations();
    } else {
      alert('삭제에 실패했습니다.');
    }
  });
}; 