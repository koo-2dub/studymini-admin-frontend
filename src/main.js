const $ = (s) => document.querySelector(s);
const money = (n) => `${Number(n).toLocaleString('ko-KR')}원`;
const num = (n) => Number(n).toLocaleString('ko-KR');
const state = { path: location.pathname, modal: '', confirm: null, toast: [], filters: {}, memberTab: 'Profile', loading: false };

const members = [
  { id: 'U-10231', name: '김하나', email: 'hana.kim@example.com', phone: '010-1111-2451', grade: 'VIP', joined: '2025-10-03', manager: '민지', status: '활성', points: 24800, slack: true },
  { id: 'U-10232', name: '이준호', email: 'junho.lee@example.com', phone: '010-2393-9401', grade: '일반', joined: '2026-01-12', manager: '도윤', status: '활성', points: 8800, slack: false },
  { id: 'U-10233', name: '박서연', email: 'seoyeon.park@example.com', phone: '010-9921-3132', grade: '휴면위험', joined: '2024-08-22', manager: '민지', status: '보류', points: 1200, slack: true },
];
const orders = [
  { id: 'ORD-20260529-001', userId: 'U-10231', name: '김하나', email: 'hana.kim@example.com', phone: '010-1111-2451', product: '영어 풀패키지', sku: 'ENG-FULL-12M', qty: 1, orderStatus: '배송준비', paymentStatus: '결제완료', method: '신용카드', installment: '3개월', created: '2026-05-29', paid: '2026-05-29', amount: 428000, coupon: 30000, points: 10000, shipping: 0, final: 388000, expectedPoints: 3880, address: '서울시 마포구 월드컵북로 12', manager: '민지' },
  { id: 'ORD-20260528-009', userId: 'U-10232', name: '이준호', email: 'junho.lee@example.com', phone: '010-2393-9401', product: '스페인어 베이직', sku: 'ESP-BASIC-6M', qty: 1, orderStatus: '완료', paymentStatus: '부분환불', method: '카카오페이', installment: '일시불', created: '2026-05-28', paid: '2026-05-28', amount: 218000, coupon: 0, points: 5000, shipping: 3000, final: 216000, expectedPoints: 2160, address: '부산시 해운대구 센텀중앙로 97', manager: '도윤' },
  { id: 'ORD-20260523-017', userId: 'U-10233', name: '박서연', email: 'seoyeon.park@example.com', phone: '010-9921-3132', product: '일본어 챌린지', sku: 'JPN-CHAL-3M', qty: 2, orderStatus: '환불요청', paymentStatus: '결제완료', method: '가상계좌', installment: '일시불', created: '2026-05-23', paid: '2026-05-24', amount: 176000, coupon: 12000, points: 0, shipping: 0, final: 164000, expectedPoints: 1640, address: '대구시 수성구 달구벌대로 2400', manager: '민지' },
];
const inquiries = [
  { id: 'Q-901', type: 'general', title: '배송지 변경 요청드립니다', preview: '결제 후 배송지를 회사 주소로 변경하고 싶습니다.', name: '김하나', email: 'hana.kim@example.com', status: '신규', manager: '민지', slack: true, date: '2026-05-29', answered: false },
  { id: 'Q-902', type: 'lesson', title: '스페인어 발음 피드백 문의', preview: 'r 발음에서 혀 위치가 맞는지 확인 부탁드립니다.', name: '이준호', email: 'junho.lee@example.com', status: '처리중', manager: '도윤', slack: false, date: '2026-05-28', answered: false },
  { id: 'Q-903', type: 'general', title: '쿠폰 중복 적용 가능 여부', preview: '신규 쿠폰과 생일 쿠폰을 같이 사용할 수 있나요?', name: '박서연', email: 'seoyeon.park@example.com', status: '완료', manager: '민지', slack: true, date: '2026-05-20', answered: true },
  { id: 'Q-904', type: 'lesson', title: '일본어 작문 첨삭 요청', preview: '오늘 학습 미션 문장에 자연스러운 표현이 궁금합니다.', name: '김하나', email: 'hana.kim@example.com', status: '보류', manager: '서준', slack: true, date: '2026-05-21', answered: false },
];
const coupons = [
  { id: 'CP-NEW-20', name: '신규회원 20%', status: '사용중', condition: '첫 구매 10만원 이상', limit: '1인 1회 / 총 2,000회', products: '전체 강의', emails: '전체 허용', used: 842, discount: 12400000 },
  { id: 'CP-VIP-30', name: 'VIP 감사 쿠폰', status: '예약', condition: 'VIP 등급', limit: '1인 2회', products: '풀패키지', emails: 'vip-list.csv', used: 128, discount: 9200000 },
];
const vouchers = [
  { campaign: 'B2B 기업교육 5월', code: 'SMIN-2026-5A7K-91QZ', used: true, place: '영어 풀패키지', issuer: '민지', issued: 300, remaining: 114 },
  { campaign: '오프라인 이벤트', code: 'SMIN-2026-Q2BR-44PX', used: false, place: '-', issuer: '도윤', issued: 120, remaining: 87 },
];
const pointLogs = [
  { id: 'P-7741', user: '김하나', type: '적립', amount: 3880, wallet: '기본', expires: '2027-05-29', reason: '주문 적립' },
  { id: 'P-7742', user: '이준호', type: '사용', amount: -5000, wallet: '기간제한', expires: '2026-06-30', reason: '주문 사용' },
  { id: 'P-7743', user: '박서연', type: '관리자 조정', amount: 2000, wallet: 'CS 보상', expires: '2026-12-31', reason: '학습 오류 보상' },
];
const dailySales = [
  { date: '05-23', sales: 164000, compare: 138000, orders: 5 }, { date: '05-24', sales: 221000, compare: 160000, orders: 7 },
  { date: '05-25', sales: 188000, compare: 172000, orders: 6 }, { date: '05-26', sales: 392000, compare: 260000, orders: 11 },
  { date: '05-27', sales: 480000, compare: 311000, orders: 14 }, { date: '05-28', sales: 216000, compare: 204000, orders: 8 },
  { date: '05-29', sales: 388000, compare: 290000, orders: 12 },
];

function navigate(path) { history.pushState({}, '', path); state.path = path; render(); scrollTo({ top: 0, behavior: 'smooth' }); }
function notify(message) { state.toast.push({ id: Date.now(), message }); renderToasts(); setTimeout(() => { state.toast.shift(); renderToasts(); }, 2600); }
function openModal(title) { state.modal = title; render(); }
function confirmAction(title, message, action) { state.confirm = { title, message, action }; render(); }
function pill(text) { return `<span class="pill">${text}</span>`; }
function metric(title, value, sub = '') { return `<div class="card metric"><span>${title}</span><strong>${value}</strong>${sub ? `<small>${sub}</small>` : ''}</div>`; }
function table(columns, rows, empty = '조건에 맞는 데이터가 없습니다.') {
  if (!rows.length) return `<div class="empty"><b>데이터가 없습니다</b><span>${empty}</span></div>`;
  return `<div class="table-scroll"><table><thead><tr>${columns.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function toolbar(key, extra = '') { return `<div class="toolbar"><input data-filter="${key}.search" aria-label="검색" placeholder="이름, 이메일, 제목, 내용 검색" value="${state.filters[`${key}.search`] || ''}">${extra}<button data-action="apply-filter">필터 적용</button></div>`; }
function select(key, values) { return `<select data-filter="${key}">${values.map((v) => `<option ${state.filters[key] === v ? 'selected' : ''}>${v}</option>`).join('')}</select>`; }
function pager() { return `<div class="pager"><button data-toast="이전 페이지로 이동했습니다.">이전</button><span>1 / 3</span><button data-toast="다음 페이지로 이동했습니다.">다음</button></div>`; }

function shell(content) {
  const nav = [['/orders','주문/결제'], ['/analytics','매출 분석'], ['/members/U-10231','회원 상세'], ['/inquiries','문의 관리'], ['/coupons','쿠폰 관리'], ['/vouchers','바우처 관리'], ['/points','포인트 관리']];
  return `<div class="app-shell"><aside class="sidebar"><div class="brand">Studymini Admin<span>SaaS 운영 콘솔</span></div><nav>${nav.map(([href, label]) => `<button class="${state.path === href || state.path.startsWith(`${href}/`) ? 'active' : ''}" data-nav="${href}">${label}</button>`).join('')}</nav></aside><main class="main"><header class="topbar"><div><b>운영 대시보드</b><span>오늘 2026-05-29 기준 mock data 운영 환경</span></div><button data-modal="빠른 작업">+ 빠른 작업</button></header>${content}</main></div><div class="toast-stack"></div>${modalHtml()}`;
}
function modalHtml() {
  if (state.confirm) return `<div class="modal-backdrop"><div class="modal"><h2>${state.confirm.title}</h2><p>${state.confirm.message}</p><div class="button-group"><button data-close>취소</button><button class="danger" data-confirm>확인</button></div></div></div>`;
  if (!state.modal) return '';
  return `<div class="modal-backdrop"><div class="modal"><h2>${state.modal}</h2><p>실제 운영 흐름을 위한 mock 입력 모달입니다.</p><textarea placeholder="관리자 메모 또는 처리 내용을 입력하세요."></textarea><div class="button-group"><button data-close>닫기</button><button data-save-modal>저장</button></div></div></div>`;
}

function memberPage() {
  const member = members[0];
  const tabs = ['Profile', 'Orders', 'Courses', 'Groups', 'Points', 'Coupons', 'General inquiries', 'Lesson questions'];
  return `<section class="page"><div class="page-title"><div><h1>${member.name} 회원 상세</h1><p>${member.email} · ${member.id}</p></div><button data-modal="회원 메모 작성">관리자 메모</button></div><div class="tabs">${tabs.map((t) => `<button class="${state.memberTab === t ? 'active' : ''}" data-tab="${t}">${t}</button>`).join('')}</div>${memberTab(member)}<div class="grid quick-cards"><button class="card link-card" data-tab="Orders">주문 이력 보기<span>최근 주문과 결제 상태 확인</span></button><button class="card link-card" data-tab="General inquiries">일반 문의 보기<span>CS 답변과 Slack 수신 상태 확인</span></button><button class="card link-card" data-tab="Lesson questions">학습 질문 보기<span>튜터 답변 진행 현황 확인</span></button></div></section>`;
}
function memberTab(member) {
  const tab = state.memberTab;
  if (tab === 'Profile') return `<div class="grid cards">${metric('등급', member.grade)}${metric('보유 포인트', num(member.points))}${metric('가입일', member.joined)}${metric('Slack 수신', member.slack ? '수신' : '미수신')}</div>`;
  if (tab === 'Orders') return table(['주문번호','상품','상태','결제','최종금액','상세'], orders.filter((o) => o.userId === member.id).map((o) => [`<b class="nowrap">${o.id}</b>`, `<span class="truncate">${o.product}</span>`, pill(o.orderStatus), o.paymentStatus, money(o.final), `<button data-nav="/orders/${o.id}">상세</button>`]));
  if (tab === 'Courses') return table(['강의','진도','최근 학습','튜터'], [[`<span class="truncate">영어 풀패키지</span>`, '68%', '2026-05-28', 'Sarah'], ['스페인어 미니학습지', '21%', '2026-05-26', 'Carlos']]);
  if (tab === 'Groups') return table(['그룹명','역할','상태','가입일'], [['VIP 집중관리', '학습자', pill('활성'), '2026-01-02'], ['B2B 파일럿', '리더', pill('활성'), '2026-04-11']]);
  if (tab === 'Points') return table(['구분','금액','월렛','소멸일','사유'], pointLogs.map((p) => [p.type, num(p.amount), p.wallet, p.expires, `<span class="truncate">${p.reason}</span>`]));
  if (tab === 'Coupons') return table(['쿠폰','조건','한도','사용'], coupons.map((c) => [c.name, `<span class="truncate">${c.condition}</span>`, c.limit, `${c.used}회`]));
  const type = tab === 'General inquiries' ? 'general' : 'lesson';
  return table(['제목','내용 미리보기','상태','담당자','액션'], inquiries.filter((q) => q.type === type).map((q) => [`<span class="truncate">${q.title}</span>`, `<span class="truncate">${q.preview}</span>`, pill(q.status), q.manager, `<button data-modal="${q.id} 답변 작성">답변</button>`]));
}

function inquiriesPage() {
  const key = 'inq';
  const f = (name, def = '전체') => state.filters[`${key}.${name}`] || def;
  const search = (state.filters[`${key}.search`] || '').toLowerCase();
  const filtered = inquiries.filter((q) => [q.name,q.email,q.title,q.preview].join(' ').toLowerCase().includes(search) && (f('status') === '전체' || q.status === f('status')) && (f('manager') === '전체' || q.manager === f('manager')) && (f('slack') === '전체' || (f('slack') === '수신' ? q.slack : !q.slack)) && (f('unanswered') === '전체' || !q.answered) && (f('period') === '전체' || q.date >= '2026-05-22'));
  const extra = select(`${key}.status`, ['전체','신규','처리중','완료','보류']) + select(`${key}.period`, ['전체','최근 7일']) + select(`${key}.manager`, ['전체','민지','도윤','서준']) + select(`${key}.slack`, ['전체','수신','미수신']) + select(`${key}.unanswered`, ['전체','미답변만']);
  const rows = filtered.map((q) => [`<span class="truncate title-cell">${q.title}</span>`, `<span class="truncate preview-cell">${q.preview}</span>`, `<span class="nowrap">${q.name}</span>`, `<span class="nowrap">${q.email}</span>`, pill(q.status), q.manager, q.slack ? '수신' : '미수신', `<button data-modal="${q.id} 상세 답변">열기</button>`]);
  return `<section class="page"><h1>문의 관리</h1>${toolbar(key, extra)}${state.loading ? '<div class="loading">목록을 불러오는 중입니다...</div>' : table(['제목','내용','이름','이메일','상태','담당자','Slack','액션'], rows)}${pager()}</section>`;
}
function crudPage(title, create, key, columns, rows) { return `<section class="page"><div class="page-title"><h1>${title}</h1><button data-modal="${create}">${create}</button></div>${toolbar(key)}${table(columns, rows)}${pager()}</section>`; }
function couponsPage() { const s = (state.filters['coupons.search'] || '').toLowerCase(); const rows = coupons.filter((c) => JSON.stringify(c).toLowerCase().includes(s)).map((c) => [`<b class="truncate">${c.name}</b>`, `<span class="truncate">${c.condition}</span>`, c.limit, c.products, c.emails, money(c.discount), actions(c.name)]); return crudPage('쿠폰 관리', '쿠폰 생성', 'coupons', ['쿠폰명','사용조건','사용한도','적용 상품','허용 이메일','할인액','액션'], rows); }
function vouchersPage() { const s = (state.filters['vouchers.search'] || '').toLowerCase(); const rows = vouchers.filter((v) => JSON.stringify(v).toLowerCase().includes(s)).map((v) => [v.campaign, `<span class="nowrap">${v.code}</span>`, v.used ? '사용' : '미사용', v.place, v.issuer, `${v.issued}개 / 잔여 ${v.remaining}`, actions(v.campaign)]); return crudPage('바우처 관리', '바우처 발급', 'vouchers', ['캠페인','16자리 코드','사용 여부','사용처','발행자','발급 수량','액션'], rows); }
function actions(name) { return `<div class="row-actions"><button data-modal="${name} 수정">수정</button><button class="danger" data-danger="${name}">삭제</button></div>`; }
function pointsPage() { const s = (state.filters['points.search'] || '').toLowerCase(); const rows = pointLogs.filter((p) => JSON.stringify(p).toLowerCase().includes(s)).map((p) => [p.id, p.user, p.type, num(p.amount), p.wallet, p.expires, `<span class="truncate">${p.reason}</span>`]); return `<section class="page"><h1>포인트 관리</h1><div class="grid cards">${metric('포인트 정책', '구매 1% 적립', '등급별 추가 적립 가능')}${metric('소멸 설정', '365일', '기간제한 월렛 별도')}<button class="card action-card" data-modal="개별 포인트 조정">개별 조정</button><button class="card action-card" data-toast="CSV 일괄 등록 파일을 검증했습니다.">CSV 일괄 등록</button></div>${toolbar('points', '<button data-modal="기간제한 포인트 월렛 생성">월렛 생성</button>')}${table(['로그ID','회원','유형','금액','월렛','소멸일','사유'], rows)}${pager()}</section>`; }

function analyticsPage() {
  const metrics = [['총판매액',2039000],['주문건수',63],['평균 주문액',32365],['판매된 상품 수',71],['환불',52000],['쿠폰 할인액',161000],['순판매액',1826000],['배송비',18000],['총판매',2044000]];
  const range = select('ana.range', ['Today','Yesterday','Week to date','Last week','Month to date','Last month','Quarter to date','Last quarter','Year to date','Last year','사용자 정의 날짜']);
  const compare = select('ana.compare', ['Previous period','Previous year','비교 안 함']);
  return `<section class="page"><div class="page-title"><div><h1>매출 분석</h1><p>기간별 매출, 비교 기간, 상품/카테고리/쿠폰 성과를 한 화면에서 확인합니다.</p></div><button data-toast="분석 CSV 다운로드를 시작했습니다.">다운로드</button></div><div class="toolbar">${range}<input type="date" value="2026-05-01"><input type="date" value="2026-05-29">${compare}<button data-toast="매출 분석 기간이 적용되었습니다.">적용</button></div><div class="grid metrics">${metrics.map(([t,v]) => metric(t, t.includes('건수') || t.includes('상품 수') ? `${v}건` : money(v))).join('')}</div><div class="grid analytics-grid"><div class="card wide"><h2>매출 추이 / 비교 기간 라인 차트</h2>${lineChart()}</div>${topList('상품 TOP 5',['영어 풀패키지','스페인어 베이직','일본어 챌린지','프랑스어 스타터','독일어 회화'])}${topList('카테고리 TOP 5',['영어','스페인어','일본어','프랑스어','B2B'])}${topList('쿠폰 성과', coupons.map((c) => `${c.name} · ${money(c.discount)}`))}</div>${table(['일자','총판매액','비교 기간','주문건수','정렬'], dailySales.map((d,i) => [d.date, money(d.sales), money(d.compare), `${d.orders}건`, `<button data-toast="${d.date} 데이터를 기준으로 정렬했습니다.">${i + 1}</button>`]))}${pager()}</section>`;
}
function lineChart() { const max = Math.max(...dailySales.flatMap((d) => [d.sales,d.compare])); const pts = (key) => dailySales.map((d,i) => `${(i/(dailySales.length-1))*100},${100-(d[key]/max)*90}`).join(' '); return `<svg class="chart" viewBox="0 0 100 110" preserveAspectRatio="none"><polyline points="${pts('compare')}" fill="none" stroke="#94a3b8" stroke-width="2"/><polyline points="${pts('sales')}" fill="none" stroke="#2563eb" stroke-width="3"/>${dailySales.map((d,i) => `<text x="${(i/(dailySales.length-1))*100}" y="108" font-size="4" text-anchor="middle">${d.date}</text>`).join('')}</svg>`; }
function topList(title, items) { return `<div class="card"><h2>${title}</h2><ol class="top-list">${items.slice(0,5).map((item,i) => `<li><span class="truncate">${item}</span><b>${5-i}</b></li>`).join('')}</ol></div>`; }

function ordersPage() {
  const key = 'ord'; const f = (name, def = '전체') => state.filters[`${key}.${name}`] || def; const search = (state.filters[`${key}.search`] || '').toLowerCase();
  const filtered = orders.filter((o) => [o.id,o.name,o.email,o.phone,o.userId,o.product].join(' ').toLowerCase().includes(search) && (f('orderStatus') === '전체' || o.orderStatus === f('orderStatus')) && (f('pay') === '전체' || o.paymentStatus === f('pay')) && (f('period') === '전체' || o.created >= '2026-05-24'));
  const extra = select(`${key}.orderStatus`, ['전체','결제완료','배송준비','배송중','완료','취소','환불요청']) + select(`${key}.pay`, ['전체','결제대기','결제완료','부분환불','전액환불']) + select(`${key}.period`, ['전체','최근 7일']) + '<button data-toast="주문 Export 파일을 생성했습니다.">Export</button><button data-toast="주문 CSV Upload 검증 완료">CSV Upload</button><button data-toast="송장 Upload 매핑 완료">송장 Upload</button>';
  const rows = filtered.map((o) => [`<span class="nowrap">${o.id}</span>`, `<span class="nowrap">${o.name}</span>`, `<span class="nowrap">${o.email}</span>`, `<span class="nowrap">${o.phone}</span>`, o.userId, `<span class="truncate title-cell">${o.product}</span>`, pill(o.orderStatus), pill(o.paymentStatus), o.created, `<div class="row-actions"><button data-nav="/orders/${o.id}">상세</button><button data-refund="${o.id}">환불</button></div>`]);
  return `<section class="page"><div class="page-title"><h1>주문/결제 관리</h1><div class="button-group"><button data-nav="/orders/new">수동 주문 생성</button><button data-nav="/payment-links/new">결제 링크 생성</button></div></div>${toolbar(key, extra)}${state.loading ? '<div class="loading">목록을 불러오는 중입니다...</div>' : table(['주문번호','이름','이메일','전화번호','User ID','상품','주문상태','결제상태','기간','액션'], rows)}${pager()}</section>`;
}
function orderDetail() { const id = state.path.split('/').pop(); const o = orders.find((x) => x.id === id) || orders[0]; const fields = [['주문번호',o.id],['주문생성일',o.created],['결제일',o.paid],['주문상태',o.orderStatus],['결제수단',o.method],['할부개월',o.installment],['회원 정보',`${o.name} / ${o.email}`],['배송 주소',o.address],['상품명',o.product],['SKU',o.sku],['수량',o.qty],['상품금액',money(o.amount)],['쿠폰 사용금액',money(o.coupon)],['포인트 사용금액',money(o.points)],['배송비',money(o.shipping)],['최종 결제금액',money(o.final)],['적립 예정 포인트',num(o.expectedPoints)]]; return `<section class="page"><div class="page-title"><div><h1>주문 상세</h1><p>${o.id}</p></div><div class="button-group"><button data-toast="영수증 보기 창을 열었습니다.">영수증 보기</button><button class="danger" data-refund="${o.id}">환불</button></div></div><div class="grid cards order-detail">${fields.map(([k,v]) => `<div class="card kv"><span>${k}</span><b>${v}</b></div>`).join('')}</div><div class="card"><h2>관리자 메모</h2><textarea>VIP 고객. 환불 요청 시 학습 진행률과 쿠폰 복구 여부 확인 필요.</textarea><button data-toast="관리자 메모가 저장되었습니다.">메모 저장</button></div></section>`; }
function formPage(title, button, fields) { return `<section class="page"><h1>${title}</h1><div class="form-grid card">${fields.map((f) => `<label>${f}<input placeholder="${f} 입력"></label>`).join('')}<button data-toast="${button} 작업이 완료되었습니다.">${button}</button></div></section>`; }
function dashboard() { return `<section class="page"><h1>대시보드</h1><div class="grid cards">${metric('오늘 주문','12건')}${metric('미답변 문의','3건')}${metric('순판매액', money(1649000))}${metric('환불 요청','1건')}</div><button data-nav="/orders">주문 목록으로 이동</button></section>`; }

function page() {
  if (state.path.startsWith('/members/')) return memberPage();
  if (state.path === '/orders/new') return formPage('수동 주문 생성', '주문 생성', ['회원 이메일','상품명','SKU','수량','상품금액','쿠폰금액','포인트금액','배송비']);
  if (state.path === '/payment-links/new') return formPage('결제 링크 생성', '링크 생성', ['받는 사람 이름','이메일','전화번호','상품명','결제금액','만료일']);
  if (state.path.startsWith('/orders/')) return orderDetail();
  if (state.path === '/' || state.path === '/orders') return ordersPage();
  if (state.path === '/analytics') return analyticsPage();
  if (state.path === '/inquiries') return inquiriesPage();
  if (state.path === '/coupons') return couponsPage();
  if (state.path === '/vouchers') return vouchersPage();
  if (state.path === '/points') return pointsPage();
  return dashboard();
}
function render() { $('#root').innerHTML = shell(page()); bind(); renderToasts(); }
function renderToasts() { const stack = $('.toast-stack'); if (stack) stack.innerHTML = state.toast.map((t) => `<div class="toast">${t.message}</div>`).join(''); }
function bind() {
  document.querySelectorAll('[data-nav]').forEach((el) => el.addEventListener('click', () => navigate(el.dataset.nav)));
  document.querySelectorAll('[data-modal]').forEach((el) => el.addEventListener('click', () => openModal(el.dataset.modal)));
  document.querySelectorAll('[data-toast]').forEach((el) => el.addEventListener('click', () => notify(el.dataset.toast)));
  document.querySelectorAll('[data-danger]').forEach((el) => el.addEventListener('click', () => confirmAction('삭제 확인', `${el.dataset.danger} 항목을 삭제할까요?`, () => notify('삭제 처리되었습니다.'))));
  document.querySelectorAll('[data-refund]').forEach((el) => el.addEventListener('click', () => confirmAction('환불 확인', `${el.dataset.refund} 주문을 환불 처리할까요?`, () => notify('환불 요청이 접수되었습니다.'))));
  document.querySelectorAll('[data-tab]').forEach((el) => el.addEventListener('click', () => { state.memberTab = el.dataset.tab; render(); }));
  document.querySelectorAll('[data-filter]').forEach((el) => el.addEventListener('input', () => { state.filters[el.dataset.filter] = el.value; render(); }));
  document.querySelectorAll('select[data-filter]').forEach((el) => el.addEventListener('change', () => { state.filters[el.dataset.filter] = el.value; render(); }));
  document.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', () => { state.modal = ''; state.confirm = null; render(); }));
  const ok = $('[data-confirm]'); if (ok) ok.addEventListener('click', () => { state.confirm.action(); state.confirm = null; render(); });
  const save = $('[data-save-modal]'); if (save) save.addEventListener('click', () => { notify(`${state.modal} 처리가 완료되었습니다.`); state.modal = ''; render(); });
  const apply = $('[data-action="apply-filter"]'); if (apply) apply.addEventListener('click', () => { state.loading = true; render(); setTimeout(() => { state.loading = false; notify('필터가 적용되었습니다.'); render(); }, 450); });
}
window.addEventListener('popstate', () => { state.path = location.pathname; render(); });
render();
