/* ===========================================
   ENGLISH FUN ZONE — SCRIPT.JS
   4th Grade Interactive English Learning
   All exercises, scoring, badges & games
   =========================================== */

/* =============================================
   GLOBAL STATE
   ============================================= */
const scores = { sequencing: 0, connectives: 0, zeroCond: 0, irrVerbs: 0 };
let totalScore = 0;
const completedExercises = new Set();

/* =============================================
   SECTION NAVIGATION
   ============================================= */
function showSection(id) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Close mobile nav
  document.getElementById('mainNav').classList.remove('open');

  // Update badge page when visiting it
  if (id === 'badges') updateBadgePage();
}

// Hamburger toggle
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mainNav').classList.toggle('open');
});

// Nav links via data-section
document.querySelectorAll('[data-section]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(link.dataset.section);
  });
});

/* =============================================
   SCORE & PROGRESS SYSTEM
   ============================================= */
function addScore(category, points, exerciseKey) {
  if (completedExercises.has(exerciseKey)) return; // No repeat scoring
  completedExercises.add(exerciseKey);
  scores[category] = (scores[category] || 0) + points;
  totalScore += points;

  document.getElementById('totalScore').textContent = totalScore;
  document.getElementById('finalScore').textContent = totalScore;

  // Progress bar: max ~240 points
  const pct = Math.min((totalScore / 240) * 100, 100);
  document.getElementById('globalProgress').style.width = pct + '%';

  showToast('🌟 +' + points + ' points!');
  if (totalScore >= 50) launchConfetti();
}

function updateBadgePage() {
  document.getElementById('finalScore').textContent = totalScore;
  document.getElementById('scoreSeq').textContent  = (scores.sequencing || 0) + ' pts';
  document.getElementById('scoreConn').textContent  = (scores.connectives || 0) + ' pts';
  document.getElementById('scoreZC').textContent    = (scores.zeroCond || 0) + ' pts';
  document.getElementById('scoreIV').textContent    = (scores.irrVerbs || 0) + ' pts';

  const allBadges = [
    { id:'seq',   icon:'🔢', name:'Sequence Star',   req: completedExercises.has('seq-mc') },
    { id:'conn',  icon:'🔗', name:'Connector Pro',   req: completedExercises.has('conn-mc') },
    { id:'zc',    icon:'🌿', name:'Eco Thinker',      req: completedExercises.has('zc-mc') },
    { id:'iv',    icon:'✏️', name:'Verb Master',      req: completedExercises.has('iv-mc') },
    { id:'score', icon:'⭐', name:'10 Points',         req: totalScore >= 10 },
    { id:'score2',icon:'🌟', name:'50 Points',         req: totalScore >= 50 },
    { id:'score3',icon:'🏆', name:'100 Points',        req: totalScore >= 100 },
    { id:'story', icon:'📖', name:'Story Teller',     req: completedExercises.has('iv-story') },
    { id:'mem',   icon:'🃏', name:'Memory Champ',     req: completedExercises.has('memory') },
    { id:'eco',   icon:'🌍', name:'Planet Protector', req: completedExercises.has('zc-match') },
  ];

  const grid = document.getElementById('badgesGrid');
  grid.innerHTML = '';
  allBadges.forEach(b => {
    const div = document.createElement('div');
    div.className = 'badge-item' + (b.req ? '' : ' locked');
    div.innerHTML = `<div class="badge-icon">${b.icon}</div><div class="badge-name">${b.name}</div>`;
    grid.appendChild(div);
  });

  const earned = allBadges.filter(b => b.req).length;
  const msg = document.getElementById('motivMsg');
  if (earned === allBadges.length) {
    msg.textContent = '🎉 WOW! You earned ALL badges! You are an English superstar! 🌟';
  } else if (earned > 5) {
    msg.textContent = `Amazing! You earned ${earned}/${allBadges.length} badges! Keep going! 💪`;
  } else {
    msg.textContent = `You earned ${earned}/${allBadges.length} badges. Complete more exercises! 🚀`;
  }
}

/* =============================================
   RESULT BOX HELPER
   ============================================= */
function showResult(boxId, correct, total, messages) {
  const box = document.getElementById(boxId);
  box.classList.remove('hidden', 'success', 'partial', 'fail');
  const pct = correct / total;
  if (pct === 1) {
    box.classList.add('success');
    box.innerHTML = `🎉 <strong>Excellent!</strong> ${correct}/${total} correct! ${messages.success || ''}`;
  } else if (pct >= 0.5) {
    box.classList.add('partial');
    box.innerHTML = `👍 <strong>Good try!</strong> ${correct}/${total} correct. ${messages.partial || 'Review and try again!'}`;
  } else {
    box.classList.add('fail');
    box.innerHTML = `💪 <strong>Keep trying!</strong> ${correct}/${total} correct. ${messages.fail || 'Review the explanation and try again!'}`;
  }
}

/* =============================================
   TOAST NOTIFICATION
   ============================================= */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2000);
}

/* =============================================
   CONFETTI
   ============================================= */
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: -10,
    r: Math.random() * 8 + 4,
    c: ['#6366F1','#F59E0B','#22C55E','#EC4899','#3B82F6'][Math.floor(Math.random()*5)],
    v: Math.random() * 3 + 1,
    dx: (Math.random() - 0.5) * 2,
  }));
  let frames = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.y += p.v;
      p.x += p.dx;
    });
    frames++;
    if (frames < 90) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

/* =============================================
   VIDEO MODAL
   ============================================= */
function openVideo(url) {
  // Convert youtube watch URL to embed URL
  const embedUrl = url.replace('watch?v=', 'embed/');
  document.getElementById('videoFrame').src = embedUrl + '?autoplay=1';
  document.getElementById('videoModal').classList.remove('hidden');
}
function closeVideo() {
  document.getElementById('videoFrame').src = '';
  document.getElementById('videoModal').classList.add('hidden');
}

/* =============================================
   ─────────────────────────────────────────────
   SECTION 1: SEQUENCING WORDS
   ─────────────────────────────────────────────
   ============================================= */

/* ── Exercise 1: Multiple Choice ── */
const seqMCData = [
  {
    q: '______, wash your hands. ______, take your food.',
    options: ['First / Next', 'Finally / First', 'Then / After that', 'Next / But'],
    correct: 0
  },
  {
    q: 'We went to the park. ______, we played soccer. ______, we went home.',
    options: ['After that / Finally', 'First / Because', 'Then / And', 'Finally / Next'],
    correct: 0
  },
  {
    q: '______, I brushed my teeth. ______, I went to bed.',
    options: ['First / Finally', 'After that / But', 'Next / Because', 'Then / First'],
    correct: 0
  },
  {
    q: 'I boiled water. ______, I added the pasta. ______, I served the food.',
    options: ['Then / Finally', 'First / Next', 'After that / But', 'Next / Because'],
    correct: 0
  }
];

function initSeqMC() {
  const container = document.getElementById('seq-mc');
  container.innerHTML = '';
  seqMCData.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'mc-item';
    div.innerHTML = `<div class="mc-question">${i+1}. ${item.q}</div>
      <div class="mc-options" id="seq-mc-opts-${i}">
        ${item.options.map((o, j) =>
          `<button class="mc-option" data-q="${i}" data-j="${j}" onclick="selectMCOption(this,'seq-mc-opts-${i}')">${o}</button>`
        ).join('')}
      </div>`;
    container.appendChild(div);
  });
}

function selectMCOption(btn, groupId) {
  document.querySelectorAll(`#${groupId} .mc-option`).forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function checkSeqMC() {
  let correct = 0;
  seqMCData.forEach((item, i) => {
    const opts = document.querySelectorAll(`#seq-mc-opts-${i} .mc-option`);
    opts.forEach((btn, j) => {
      btn.classList.remove('correct','wrong');
      if (btn.classList.contains('selected')) {
        if (j === item.correct) { btn.classList.add('correct'); correct++; }
        else btn.classList.add('wrong');
      }
      if (j === item.correct) btn.classList.add('correct');
    });
  });
  showResult('seq-mc-result', correct, seqMCData.length, {
    success: 'You know your sequencing words! 🔢',
    partial: 'Good job! Review the sequence order again.',
  });
  if (correct >= 3) addScore('sequencing', 15, 'seq-mc');
}

/* ── Exercise 2: Sentence Ordering ── */
const seqOrderData = [
  { text: '🍊 Cut the oranges in half.', correct: 1 },
  { text: '🥤 Pour the juice into a glass.', correct: 3 },
  { text: '🍊 Wash the oranges.', correct: 0 },
  { text: '🍹 Add ice and enjoy!', correct: 4 },
  { text: '🥤 Squeeze the juice out.', correct: 2 },
];

let seqOrderItems = [];

function initSeqOrder() {
  seqOrderItems = [...seqOrderData].sort(() => Math.random() - 0.5);
  const list = document.getElementById('seq-order-list');
  list.innerHTML = '';
  seqOrderItems.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'order-item';
    div.draggable = true;
    div.dataset.idx = i;
    div.innerHTML = `
      <span class="order-handle">⠿</span>
      <span>${item.text}</span>
      <div class="order-controls">
        <button class="order-btn" onclick="moveOrderItem(${i},-1)">↑</button>
        <button class="order-btn" onclick="moveOrderItem(${i},1)">↓</button>
      </div>`;
    // Drag events
    div.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', i); div.classList.add('dragging'); });
    div.addEventListener('dragend', () => div.classList.remove('dragging'));
    div.addEventListener('dragover', e => e.preventDefault());
    div.addEventListener('drop', e => {
      e.preventDefault();
      const fromIdx = parseInt(e.dataTransfer.getData('text/plain'));
      swapOrderItems(fromIdx, parseInt(div.dataset.idx));
    });
    list.appendChild(div);
  });
}

function swapOrderItems(from, to) {
  if (from === to) return;
  [seqOrderItems[from], seqOrderItems[to]] = [seqOrderItems[to], seqOrderItems[from]];
  initSeqOrder();
}

function moveOrderItem(idx, dir) {
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= seqOrderItems.length) return;
  swapOrderItems(idx, newIdx);
}

function checkSeqOrder() {
  const items = document.querySelectorAll('#seq-order-list .order-item');
  let correct = 0;
  items.forEach((item, pos) => {
    const dataIdx = parseInt(item.dataset.idx);
    const expected = seqOrderItems[dataIdx].correct;
    item.classList.remove('correct-pos','wrong-pos');
    if (pos === expected) { item.classList.add('correct-pos'); correct++; }
    else item.classList.add('wrong-pos');
  });
  showResult('seq-order-result', correct, seqOrderData.length, {
    success: 'Perfect order! Great sequencing! 🔢',
    partial: 'Almost! Try moving some items.',
  });
  if (correct >= 4) addScore('sequencing', 15, 'seq-order');
}

/* ── Exercise 3: Fill in the Blank ── */
const seqFillData = [
  { before: '', blank: 'First', after: ', Maria woke up at 7 o\'clock.', answers: ['First'] },
  { before: '', blank: 'Next', after: ', she brushed her teeth.', answers: ['Next'] },
  { before: '', blank: 'Then', after: ', she had breakfast with her family.', answers: ['Then'] },
  { before: '', blank: 'After that', after: ', she packed her school bag.', answers: ['After that'] },
  { before: '', blank: 'Finally', after: ', she walked to school.', answers: ['Finally'] },
];

const seqWords = ['First', 'Next', 'Then', 'After that', 'Finally'];

function initSeqFill() {
  const container = document.getElementById('seq-fill');
  container.innerHTML = '<p class="ex-instruction">Use the word bank: <strong>' + seqWords.join(' / ') + '</strong></p>';
  seqFillData.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'fill-sentence';
    div.innerHTML = `${i+1}. <input class="fill-input" id="seq-fill-${i}" type="text" placeholder="..." style="width:110px" /> ${item.after}`;
    container.appendChild(div);
  });
}

function checkSeqFill() {
  let correct = 0;
  seqFillData.forEach((item, i) => {
    const input = document.getElementById(`seq-fill-${i}`);
    input.classList.remove('correct','wrong');
    const val = input.value.trim();
    const isCorrect = item.answers.some(a => a.toLowerCase() === val.toLowerCase());
    if (isCorrect) { input.classList.add('correct'); correct++; }
    else { input.classList.add('wrong'); input.value += ` (✓ ${item.blank})`; }
  });
  showResult('seq-fill-result', correct, seqFillData.length, {
    success: 'Amazing! You can tell stories in order! 📖',
    partial: 'Nice try! Check the sequencing words again.',
  });
  if (correct >= 4) addScore('sequencing', 15, 'seq-fill');
}

/* ── Exercise 4: True or False ── */
const seqTFData = [
  { q: '"First" is used to introduce the last step in a sequence.', answer: false },
  { q: '"Finally" is used for the last step in a sequence.', answer: true },
  { q: '"After that" comes AFTER "Then" in a sequence.', answer: true },
  { q: 'We use sequencing words to put events in order.', answer: true },
  { q: '"Next" and "Then" have a similar meaning in sequences.', answer: true },
];

function initSeqTF() {
  const container = document.getElementById('seq-tf');
  container.innerHTML = '';
  seqTFData.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'tf-item';
    div.innerHTML = `
      <div class="tf-question">${i+1}. ${item.q}</div>
      <div class="tf-buttons">
        <button class="tf-btn" id="seq-tf-t-${i}" onclick="selectTF(${i},'true','seq-tf')">✅ TRUE</button>
        <button class="tf-btn" id="seq-tf-f-${i}" onclick="selectTF(${i},'false','seq-tf')">❌ FALSE</button>
      </div>`;
    container.appendChild(div);
  });
}

function selectTF(idx, val, prefix) {
  const tBtn = document.getElementById(`${prefix}-t-${idx}`);
  const fBtn = document.getElementById(`${prefix}-f-${idx}`);
  tBtn.classList.remove('selected-t','selected-f');
  fBtn.classList.remove('selected-t','selected-f');
  if (val === 'true') tBtn.classList.add('selected-t');
  else fBtn.classList.add('selected-f');
}

function checkSeqTF() {
  let correct = 0;
  seqTFData.forEach((item, i) => {
    const tBtn = document.getElementById(`seq-tf-t-${i}`);
    const fBtn = document.getElementById(`seq-tf-f-${i}`);
    [tBtn, fBtn].forEach(b => b.classList.remove('correct','wrong'));
    const selectedTrue  = tBtn.classList.contains('selected-t');
    const selectedFalse = fBtn.classList.contains('selected-f');
    if ((selectedTrue && item.answer) || (selectedFalse && !item.answer)) {
      (item.answer ? tBtn : fBtn).classList.add('correct'); correct++;
    } else {
      if (selectedTrue) tBtn.classList.add('wrong');
      if (selectedFalse) fBtn.classList.add('wrong');
      (item.answer ? tBtn : fBtn).classList.add('correct');
    }
  });
  showResult('seq-tf-result', correct, seqTFData.length, {
    success: 'Perfect score! You are a sequencing expert! 🌟',
    partial: 'Good! A few more to review.',
  });
  if (correct >= 4) addScore('sequencing', 15, 'seq-tf');
}

/* =============================================
   SECTION 2: CONNECTIVES
   ============================================= */

/* ── Exercise 1: Multiple Choice ── */
const connMCData = [
  { q: 'I like pizza _____ I don\'t like pasta.', options: ['and', 'but', 'because'], correct: 1 },
  { q: 'She is happy _____ she got a good grade.', options: ['and', 'but', 'because'], correct: 2 },
  { q: 'We have a dog _____ a cat at home.', options: ['and', 'but', 'because'], correct: 0 },
  { q: 'He is tired _____ he played all day.', options: ['and', 'but', 'because'], correct: 2 },
  { q: 'I want to go outside _____ it is raining.', options: ['and', 'but', 'because'], correct: 1 },
];

function initConnMC() {
  const container = document.getElementById('conn-mc');
  container.innerHTML = '';
  connMCData.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'mc-item';
    div.innerHTML = `<div class="mc-question">${i+1}. ${item.q}</div>
      <div class="mc-options" id="conn-mc-opts-${i}">
        ${item.options.map((o, j) =>
          `<button class="mc-option" onclick="selectMCOption(this,'conn-mc-opts-${i}')">${o}</button>`
        ).join('')}
      </div>`;
    container.appendChild(div);
  });
}

function checkConnMC() {
  let correct = 0;
  connMCData.forEach((item, i) => {
    const opts = document.querySelectorAll(`#conn-mc-opts-${i} .mc-option`);
    opts.forEach((btn, j) => {
      btn.classList.remove('correct','wrong');
      if (btn.classList.contains('selected')) {
        if (j === item.correct) { btn.classList.add('correct'); correct++; }
        else btn.classList.add('wrong');
      }
      if (j === item.correct) btn.classList.add('correct');
    });
  });
  showResult('conn-mc-result', correct, connMCData.length, {
    success: 'You are a connective champion! 🔗',
    partial: 'Almost there! Think about what each sentence means.',
  });
  if (correct >= 4) addScore('connectives', 15, 'conn-mc');
}

/* ── Exercise 2: Fill in the Blank ── */
const connFillData = [
  { before: 'I have a brother', after: 'a sister.', answer: 'and' },
  { before: 'She likes math', after: 'she doesn\'t like history.', answer: 'but' },
  { before: 'The dog is barking', after: 'it sees a stranger.', answer: 'because' },
  { before: 'We play football', after: 'basketball at school.', answer: 'and' },
  { before: 'He wants to eat', after: 'he is not hungry.', answer: 'but' },
];

function initConnFill() {
  const container = document.getElementById('conn-fill');
  container.innerHTML = '<p class="ex-instruction">Use: <strong>and / but / because</strong></p>';
  connFillData.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'fill-sentence';
    div.innerHTML = `${i+1}. ${item.before} <input class="fill-input" id="conn-fill-${i}" type="text" placeholder="..." style="width:90px" /> ${item.after}`;
    container.appendChild(div);
  });
}

function checkConnFill() {
  let correct = 0;
  connFillData.forEach((item, i) => {
    const input = document.getElementById(`conn-fill-${i}`);
    input.classList.remove('correct','wrong');
    if (input.value.trim().toLowerCase() === item.answer) { input.classList.add('correct'); correct++; }
    else { input.classList.add('wrong'); input.value += ` (✓ ${item.answer})`; }
  });
  showResult('conn-fill-result', correct, connFillData.length, {
    success: 'Brilliant! All connectives in the right place! 🔗',
    partial: 'Good effort! Check AND = adds, BUT = contrast, BECAUSE = reason.',
  });
  if (correct >= 4) addScore('connectives', 15, 'conn-fill');
}

/* ── Exercise 3: Matching ── */
const connMatchData = [
  { start: 'I love animals', end: 'I have three pets at home.', conn: 'and' },
  { start: 'She is kind', end: 'she helps everyone.', conn: 'because' },
  { start: 'He likes soccer', end: 'he doesn\'t like swimming.', conn: 'but' },
  { start: 'We go to school', end: 'we learn many things.', conn: 'and' },
];

let connMatchSelected = null;

function initConnMatch() {
  const container = document.getElementById('conn-match');
  const shuffledEnds = [...connMatchData].sort(() => Math.random() - 0.5);
  container.innerHTML = `
    <div class="match-col" id="conn-match-starts">
      ${connMatchData.map((item, i) =>
        `<div class="match-item" id="conn-start-${i}" onclick="selectConnMatch('start',${i})">${item.start}</div>`
      ).join('')}
    </div>
    <div class="match-col" id="conn-match-ends">
      ${shuffledEnds.map((item, i) => {
        const origIdx = connMatchData.indexOf(item);
        return `<div class="match-item" id="conn-end-${origIdx}" data-orig="${origIdx}" onclick="selectConnMatch('end',${origIdx})">${item.conn} ${item.end}</div>`;
      }).join('')}
    </div>`;
}

function selectConnMatch(side, idx) {
  if (side === 'start') {
    document.querySelectorAll('#conn-match-starts .match-item').forEach(m => {
      if (!m.classList.contains('matched')) m.classList.remove('selected');
    });
    const el = document.getElementById(`conn-start-${idx}`);
    if (!el.classList.contains('matched')) {
      el.classList.add('selected');
      connMatchSelected = idx;
    }
  } else {
    if (connMatchSelected === null) return;
    if (connMatchSelected === idx) {
      document.getElementById(`conn-start-${connMatchSelected}`).classList.add('matched');
      document.getElementById(`conn-end-${idx}`).classList.add('matched');
      connMatchSelected = null;
    } else {
      document.getElementById(`conn-start-${connMatchSelected}`).classList.add('wrong');
      document.getElementById(`conn-end-${idx}`).classList.add('wrong');
      setTimeout(() => {
        document.getElementById(`conn-start-${connMatchSelected}`)?.classList.remove('wrong','selected');
        document.getElementById(`conn-end-${idx}`)?.classList.remove('wrong');
        connMatchSelected = null;
      }, 800);
    }
  }
}

function checkConnMatch() {
  const matched = document.querySelectorAll('#conn-match-starts .match-item.matched').length;
  showResult('conn-match-result', matched, connMatchData.length, {
    success: 'All sentences matched! You\'re a connector pro! 🔗',
    partial: 'Good! Try clicking the remaining sentences.',
  });
  if (matched >= 3) addScore('connectives', 15, 'conn-match');
}

/* ── Exercise 4: Error Correction ── */
const connErrorData = [
  { q: 'She is sad BECAUSE she is not crying.', options: ['and', 'but', 'because'], correct: 1, wrong: 'BECAUSE', right: 'but' },
  { q: 'I like dogs BUT I also like cats.', options: ['and', 'but', 'because'], correct: 0, wrong: 'BUT', right: 'and' },
  { q: 'He is cold AND he forgot his jacket.', options: ['and', 'but', 'because'], correct: 2, wrong: 'AND', right: 'because' },
  { q: 'We are happy BECAUSE we don\'t want to go home.', options: ['and', 'but', 'because'], correct: 1, wrong: 'BECAUSE', right: 'but' },
];

function initConnError() {
  const container = document.getElementById('conn-error');
  container.innerHTML = '';
  connErrorData.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'mc-item';
    div.innerHTML = `<div class="mc-question">${i+1}. "<em>${item.q}</em>" — The <strong>${item.wrong}</strong> is wrong! The correct connective is:</div>
      <div class="mc-options" id="conn-err-opts-${i}">
        ${item.options.map((o, j) =>
          `<button class="mc-option" onclick="selectMCOption(this,'conn-err-opts-${i}')">${o}</button>`
        ).join('')}
      </div>`;
    container.appendChild(div);
  });
}

function checkConnError() {
  let correct = 0;
  connErrorData.forEach((item, i) => {
    const opts = document.querySelectorAll(`#conn-err-opts-${i} .mc-option`);
    opts.forEach((btn, j) => {
      btn.classList.remove('correct','wrong');
      if (btn.classList.contains('selected')) {
        if (j === item.correct) { btn.classList.add('correct'); correct++; }
        else btn.classList.add('wrong');
      }
      if (j === item.correct) btn.classList.add('correct');
    });
  });
  showResult('conn-error-result', correct, connErrorData.length, {
    success: 'Great detective work! All errors found! 🔍',
    partial: 'Keep going! Think about what each sentence means.',
  });
  if (correct >= 3) addScore('connectives', 15, 'conn-error');
}

/* =============================================
   SECTION 3: ZERO CONDITIONAL
   ============================================= */

/* ── Exercise 1: Multiple Choice ── */
const zcMCData = [
  { q: 'If it _____ (rain), the streets get wet.', options: ['rains', 'rained', 'will rain', 'is raining'], correct: 0 },
  { q: 'If people cut trees, the air _____ (become) dirtier.', options: ['became', 'becomes', 'will become', 'is becoming'], correct: 1 },
  { q: 'Plants _____ (die) if they don\'t get water.', options: ['died', 'dying', 'die', 'will die'], correct: 2 },
  { q: 'If you _____ (leave) food outside, animals eat it.', options: ['left', 'leaving', 'leave', 'will leave'], correct: 2 },
  { q: 'If the temperature _____ (drop), water freezes.', options: ['dropping', 'dropped', 'drop', 'drops'], correct: 3 },
];

function initZCMC() {
  const container = document.getElementById('zc-mc');
  container.innerHTML = '';
  zcMCData.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'mc-item';
    div.innerHTML = `<div class="mc-question">${i+1}. ${item.q}</div>
      <div class="mc-options" id="zc-mc-opts-${i}">
        ${item.options.map((o, j) =>
          `<button class="mc-option" onclick="selectMCOption(this,'zc-mc-opts-${i}')">${o}</button>`
        ).join('')}
      </div>`;
    container.appendChild(div);
  });
}

function checkZCMC() {
  let correct = 0;
  zcMCData.forEach((item, i) => {
    const opts = document.querySelectorAll(`#zc-mc-opts-${i} .mc-option`);
    opts.forEach((btn, j) => {
      btn.classList.remove('correct','wrong');
      if (btn.classList.contains('selected')) {
        if (j === item.correct) { btn.classList.add('correct'); correct++; }
        else btn.classList.add('wrong');
      }
      if (j === item.correct) btn.classList.add('correct');
    });
  });
  showResult('zc-mc-result', correct, zcMCData.length, {
    success: 'You understand the zero conditional! 🌿',
    partial: 'Remember: use present simple in BOTH parts!',
  });
  if (correct >= 4) addScore('zeroCond', 15, 'zc-mc');
}

/* ── Exercise 2: Fill in the Blank ── */
const zcFillData = [
  { before: 'If people litter,', blank: 'pollute', after: 'they _____ (pollute) the environment.', answer: 'pollute' },
  { before: 'Water', blank: 'evaporates', after: '_____ (evaporate) if it gets hot enough.', answer: 'evaporates' },
  { before: 'If animals lose their habitat, they', blank: 'migrate', after: '_____ (migrate) or die.', answer: 'migrate' },
  { before: 'If we recycle,', blank: 'help', after: 'we _____ (help) the planet.', answer: 'help' },
  { before: 'Fish', blank: 'die', after: '_____ (die) if the river is polluted.', answer: 'die' },
];

function initZCFill() {
  const container = document.getElementById('zc-fill');
  container.innerHTML = '<p class="ex-instruction">Use the correct present simple form of the verb in parentheses.</p>';
  zcFillData.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'fill-sentence';
    div.innerHTML = `${i+1}. ${item.before} <input class="fill-input" id="zc-fill-${i}" type="text" placeholder="..." style="width:110px" /> ${item.after}`;
    container.appendChild(div);
  });
}

function checkZCFill() {
  let correct = 0;
  zcFillData.forEach((item, i) => {
    const input = document.getElementById(`zc-fill-${i}`);
    input.classList.remove('correct','wrong');
    if (input.value.trim().toLowerCase() === item.answer) { input.classList.add('correct'); correct++; }
    else { input.classList.add('wrong'); input.value += ` (✓ ${item.answer})`; }
  });
  showResult('zc-fill-result', correct, zcFillData.length, {
    success: 'Eco master! All verbs correct! 🌍',
    partial: 'Good try! Remember to use present simple.',
  });
  if (correct >= 4) addScore('zeroCond', 15, 'zc-fill');
}

/* ── Exercise 3: Unscramble ── */
const zcUnscrambleData = [
  { words: ['If', 'we', 'plant', 'trees,', 'the', 'air', 'becomes', 'cleaner.'], answer: 'If we plant trees, the air becomes cleaner.' },
  { words: ['Animals', 'die', 'if', 'they', "don't", 'have', 'water.'], answer: "Animals die if they don't have water." },
  { words: ['If', 'people', 'use', 'cars,', 'the', 'air', 'gets', 'dirty.'], answer: 'If people use cars, the air gets dirty.' },
];

let zcBuilt = {};

function initZCUnscramble() {
  const container = document.getElementById('zc-unscramble');
  container.innerHTML = '';
  zcUnscrambleData.forEach((item, i) => {
    zcBuilt[i] = [];
    const shuffled = [...item.words].sort(() => Math.random() - 0.5);
    const div = document.createElement('div');
    div.className = 'unscramble-item';
    div.id = `zc-uns-${i}`;
    div.innerHTML = `
      <p class="unscramble-prompt">${i+1}. Build the zero conditional sentence:</p>
      <div class="word-tokens" id="zc-tokens-${i}">
        ${shuffled.map((w, j) =>
          `<span class="word-token" id="zc-tok-${i}-${j}" data-word="${w}" onclick="placeZCWord(${i},${j},'${w}')">${w}</span>`
        ).join('')}
      </div>
      <div class="answer-area" id="zc-answer-${i}"></div>
      <button class="btn-secondary" style="margin-top:0.4rem;font-size:0.8rem;padding:0.3rem 0.8rem" onclick="resetZCUnscramble(${i})">🔄 Reset</button>`;
    container.appendChild(div);
  });
}

function placeZCWord(sIdx, tokIdx, word) {
  const tok = document.getElementById(`zc-tok-${sIdx}-${tokIdx}`);
  if (tok.classList.contains('used')) return;
  tok.classList.add('used');
  zcBuilt[sIdx].push({ word, tokIdx });

  const area = document.getElementById(`zc-answer-${sIdx}`);
  const span = document.createElement('span');
  span.className = 'placed-token';
  span.textContent = word;
  span.onclick = () => {
    // Remove from built
    const pos = zcBuilt[sIdx].findIndex(t => t.tokIdx === tokIdx);
    if (pos !== -1) zcBuilt[sIdx].splice(pos, 1);
    tok.classList.remove('used');
    span.remove();
  };
  area.appendChild(span);
}

function resetZCUnscramble(sIdx) {
  zcBuilt[sIdx] = [];
  document.querySelectorAll(`#zc-tokens-${sIdx} .word-token`).forEach(t => t.classList.remove('used'));
  document.getElementById(`zc-answer-${sIdx}`).innerHTML = '';
  document.getElementById(`zc-uns-${sIdx}`).classList.remove('correct','wrong');
}

function checkZCUnscramble() {
  let correct = 0;
  zcUnscrambleData.forEach((item, i) => {
    const built = zcBuilt[i].map(t => t.word).join(' ');
    const item_el = document.getElementById(`zc-uns-${i}`);
    item_el.classList.remove('correct','wrong');
    if (built.toLowerCase().replace(/\s+/g,' ').trim() === item.answer.toLowerCase()) {
      item_el.classList.add('correct'); correct++;
    } else {
      item_el.classList.add('wrong');
      document.getElementById(`zc-answer-${i}`).innerHTML += `<span style="color:#EF4444;font-size:0.82rem;display:block;margin-top:0.3rem">✓ ${item.answer}</span>`;
    }
  });
  showResult('zc-unscramble-result', correct, zcUnscrambleData.length, {
    success: 'Perfect sentences! You\'re a grammar superstar! ⭐',
    partial: 'Almost! Check the order of IF clause and result.',
  });
  if (correct >= 2) addScore('zeroCond', 15, 'zc-unscramble');
}

/* ── Exercise 4: Cause-Effect Matching ── */
const zcMatchData = [
  { cause: '🏭 Factories pollute the air', effect: '🌡️ the temperature rises.' },
  { cause: '🌳 We plant more trees', effect: '💨 the air becomes cleaner.' },
  { cause: '🚗 People use too many cars', effect: '☁️ there is more pollution.' },
  { cause: '🗑️ We recycle waste', effect: '🌱 we protect the environment.' },
  { cause: '🌊 Oceans get warmer', effect: '🐠 many fish lose their homes.' },
];

let zcMatchSel = null;
let zcMatchPaired = {};

function initZCMatch() {
  const container = document.getElementById('zc-match');
  const shuffledEffects = [...zcMatchData].sort(() => Math.random() - 0.5);
  container.innerHTML = `
    <div class="match-col" id="zc-causes">
      ${zcMatchData.map((item, i) =>
        `<div class="match-item" id="zc-cause-${i}" onclick="selectZCMatch('cause',${i})">"If ${item.cause}..."</div>`
      ).join('')}
    </div>
    <div class="match-col" id="zc-effects">
      ${shuffledEffects.map((item) => {
        const origIdx = zcMatchData.indexOf(item);
        return `<div class="match-item" id="zc-eff-${origIdx}" data-orig="${origIdx}" onclick="selectZCMatch('effect',${origIdx})">"...${item.effect}"</div>`;
      }).join('')}
    </div>`;
}

function selectZCMatch(side, idx) {
  if (side === 'cause') {
    document.querySelectorAll('#zc-causes .match-item').forEach(m => {
      if (!m.classList.contains('matched')) m.classList.remove('selected');
    });
    const el = document.getElementById(`zc-cause-${idx}`);
    if (!el.classList.contains('matched')) { el.classList.add('selected'); zcMatchSel = idx; }
  } else {
    if (zcMatchSel === null) return;
    if (zcMatchSel === idx) {
      document.getElementById(`zc-cause-${zcMatchSel}`).classList.add('matched');
      document.getElementById(`zc-eff-${idx}`).classList.add('matched');
      zcMatchPaired[zcMatchSel] = idx;
      zcMatchSel = null;
    } else {
      document.getElementById(`zc-cause-${zcMatchSel}`).classList.add('wrong');
      document.getElementById(`zc-eff-${idx}`).classList.add('wrong');
      setTimeout(() => {
        document.getElementById(`zc-cause-${zcMatchSel}`)?.classList.remove('wrong','selected');
        document.getElementById(`zc-eff-${idx}`)?.classList.remove('wrong');
        zcMatchSel = null;
      }, 800);
    }
  }
}

function checkZCMatch() {
  const matched = document.querySelectorAll('#zc-causes .match-item.matched').length;
  showResult('zc-match-result', matched, zcMatchData.length, {
    success: 'Excellent! You understand cause and effect! 🌍',
    partial: 'Good start! Try to match the remaining pairs.',
  });
  if (matched >= 4) addScore('zeroCond', 15, 'zc-match');
}

/* =============================================
   SECTION 4: IRREGULAR VERBS (BE & HAVE)
   ============================================= */

/* ── Exercise 1: Multiple Choice ── */
const ivMCData = [
  { q: 'She _____ a student in 2022. (past of BE)', options: ['is', 'was', 'were', 'are'], correct: 1 },
  { q: 'They _____ very happy yesterday. (past of BE)', options: ['is', 'was', 'were', 'am'], correct: 2 },
  { q: 'He _____ a new bicycle now. (present of HAVE)', options: ['have', 'had', 'has', 'is'], correct: 2 },
  { q: 'I _____ a dog when I was little. (past of HAVE)', options: ['have', 'had', 'has', 'is'], correct: 1 },
  { q: 'We _____ students at this school. (present of BE)', options: ['was', 'am', 'are', 'is'], correct: 2 },
  { q: 'She _____ long hair last year. (past of HAVE)', options: ['have', 'has', 'had', 'is'], correct: 2 },
];

function initIVMC() {
  const container = document.getElementById('iv-mc');
  container.innerHTML = '';
  ivMCData.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'mc-item';
    div.innerHTML = `<div class="mc-question">${i+1}. ${item.q}</div>
      <div class="mc-options" id="iv-mc-opts-${i}">
        ${item.options.map((o, j) =>
          `<button class="mc-option" onclick="selectMCOption(this,'iv-mc-opts-${i}')">${o}</button>`
        ).join('')}
      </div>`;
    container.appendChild(div);
  });
}

function checkIVMC() {
  let correct = 0;
  ivMCData.forEach((item, i) => {
    const opts = document.querySelectorAll(`#iv-mc-opts-${i} .mc-option`);
    opts.forEach((btn, j) => {
      btn.classList.remove('correct','wrong');
      if (btn.classList.contains('selected')) {
        if (j === item.correct) { btn.classList.add('correct'); correct++; }
        else btn.classList.add('wrong');
      }
      if (j === item.correct) btn.classList.add('correct');
    });
  });
  showResult('iv-mc-result', correct, ivMCData.length, {
    success: 'You master BE and HAVE! Incredible! ✏️',
    partial: 'Review the verb tables and try again!',
  });
  if (correct >= 5) addScore('irrVerbs', 15, 'iv-mc');
}

/* ── Exercise 2: Fill in the Blank ── */
const ivFillData = [
  { before: 'I', after: 'very excited about the trip.', hint: '(BE - present)', answer: 'am' },
  { before: 'Yesterday, the students', after: 'tired after the test.', hint: '(BE - past)', answer: 'were' },
  { before: 'She', after: 'a great teacher.', hint: '(BE - present)', answer: 'is' },
  { before: 'My friends', after: 'three dogs.', hint: '(HAVE - present)', answer: 'have' },
  { before: 'Last year, he', after: 'a red bicycle.', hint: '(HAVE - past)', answer: 'had' },
  { before: 'Our school', after: 'a big playground.', hint: '(HAVE - present)', answer: 'has' },
];

function initIVFill() {
  const container = document.getElementById('iv-fill');
  container.innerHTML = '';
  ivFillData.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'fill-sentence';
    div.innerHTML = `${i+1}. ${item.before} <input class="fill-input" id="iv-fill-${i}" type="text" placeholder="..." style="width:70px" /> ${item.after} <em style="color:#9CA3AF;font-size:0.82rem">${item.hint}</em>`;
    container.appendChild(div);
  });
}

function checkIVFill() {
  let correct = 0;
  ivFillData.forEach((item, i) => {
    const input = document.getElementById(`iv-fill-${i}`);
    input.classList.remove('correct','wrong');
    if (input.value.trim().toLowerCase() === item.answer) { input.classList.add('correct'); correct++; }
    else { input.classList.add('wrong'); input.value += ` (✓ ${item.answer})`; }
  });
  showResult('iv-fill-result', correct, ivFillData.length, {
    success: 'Superb! All verbs correct! 🌟',
    partial: 'Good effort! Check the verb tables again.',
  });
  if (correct >= 5) addScore('irrVerbs', 15, 'iv-fill');
}

/* ── Exercise 3: Memory Card Game ── */
const memPairs = [
  { a: 'am', b: 'was' },
  { a: 'are', b: 'were' },
  { a: 'is', b: 'was' },
  { a: 'have', b: 'had' },
  { a: 'has', b: 'had' },
  { a: 'BE', b: 'HAVE' },
];

let memFlipped  = [];
let memMatched  = 0;
let memMoves    = 0;
let memLocked   = false;

function initMemoryGame() {
  memFlipped = []; memMatched = 0; memMoves = 0; memLocked = false;
  document.getElementById('memPairs').textContent = 0;
  document.getElementById('memMoves').textContent = 0;

  // Build flat list of cards with pair ids
  const cards = [];
  memPairs.forEach((pair, i) => {
    cards.push({ text: pair.a, pairId: i, side: 'a' });
    cards.push({ text: pair.b, pairId: i, side: 'b' });
  });
  cards.sort(() => Math.random() - 0.5);

  const grid = document.getElementById('memory-game');
  grid.innerHTML = '';
  cards.forEach((card, idx) => {
    const div = document.createElement('div');
    div.className = 'mem-card';
    div.dataset.pairId = card.pairId;
    div.dataset.idx = idx;
    div.innerHTML = `<div class="mem-card-inner">
      <div class="mem-front">?</div>
      <div class="mem-back">${card.text}</div>
    </div>`;
    div.addEventListener('click', () => flipMemCard(div));
    grid.appendChild(div);
  });
}

function flipMemCard(card) {
  if (memLocked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  card.classList.add('flipped');
  memFlipped.push(card);

  if (memFlipped.length === 2) {
    memLocked = true;
    memMoves++;
    document.getElementById('memMoves').textContent = memMoves;

    const [a, b] = memFlipped;
    if (a.dataset.pairId === b.dataset.pairId && a !== b) {
      a.classList.add('matched');
      b.classList.add('matched');
      memMatched++;
      document.getElementById('memPairs').textContent = memMatched;
      memFlipped = [];
      memLocked  = false;
      if (memMatched === memPairs.length) {
        showToast('🎉 Memory game complete!');
        addScore('irrVerbs', 20, 'memory');
        launchConfetti();
      }
    } else {
      setTimeout(() => {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
        memFlipped = [];
        memLocked  = false;
      }, 900);
    }
  }
}

/* ── Exercise 4: Story ── */
const ivStoryData = [
  { before: 'My name', after: 'Tom. I', hint: '(BE-pres)', answer: 'is', hint2: '' },
  { before: 'am ten years old. I', after: 'two brothers.', hint: '(HAVE-pres)', answer: 'have' },
  { before: 'Last year, we', after: 'a small house.', hint: '(HAVE-past)', answer: 'had' },
  { before: 'My brothers', after: 'very noisy!', hint: '(BE-pres)', answer: 'are' },
  { before: 'Yesterday, I', after: 'sick, but today I am fine.', hint: '(BE-past)', answer: 'was' },
  { before: 'We', after: 'a great family!', hint: '(BE-pres)', answer: 'are' },
];

function initIVStory() {
  const container = document.getElementById('iv-story');
  container.innerHTML = '<p class="ex-instruction">Complete the story with the correct form of <strong>BE</strong> or <strong>HAVE</strong>.</p>';
  const p = document.createElement('p');
  p.style.lineHeight = '2.5';
  ivStoryData.forEach((item, i) => {
    p.innerHTML += `${item.before} <input class="fill-input" id="iv-story-${i}" type="text" placeholder="..." style="width:65px" title="${item.hint}" /> ${item.after} `;
  });
  container.appendChild(p);
}

function checkIVStory() {
  let correct = 0;
  ivStoryData.forEach((item, i) => {
    const input = document.getElementById(`iv-story-${i}`);
    input.classList.remove('correct','wrong');
    if (input.value.trim().toLowerCase() === item.answer) { input.classList.add('correct'); correct++; }
    else { input.classList.add('wrong'); input.value += `(✓${item.answer})`; }
  });
  showResult('iv-story-result', correct, ivStoryData.length, {
    success: 'Great story! You used BE and HAVE perfectly! 📖',
    partial: 'Good job! Check the hints in the verb tables.',
  });
  if (correct >= 5) addScore('irrVerbs', 15, 'iv-story');
}

/* =============================================
   INITIALIZATION — Run on page load
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  // Sequencing
  initSeqMC();
  initSeqOrder();
  initSeqFill();
  initSeqTF();
  // Connectives
  initConnMC();
  initConnFill();
  initConnMatch();
  initConnError();
  // Zero Conditional
  initZCMC();
  initZCFill();
  initZCUnscramble();
  initZCMatch();
  // Irregular Verbs
  initIVMC();
  initIVFill();
  initMemoryGame();
  initIVStory();

  console.log('🌟 English Fun Zone loaded! Ready to learn!');
});
