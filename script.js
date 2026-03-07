/* ===========================================
   ENGLISH FUN ZONE — SCRIPT.JS  (v2 – bugs fixed)
   4th Grade Interactive English Learning
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
  document.getElementById('mainNav').classList.remove('open');
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

// FIX: Toggle dropdown on tap (mobile) — CSS :hover does not fire on touch devices
const dropdownToggle = document.querySelector('.dropdown-toggle');
if (dropdownToggle) {
  dropdownToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const menu = dropdownToggle.nextElementSibling;
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
  });
}
// Close dropdown when clicking outside
document.addEventListener('click', () => {
  const menu = document.querySelector('.dropdown-menu');
  if (menu) menu.style.display = '';
});

/* =============================================
   SCORE & PROGRESS SYSTEM
   ============================================= */
function addScore(category, points, exerciseKey) {
  if (completedExercises.has(exerciseKey)) return;
  completedExercises.add(exerciseKey);
  scores[category] = (scores[category] || 0) + points;
  totalScore += points;

  document.getElementById('totalScore').textContent = totalScore;
  document.getElementById('finalScore').textContent = totalScore;

  const pct = Math.min((totalScore / 240) * 100, 100);
  document.getElementById('globalProgress').style.width = pct + '%';

  showToast('🌟 +' + points + ' points!');
  if (totalScore >= 50) launchConfetti();
}

function updateBadgePage() {
  document.getElementById('finalScore').textContent = totalScore;
  document.getElementById('scoreSeq').textContent  = (scores.sequencing  || 0) + ' pts';
  document.getElementById('scoreConn').textContent = (scores.connectives || 0) + ' pts';
  document.getElementById('scoreZC').textContent   = (scores.zeroCond    || 0) + ' pts';
  document.getElementById('scoreIV').textContent   = (scores.irrVerbs    || 0) + ' pts';

  const allBadges = [
    { icon: '🔢', name: 'Sequence Star',    req: completedExercises.has('seq-mc') },
    { icon: '🔗', name: 'Connector Pro',    req: completedExercises.has('conn-mc') },
    { icon: '🌿', name: 'Eco Thinker',      req: completedExercises.has('zc-mc') },
    { icon: '✏️', name: 'Verb Master',      req: completedExercises.has('iv-mc') },
    { icon: '⭐', name: '10 Points',         req: totalScore >= 10 },
    { icon: '🌟', name: '50 Points',         req: totalScore >= 50 },
    { icon: '🏆', name: '100 Points',        req: totalScore >= 100 },
    { icon: '📖', name: 'Story Teller',     req: completedExercises.has('iv-story') },
    { icon: '🃏', name: 'Memory Champ',     req: completedExercises.has('memory') },
    { icon: '🌍', name: 'Planet Protector', req: completedExercises.has('zc-match') },
  ];

  const grid = document.getElementById('badgesGrid');
  grid.innerHTML = '';
  allBadges.forEach(b => {
    const div = document.createElement('div');
    div.className = 'badge-item' + (b.req ? '' : ' locked');
    div.innerHTML = '<div class="badge-icon">' + b.icon + '</div><div class="badge-name">' + b.name + '</div>';
    grid.appendChild(div);
  });

  const earned = allBadges.filter(b => b.req).length;
  const msg = document.getElementById('motivMsg');
  if (earned === allBadges.length) {
    msg.textContent = 'WOW! You earned ALL badges! You are an English superstar!';
  } else if (earned > 5) {
    msg.textContent = 'Amazing! You earned ' + earned + '/' + allBadges.length + ' badges! Keep going!';
  } else {
    msg.textContent = 'You earned ' + earned + '/' + allBadges.length + ' badges. Complete more exercises!';
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
    box.innerHTML = 'Excellent! ' + correct + '/' + total + ' correct! ' + (messages.success || '');
  } else if (pct >= 0.5) {
    box.classList.add('partial');
    box.innerHTML = 'Good try! ' + correct + '/' + total + ' correct. ' + (messages.partial || 'Review and try again!');
  } else {
    box.classList.add('fail');
    box.innerHTML = 'Keep trying! ' + correct + '/' + total + ' correct. ' + (messages.fail || 'Review the explanation and try again!');
  }
}

/* =============================================
   TOAST NOTIFICATION
   ============================================= */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(function() { toast.classList.add('hidden'); }, 2000);
}

/* =============================================
   CONFETTI
   ============================================= */
function launchConfetti() {
  var canvas = document.getElementById('confettiCanvas');
  var ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  var colors = ['#6366F1','#F59E0B','#22C55E','#EC4899','#3B82F6'];
  var particles = [];
  for (var k = 0; k < 80; k++) {
    particles.push({
      x:  Math.random() * canvas.width,
      y:  -10,
      r:  Math.random() * 8 + 4,
      c:  colors[Math.floor(Math.random() * colors.length)],
      v:  Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 2
    });
  }
  var frames = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(function(p) {
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
   FIX: parse YouTube URL properly to extract video ID
   ============================================= */
function openVideo(url) {
  var videoId = '';
  var matchWatch = url.match(/[?&]v=([^&]+)/);
  var matchShort = url.match(/youtu\.be\/([^?]+)/);
  if (matchWatch) videoId = matchWatch[1];
  else if (matchShort) videoId = matchShort[1];
  if (videoId) {
    document.getElementById('videoFrame').src =
      'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
    document.getElementById('videoModal').classList.remove('hidden');
  }
}

function closeVideo() {
  document.getElementById('videoFrame').src = '';
  document.getElementById('videoModal').classList.add('hidden');
}

/* =============================================
   SHARED: Multiple Choice option selector
   ============================================= */
function selectMCOption(btn, groupId) {
  document.querySelectorAll('#' + groupId + ' .mc-option').forEach(function(b) {
    b.classList.remove('selected');
  });
  btn.classList.add('selected');
}

/* =============================================
   SECTION 1: SEQUENCING WORDS
   ============================================= */

/* Exercise 1: Multiple Choice */
var seqMCData = [
  { q: '_____, wash your hands. _____, take your food.',
    options: ['First / Next', 'Finally / First', 'Then / After that', 'Next / But'], correct: 0 },
  { q: 'We went to the park. _____, we played soccer. _____, we went home.',
    options: ['After that / Finally', 'First / Because', 'Then / And', 'Finally / Next'], correct: 0 },
  { q: '_____, I brushed my teeth. _____, I went to bed.',
    options: ['First / Finally', 'After that / But', 'Next / Because', 'Then / First'], correct: 0 },
  { q: 'I boiled water. _____, I added the pasta. _____, I served the food.',
    options: ['Then / Finally', 'First / Next', 'After that / But', 'Next / Because'], correct: 0 }
];

function initSeqMC() {
  var container = document.getElementById('seq-mc');
  container.innerHTML = '';
  seqMCData.forEach(function(item, i) {
    var div = document.createElement('div');
    div.className = 'mc-item';
    var optHTML = item.options.map(function(o) {
      return '<button class="mc-option" onclick="selectMCOption(this,\'seq-mc-opts-' + i + '\')">' + o + '</button>';
    }).join('');
    div.innerHTML = '<div class="mc-question">' + (i+1) + '. ' + item.q + '</div>' +
      '<div class="mc-options" id="seq-mc-opts-' + i + '">' + optHTML + '</div>';
    container.appendChild(div);
  });
}

function checkSeqMC() {
  var correct = 0;
  seqMCData.forEach(function(item, i) {
    var opts = document.querySelectorAll('#seq-mc-opts-' + i + ' .mc-option');
    opts.forEach(function(btn, j) {
      btn.classList.remove('correct','wrong');
      if (btn.classList.contains('selected')) {
        if (j === item.correct) { btn.classList.add('correct'); correct++; }
        else btn.classList.add('wrong');
      }
      if (j === item.correct) btn.classList.add('correct');
    });
  });
  showResult('seq-mc-result', correct, seqMCData.length, {
    success: 'You know your sequencing words!',
    partial: 'Good job! Review the sequence order again.'
  });
  if (correct >= 3) addScore('sequencing', 15, 'seq-mc');
}

/* Exercise 2: Sentence Ordering
   FIX: correctPos stored on each item; currentOrder tracks display order */
var seqOrderOriginal = [
  { text: 'Wash the oranges.',           correctPos: 0 },
  { text: 'Cut the oranges in half.',    correctPos: 1 },
  { text: 'Squeeze the juice out.',      correctPos: 2 },
  { text: 'Pour the juice into a glass.', correctPos: 3 },
  { text: 'Add ice and enjoy!',          correctPos: 4 }
];

var currentOrder = [];

function initSeqOrder() {
  if (currentOrder.length === 0) {
    currentOrder = seqOrderOriginal.slice().sort(function() { return Math.random() - 0.5; });
  }
  renderSeqOrder();
}

function renderSeqOrder() {
  var list = document.getElementById('seq-order-list');
  list.innerHTML = '';
  currentOrder.forEach(function(item, i) {
    var div = document.createElement('div');
    div.className = 'order-item';
    div.draggable = true;
    div.dataset.pos = i;
    div.innerHTML =
      '<span class="order-handle">&#8991;</span>' +
      '<span>' + item.text + '</span>' +
      '<div class="order-controls">' +
        '<button class="order-btn" onclick="moveOrderItem(' + i + ',-1)">&#8593;</button>' +
        '<button class="order-btn" onclick="moveOrderItem(' + i + ', 1)">&#8595;</button>' +
      '</div>';
    div.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('text/plain', String(i));
      div.classList.add('dragging');
    });
    div.addEventListener('dragend', function() { div.classList.remove('dragging'); });
    div.addEventListener('dragover', function(e) { e.preventDefault(); });
    div.addEventListener('drop', function(e) {
      e.preventDefault();
      var fromPos = parseInt(e.dataTransfer.getData('text/plain'));
      var toPos   = parseInt(div.dataset.pos);
      if (fromPos !== toPos) {
        var tmp = currentOrder[fromPos];
        currentOrder[fromPos] = currentOrder[toPos];
        currentOrder[toPos] = tmp;
        renderSeqOrder();
      }
    });
    list.appendChild(div);
  });
}

function moveOrderItem(idx, dir) {
  var newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= currentOrder.length) return;
  var tmp = currentOrder[idx];
  currentOrder[idx] = currentOrder[newIdx];
  currentOrder[newIdx] = tmp;
  renderSeqOrder();
}

function checkSeqOrder() {
  /* FIX: compare display position (index in list) against item.correctPos */
  var items = document.querySelectorAll('#seq-order-list .order-item');
  var correct = 0;
  items.forEach(function(el, displayPos) {
    var pos = parseInt(el.dataset.pos);
    el.classList.remove('correct-pos','wrong-pos');
    if (displayPos === currentOrder[pos].correctPos) {
      el.classList.add('correct-pos'); correct++;
    } else {
      el.classList.add('wrong-pos');
    }
  });
  showResult('seq-order-result', correct, seqOrderOriginal.length, {
    success: 'Perfect order! Great sequencing!',
    partial: 'Almost! Try moving some items.'
  });
  if (correct >= 4) addScore('sequencing', 15, 'seq-order');
}

/* Exercise 3: Fill in the Blank */
var seqFillData = [
  { blank: 'First',      after: ', Maria woke up at 7 o\'clock.' },
  { blank: 'Next',       after: ', she brushed her teeth.' },
  { blank: 'Then',       after: ', she had breakfast with her family.' },
  { blank: 'After that', after: ', she packed her school bag.' },
  { blank: 'Finally',    after: ', she walked to school.' }
];
var seqWords = ['First', 'Next', 'Then', 'After that', 'Finally'];

function initSeqFill() {
  var container = document.getElementById('seq-fill');
  container.innerHTML = '<p class="ex-instruction">Word bank: <strong>' + seqWords.join(' / ') + '</strong></p>';
  seqFillData.forEach(function(item, i) {
    var div = document.createElement('div');
    div.className = 'fill-sentence';
    div.innerHTML = (i+1) + '. ' +
      '<input class="fill-input" id="seq-fill-' + i + '" type="text" placeholder="..." autocomplete="off" style="width:110px" /> ' +
      item.after;
    container.appendChild(div);
  });
}

function checkSeqFill() {
  var correct = 0;
  seqFillData.forEach(function(item, i) {
    var input = document.getElementById('seq-fill-' + i);
    input.classList.remove('correct','wrong');
    if (input.value.trim().toLowerCase() === item.blank.toLowerCase()) {
      input.classList.add('correct'); correct++;
    } else {
      input.classList.add('wrong');
      input.value = item.blank;
    }
  });
  showResult('seq-fill-result', correct, seqFillData.length, {
    success: 'Amazing! You can tell stories in order!',
    partial: 'Nice try! Check the sequencing words again.'
  });
  if (correct >= 4) addScore('sequencing', 15, 'seq-fill');
}

/* Exercise 4: True or False */
var seqTFData = [
  { q: '"First" is used to introduce the LAST step in a sequence.', answer: false },
  { q: '"Finally" is used for the last step in a sequence.',         answer: true },
  { q: '"After that" comes AFTER "Then" in a sequence.',            answer: true },
  { q: 'We use sequencing words to put events in order.',           answer: true },
  { q: '"Next" and "Then" have a similar meaning in sequences.',    answer: true }
];

function initSeqTF() {
  var container = document.getElementById('seq-tf');
  container.innerHTML = '';
  seqTFData.forEach(function(item, i) {
    var div = document.createElement('div');
    div.className = 'tf-item';
    div.innerHTML =
      '<div class="tf-question">' + (i+1) + '. ' + item.q + '</div>' +
      '<div class="tf-buttons">' +
        '<button class="tf-btn" id="seq-tf-t-' + i + '" onclick="selectTF(' + i + ',\'true\',\'seq-tf\')">TRUE</button>' +
        '<button class="tf-btn" id="seq-tf-f-' + i + '" onclick="selectTF(' + i + ',\'false\',\'seq-tf\')">FALSE</button>' +
      '</div>';
    container.appendChild(div);
  });
}

function selectTF(idx, val, prefix) {
  var tBtn = document.getElementById(prefix + '-t-' + idx);
  var fBtn = document.getElementById(prefix + '-f-' + idx);
  tBtn.classList.remove('selected-t','selected-f');
  fBtn.classList.remove('selected-t','selected-f');
  if (val === 'true') tBtn.classList.add('selected-t');
  else fBtn.classList.add('selected-f');
}

function checkSeqTF() {
  var correct = 0;
  seqTFData.forEach(function(item, i) {
    var tBtn = document.getElementById('seq-tf-t-' + i);
    var fBtn = document.getElementById('seq-tf-f-' + i);
    [tBtn, fBtn].forEach(function(b) { b.classList.remove('correct','wrong'); });
    var selTrue  = tBtn.classList.contains('selected-t');
    var selFalse = fBtn.classList.contains('selected-f');
    if ((selTrue && item.answer) || (selFalse && !item.answer)) {
      correct++;
      (item.answer ? tBtn : fBtn).classList.add('correct');
    } else {
      if (selTrue)  tBtn.classList.add('wrong');
      if (selFalse) fBtn.classList.add('wrong');
      (item.answer ? tBtn : fBtn).classList.add('correct'); // show right answer
    }
  });
  showResult('seq-tf-result', correct, seqTFData.length, {
    success: 'Perfect score! You are a sequencing expert!',
    partial: 'Good! A few more to review.'
  });
  if (correct >= 4) addScore('sequencing', 15, 'seq-tf');
}

/* =============================================
   SECTION 2: CONNECTIVES
   ============================================= */

/* Exercise 1: Multiple Choice */
var connMCData = [
  { q: 'I like pizza _____ I don\'t like pasta.',        options: ['and','but','because'], correct: 1 },
  { q: 'She is happy _____ she got a good grade.',       options: ['and','but','because'], correct: 2 },
  { q: 'We have a dog _____ a cat at home.',             options: ['and','but','because'], correct: 0 },
  { q: 'He is tired _____ he played all day.',           options: ['and','but','because'], correct: 2 },
  { q: 'I want to go outside _____ it is raining.',     options: ['and','but','because'], correct: 1 }
];

function initConnMC() {
  var container = document.getElementById('conn-mc');
  container.innerHTML = '';
  connMCData.forEach(function(item, i) {
    var div = document.createElement('div');
    div.className = 'mc-item';
    var optHTML = item.options.map(function(o) {
      return '<button class="mc-option" onclick="selectMCOption(this,\'conn-mc-opts-' + i + '\')">' + o + '</button>';
    }).join('');
    div.innerHTML = '<div class="mc-question">' + (i+1) + '. ' + item.q + '</div>' +
      '<div class="mc-options" id="conn-mc-opts-' + i + '">' + optHTML + '</div>';
    container.appendChild(div);
  });
}

function checkConnMC() {
  var correct = 0;
  connMCData.forEach(function(item, i) {
    var opts = document.querySelectorAll('#conn-mc-opts-' + i + ' .mc-option');
    opts.forEach(function(btn, j) {
      btn.classList.remove('correct','wrong');
      if (btn.classList.contains('selected')) {
        if (j === item.correct) { btn.classList.add('correct'); correct++; }
        else btn.classList.add('wrong');
      }
      if (j === item.correct) btn.classList.add('correct');
    });
  });
  showResult('conn-mc-result', correct, connMCData.length, {
    success: 'You are a connective champion!',
    partial: 'Almost there! Think about what each sentence means.'
  });
  if (correct >= 4) addScore('connectives', 15, 'conn-mc');
}

/* Exercise 2: Fill in the Blank */
var connFillData = [
  { before: 'I have a brother',   after: 'a sister.',                   answer: 'and' },
  { before: 'She likes math',     after: "she doesn't like history.",   answer: 'but' },
  { before: 'The dog is barking', after: 'it sees a stranger.',         answer: 'because' },
  { before: 'We play football',   after: 'basketball at school.',       answer: 'and' },
  { before: 'He wants to eat',    after: 'he is not hungry.',           answer: 'but' }
];

function initConnFill() {
  var container = document.getElementById('conn-fill');
  container.innerHTML = '<p class="ex-instruction">Use: <strong>and / but / because</strong></p>';
  connFillData.forEach(function(item, i) {
    var div = document.createElement('div');
    div.className = 'fill-sentence';
    div.innerHTML = (i+1) + '. ' + item.before + ' ' +
      '<input class="fill-input" id="conn-fill-' + i + '" type="text" placeholder="..." autocomplete="off" style="width:90px" /> ' +
      item.after;
    container.appendChild(div);
  });
}

function checkConnFill() {
  var correct = 0;
  connFillData.forEach(function(item, i) {
    var input = document.getElementById('conn-fill-' + i);
    input.classList.remove('correct','wrong');
    if (input.value.trim().toLowerCase() === item.answer) {
      input.classList.add('correct'); correct++;
    } else {
      input.classList.add('wrong');
      input.value = item.answer;
    }
  });
  showResult('conn-fill-result', correct, connFillData.length, {
    success: 'Brilliant! All connectives in the right place!',
    partial: 'Check: AND = adds info, BUT = contrast, BECAUSE = reason.'
  });
  if (correct >= 4) addScore('connectives', 15, 'conn-fill');
}

/* Exercise 3: Matching
   FIX: use explicit numeric IDs; capture IDs in local vars before setTimeout */
var connMatchData = [
  { id: 0, start: 'I love animals',  end: 'I have three pets at home.',  conn: 'and' },
  { id: 1, start: 'She is kind',     end: 'she helps everyone.',         conn: 'because' },
  { id: 2, start: 'He likes soccer', end: "he doesn't like swimming.",   conn: 'but' },
  { id: 3, start: 'We go to school', end: 'we learn many things.',       conn: 'and' }
];

var connMatchSel = null;

function initConnMatch() {
  var container = document.getElementById('conn-match');
  var shuffledEnds = connMatchData.slice().sort(function() { return Math.random() - 0.5; });
  var startsHTML = connMatchData.map(function(item) {
    return '<div class="match-item" id="conn-start-' + item.id + '" onclick="selectConnMatch(\'start\',' + item.id + ')">' + item.start + '</div>';
  }).join('');
  var endsHTML = shuffledEnds.map(function(item) {
    return '<div class="match-item" id="conn-end-' + item.id + '" onclick="selectConnMatch(\'end\',' + item.id + ')">' + item.conn + ' ' + item.end + '</div>';
  }).join('');
  container.innerHTML =
    '<div class="match-col" id="conn-match-starts">' + startsHTML + '</div>' +
    '<div class="match-col" id="conn-match-ends">'   + endsHTML   + '</div>';
  connMatchSel = null;
}

function selectConnMatch(side, id) {
  if (side === 'start') {
    document.querySelectorAll('#conn-match-starts .match-item').forEach(function(m) {
      if (!m.classList.contains('matched')) m.classList.remove('selected');
    });
    var el = document.getElementById('conn-start-' + id);
    if (el && !el.classList.contains('matched')) {
      el.classList.add('selected');
      connMatchSel = id;
    }
  } else {
    if (connMatchSel === null) return;
    if (connMatchSel === id) {
      var s = document.getElementById('conn-start-' + connMatchSel);
      var e = document.getElementById('conn-end-' + id);
      if (s) { s.classList.remove('selected'); s.classList.add('matched'); }
      if (e) e.classList.add('matched');
      connMatchSel = null;
    } else {
      /* FIX: store IDs in local variables so setTimeout closure is correct */
      var wrongStart = connMatchSel;
      var wrongEnd   = id;
      var ws = document.getElementById('conn-start-' + wrongStart);
      var we = document.getElementById('conn-end-'   + wrongEnd);
      if (ws) ws.classList.add('wrong');
      if (we) we.classList.add('wrong');
      setTimeout(function() {
        var wss = document.getElementById('conn-start-' + wrongStart);
        var wee = document.getElementById('conn-end-'   + wrongEnd);
        if (wss) wss.classList.remove('wrong','selected');
        if (wee) wee.classList.remove('wrong');
        connMatchSel = null;
      }, 800);
    }
  }
}

function checkConnMatch() {
  var matched = document.querySelectorAll('#conn-match-starts .match-item.matched').length;
  showResult('conn-match-result', matched, connMatchData.length, {
    success: "All sentences matched! You're a connector pro!",
    partial: 'Good! Try clicking the remaining sentences.'
  });
  if (matched >= 3) addScore('connectives', 15, 'conn-match');
}

/* Exercise 4: Error Correction */
var connErrorData = [
  { q: 'She is sad BECAUSE she is not crying.',           options: ['and','but','because'], correct: 1 },
  { q: 'I like dogs BUT I also like cats.',               options: ['and','but','because'], correct: 0 },
  { q: 'He is cold AND he forgot his jacket.',            options: ['and','but','because'], correct: 2 },
  { q: "We are happy BECAUSE we don't want to go home.", options: ['and','but','because'], correct: 1 }
];

function initConnError() {
  var container = document.getElementById('conn-error');
  container.innerHTML = '';
  connErrorData.forEach(function(item, i) {
    var div = document.createElement('div');
    div.className = 'mc-item';
    var highlighted = item.q.replace(/(BECAUSE|BUT|AND)/g, '<strong style="color:#EF4444">$1</strong>');
    var optHTML = item.options.map(function(o) {
      return '<button class="mc-option" onclick="selectMCOption(this,\'conn-err-opts-' + i + '\')">' + o + '</button>';
    }).join('');
    div.innerHTML = '<div class="mc-question">' + (i+1) + '. The red word is wrong: "<em>' + highlighted + '</em>" &mdash; Choose the correct connective:</div>' +
      '<div class="mc-options" id="conn-err-opts-' + i + '">' + optHTML + '</div>';
    container.appendChild(div);
  });
}

function checkConnError() {
  var correct = 0;
  connErrorData.forEach(function(item, i) {
    var opts = document.querySelectorAll('#conn-err-opts-' + i + ' .mc-option');
    opts.forEach(function(btn, j) {
      btn.classList.remove('correct','wrong');
      if (btn.classList.contains('selected')) {
        if (j === item.correct) { btn.classList.add('correct'); correct++; }
        else btn.classList.add('wrong');
      }
      if (j === item.correct) btn.classList.add('correct');
    });
  });
  showResult('conn-error-result', correct, connErrorData.length, {
    success: 'Great detective work! All errors found!',
    partial: 'Keep going! Think about what each sentence means.'
  });
  if (correct >= 3) addScore('connectives', 15, 'conn-error');
}

/* =============================================
   SECTION 3: ZERO CONDITIONAL
   ============================================= */

/* Exercise 1: Multiple Choice */
var zcMCData = [
  { q: 'If it _____ (rain), the streets get wet.',              options: ['rains','rained','will rain','is raining'], correct: 0 },
  { q: 'If people cut trees, the air _____ (become) dirtier.', options: ['became','becomes','will become','becoming'], correct: 1 },
  { q: "Plants _____ (die) if they don't get water.",           options: ['died','dying','die','will die'], correct: 2 },
  { q: 'If you _____ (leave) food outside, animals eat it.',   options: ['left','leaving','leave','will leave'], correct: 2 },
  { q: 'If the temperature _____ (drop), water freezes.',      options: ['dropping','dropped','drop','drops'], correct: 3 }
];

function initZCMC() {
  var container = document.getElementById('zc-mc');
  container.innerHTML = '';
  zcMCData.forEach(function(item, i) {
    var div = document.createElement('div');
    div.className = 'mc-item';
    var optHTML = item.options.map(function(o) {
      return '<button class="mc-option" onclick="selectMCOption(this,\'zc-mc-opts-' + i + '\')">' + o + '</button>';
    }).join('');
    div.innerHTML = '<div class="mc-question">' + (i+1) + '. ' + item.q + '</div>' +
      '<div class="mc-options" id="zc-mc-opts-' + i + '">' + optHTML + '</div>';
    container.appendChild(div);
  });
}

function checkZCMC() {
  var correct = 0;
  zcMCData.forEach(function(item, i) {
    var opts = document.querySelectorAll('#zc-mc-opts-' + i + ' .mc-option');
    opts.forEach(function(btn, j) {
      btn.classList.remove('correct','wrong');
      if (btn.classList.contains('selected')) {
        if (j === item.correct) { btn.classList.add('correct'); correct++; }
        else btn.classList.add('wrong');
      }
      if (j === item.correct) btn.classList.add('correct');
    });
  });
  showResult('zc-mc-result', correct, zcMCData.length, {
    success: 'You understand the zero conditional!',
    partial: 'Remember: use present simple in BOTH parts!'
  });
  if (correct >= 4) addScore('zeroCond', 15, 'zc-mc');
}

/* Exercise 2: Fill in the Blank
   FIX: no duplicate blank text; 'after' field contains only post-blank text */
var zcFillData = [
  { before: 'If people litter, they',            after: 'the environment.',    hint: '(pollute)',  answer: 'pollute' },
  { before: 'Water',                             after: 'if it gets hot enough.', hint: '(evaporate)', answer: 'evaporates' },
  { before: 'If animals lose their habitat, they', after: 'or die.',           hint: '(migrate)',  answer: 'migrate' },
  { before: 'If we recycle, we',                 after: 'the planet.',          hint: '(help)',     answer: 'help' },
  { before: 'Fish',                              after: 'if the river is polluted.', hint: '(die)', answer: 'die' }
];

function initZCFill() {
  var container = document.getElementById('zc-fill');
  container.innerHTML = '<p class="ex-instruction">Write the correct present simple form of the verb shown in brackets.</p>';
  zcFillData.forEach(function(item, i) {
    var div = document.createElement('div');
    div.className = 'fill-sentence';
    div.innerHTML = (i+1) + '. ' + item.before + ' ' +
      '<input class="fill-input" id="zc-fill-' + i + '" type="text" placeholder="..." autocomplete="off" style="width:110px" /> ' +
      item.after + ' <em style="color:#9CA3AF;font-size:0.82rem">' + item.hint + '</em>';
    container.appendChild(div);
  });
}

function checkZCFill() {
  var correct = 0;
  zcFillData.forEach(function(item, i) {
    var input = document.getElementById('zc-fill-' + i);
    input.classList.remove('correct','wrong');
    if (input.value.trim().toLowerCase() === item.answer) {
      input.classList.add('correct'); correct++;
    } else {
      input.classList.add('wrong');
      input.value = item.answer;
    }
  });
  showResult('zc-fill-result', correct, zcFillData.length, {
    success: 'Eco master! All verbs correct!',
    partial: 'Good try! Remember to use present simple.'
  });
  if (correct >= 4) addScore('zeroCond', 15, 'zc-fill');
}

/* Exercise 3: Unscramble
   FIX: words with apostrophes (don't) are stored by index, never placed
        raw inside onclick="..." attributes — avoids HTML attribute breakage */
var zcUnscrambleData = [
  { words: ['If','we','plant','trees,','the','air','becomes','cleaner.'],
    answer: 'If we plant trees, the air becomes cleaner.' },
  { words: ['Animals','die','if','they',"don't",'have','water.'],
    answer: "Animals die if they don't have water." },
  { words: ['If','people','use','cars,','the','air','gets','dirty.'],
    answer: 'If people use cars, the air gets dirty.' }
];

var zcBuilt    = {};   // zcBuilt[i]    = array of shuffled indices in placement order
var zcShuffled = {};   // zcShuffled[i] = the shuffled word array for sentence i

function initZCUnscramble() {
  var container = document.getElementById('zc-unscramble');
  container.innerHTML = '';
  zcUnscrambleData.forEach(function(item, i) {
    zcBuilt[i]   = [];
    zcShuffled[i] = item.words.slice().sort(function() { return Math.random() - 0.5; });

    var div = document.createElement('div');
    div.className = 'unscramble-item';
    div.id = 'zc-uns-' + i;

    var tokenHTML = zcShuffled[i].map(function(w, j) {
      return '<span class="word-token" id="zc-tok-' + i + '-' + j + '" data-si="' + i + '" data-ti="' + j + '">' + w + '</span>';
    }).join('');

    div.innerHTML =
      '<p class="unscramble-prompt">' + (i+1) + '. Build the zero conditional sentence:</p>' +
      '<div class="word-tokens" id="zc-tokens-' + i + '">' + tokenHTML + '</div>' +
      '<div class="answer-area" id="zc-answer-' + i + '"></div>' +
      '<button class="btn-secondary" style="margin-top:0.4rem;font-size:0.8rem;padding:0.3rem 0.8rem" onclick="resetZCUnscramble(' + i + ')">Reset</button>';
    container.appendChild(div);
  });

  /* Attach click listeners AFTER inserting into DOM */
  zcUnscrambleData.forEach(function(item, i) {
    item.words.forEach(function(w, j) {
      var tok = document.getElementById('zc-tok-' + i + '-' + j);
      if (tok) {
        tok.addEventListener('click', (function(si, ti) {
          return function() { placeZCWord(si, ti); };
        })(i, j));
      }
    });
  });
}

function placeZCWord(sIdx, tokIdx) {
  var tok = document.getElementById('zc-tok-' + sIdx + '-' + tokIdx);
  if (!tok || tok.classList.contains('used')) return;
  tok.classList.add('used');

  var word = zcShuffled[sIdx][tokIdx];
  zcBuilt[sIdx].push(tokIdx);

  var area = document.getElementById('zc-answer-' + sIdx);
  var span = document.createElement('span');
  span.className   = 'placed-token';
  span.textContent = word;
  span.dataset.ti  = tokIdx;

  /* Click on placed word to remove it */
  span.addEventListener('click', (function(si, ti, sp) {
    return function() {
      var pos = zcBuilt[si].indexOf(ti);
      if (pos !== -1) zcBuilt[si].splice(pos, 1);
      var t = document.getElementById('zc-tok-' + si + '-' + ti);
      if (t) t.classList.remove('used');
      sp.remove();
    };
  })(sIdx, tokIdx, span));

  area.appendChild(span);
}

function resetZCUnscramble(sIdx) {
  zcBuilt[sIdx] = [];
  document.querySelectorAll('#zc-tokens-' + sIdx + ' .word-token').forEach(function(t) {
    t.classList.remove('used');
  });
  document.getElementById('zc-answer-' + sIdx).innerHTML = '';
  var el = document.getElementById('zc-uns-' + sIdx);
  if (el) el.classList.remove('correct','wrong');
}

function checkZCUnscramble() {
  var correct = 0;
  zcUnscrambleData.forEach(function(item, i) {
    var built = zcBuilt[i].map(function(ti) { return zcShuffled[i][ti]; }).join(' ');
    var el = document.getElementById('zc-uns-' + i);
    el.classList.remove('correct','wrong');
    if (built.toLowerCase().replace(/\s+/g,' ').trim() === item.answer.toLowerCase()) {
      el.classList.add('correct'); correct++;
    } else {
      el.classList.add('wrong');
      var area = document.getElementById('zc-answer-' + i);
      var old  = area.querySelector('.correction-hint');
      if (old) old.remove();
      var hint = document.createElement('span');
      hint.className = 'correction-hint';
      hint.style.cssText = 'color:#EF4444;font-size:0.82rem;display:block;margin-top:0.3rem';
      hint.textContent = 'Correct: ' + item.answer;
      area.appendChild(hint);
    }
  });
  showResult('zc-unscramble-result', correct, zcUnscrambleData.length, {
    success: "Perfect sentences! You're a grammar superstar!",
    partial: 'Almost! Check the order of the IF clause and result.'
  });
  if (correct >= 2) addScore('zeroCond', 15, 'zc-unscramble');
}

/* Exercise 4: Cause-Effect Matching
   FIX: same closure bug fixed as in connectives matching */
var zcMatchData = [
  { cause: 'Factories pollute the air',  effect: 'the temperature rises.' },
  { cause: 'We plant more trees',        effect: 'the air becomes cleaner.' },
  { cause: 'People use too many cars',   effect: 'there is more pollution.' },
  { cause: 'We recycle waste',           effect: 'we protect the environment.' },
  { cause: 'Oceans get warmer',          effect: 'many fish lose their homes.' }
];

var zcMatchSel = null;

function initZCMatch() {
  var container = document.getElementById('zc-match');
  var shuffled  = zcMatchData.slice().sort(function() { return Math.random() - 0.5; });
  var causesHTML = zcMatchData.map(function(item, i) {
    return '<div class="match-item" id="zc-cause-' + i + '" onclick="selectZCMatch(\'cause\',' + i + ')">If ' + item.cause + '...</div>';
  }).join('');
  var effectsHTML = shuffled.map(function(item) {
    var origIdx = zcMatchData.indexOf(item);
    return '<div class="match-item" id="zc-eff-' + origIdx + '" onclick="selectZCMatch(\'effect\',' + origIdx + ')">...' + item.effect + '</div>';
  }).join('');
  container.innerHTML =
    '<div class="match-col" id="zc-causes">'  + causesHTML  + '</div>' +
    '<div class="match-col" id="zc-effects">' + effectsHTML + '</div>';
  zcMatchSel = null;
}

function selectZCMatch(side, id) {
  if (side === 'cause') {
    document.querySelectorAll('#zc-causes .match-item').forEach(function(m) {
      if (!m.classList.contains('matched')) m.classList.remove('selected');
    });
    var el = document.getElementById('zc-cause-' + id);
    if (el && !el.classList.contains('matched')) {
      el.classList.add('selected');
      zcMatchSel = id;
    }
  } else {
    if (zcMatchSel === null) return;
    if (zcMatchSel === id) {
      var s = document.getElementById('zc-cause-' + zcMatchSel);
      var e = document.getElementById('zc-eff-' + id);
      if (s) { s.classList.remove('selected'); s.classList.add('matched'); }
      if (e) e.classList.add('matched');
      zcMatchSel = null;
    } else {
      /* FIX: capture IDs in local variables before setTimeout */
      var wrongCause  = zcMatchSel;
      var wrongEffect = id;
      var ws = document.getElementById('zc-cause-' + wrongCause);
      var we = document.getElementById('zc-eff-'   + wrongEffect);
      if (ws) ws.classList.add('wrong');
      if (we) we.classList.add('wrong');
      setTimeout(function() {
        var wss = document.getElementById('zc-cause-' + wrongCause);
        var wee = document.getElementById('zc-eff-'   + wrongEffect);
        if (wss) wss.classList.remove('wrong','selected');
        if (wee) wee.classList.remove('wrong');
        zcMatchSel = null;
      }, 800);
    }
  }
}

function checkZCMatch() {
  var matched = document.querySelectorAll('#zc-causes .match-item.matched').length;
  showResult('zc-match-result', matched, zcMatchData.length, {
    success: 'Excellent! You understand cause and effect!',
    partial: 'Good start! Try to match the remaining pairs.'
  });
  if (matched >= 4) addScore('zeroCond', 15, 'zc-match');
}

/* =============================================
   SECTION 4: IRREGULAR VERBS (BE & HAVE)
   ============================================= */

/* Exercise 1: Multiple Choice */
var ivMCData = [
  { q: 'She _____ a student in 2022. (past of BE)',          options: ['is','was','were','are'],  correct: 1 },
  { q: 'They _____ very happy yesterday. (past of BE)',      options: ['is','was','were','am'],   correct: 2 },
  { q: 'He _____ a new bicycle now. (present of HAVE)',      options: ['have','had','has','is'],  correct: 2 },
  { q: 'I _____ a dog when I was little. (past of HAVE)',    options: ['have','had','has','is'],  correct: 1 },
  { q: 'We _____ students at this school. (present of BE)',  options: ['was','am','are','is'],    correct: 2 },
  { q: 'She _____ long hair last year. (past of HAVE)',      options: ['have','has','had','is'],  correct: 2 }
];

function initIVMC() {
  var container = document.getElementById('iv-mc');
  container.innerHTML = '';
  ivMCData.forEach(function(item, i) {
    var div = document.createElement('div');
    div.className = 'mc-item';
    var optHTML = item.options.map(function(o) {
      return '<button class="mc-option" onclick="selectMCOption(this,\'iv-mc-opts-' + i + '\')">' + o + '</button>';
    }).join('');
    div.innerHTML = '<div class="mc-question">' + (i+1) + '. ' + item.q + '</div>' +
      '<div class="mc-options" id="iv-mc-opts-' + i + '">' + optHTML + '</div>';
    container.appendChild(div);
  });
}

function checkIVMC() {
  var correct = 0;
  ivMCData.forEach(function(item, i) {
    var opts = document.querySelectorAll('#iv-mc-opts-' + i + ' .mc-option');
    opts.forEach(function(btn, j) {
      btn.classList.remove('correct','wrong');
      if (btn.classList.contains('selected')) {
        if (j === item.correct) { btn.classList.add('correct'); correct++; }
        else btn.classList.add('wrong');
      }
      if (j === item.correct) btn.classList.add('correct');
    });
  });
  showResult('iv-mc-result', correct, ivMCData.length, {
    success: 'You master BE and HAVE! Incredible!',
    partial: 'Review the verb tables and try again!'
  });
  if (correct >= 5) addScore('irrVerbs', 15, 'iv-mc');
}

/* Exercise 2: Fill in the Blank */
var ivFillData = [
  { before: 'I',                       after: 'very excited about the trip.',  hint: '(BE - present)', answer: 'am' },
  { before: 'Yesterday, the students', after: 'tired after the test.',          hint: '(BE - past)',    answer: 'were' },
  { before: 'She',                     after: 'a great teacher.',               hint: '(BE - present)', answer: 'is' },
  { before: 'My friends',              after: 'three dogs.',                    hint: '(HAVE - present)', answer: 'have' },
  { before: 'Last year, he',           after: 'a red bicycle.',                 hint: '(HAVE - past)',  answer: 'had' },
  { before: 'Our school',              after: 'a big playground.',              hint: '(HAVE - present)', answer: 'has' }
];

function initIVFill() {
  var container = document.getElementById('iv-fill');
  container.innerHTML = '';
  ivFillData.forEach(function(item, i) {
    var div = document.createElement('div');
    div.className = 'fill-sentence';
    div.innerHTML = (i+1) + '. ' + item.before + ' ' +
      '<input class="fill-input" id="iv-fill-' + i + '" type="text" placeholder="..." autocomplete="off" style="width:70px" title="' + item.hint + '" /> ' +
      item.after + ' <em style="color:#9CA3AF;font-size:0.82rem">' + item.hint + '</em>';
    container.appendChild(div);
  });
}

function checkIVFill() {
  var correct = 0;
  ivFillData.forEach(function(item, i) {
    var input = document.getElementById('iv-fill-' + i);
    input.classList.remove('correct','wrong');
    if (input.value.trim().toLowerCase() === item.answer) {
      input.classList.add('correct'); correct++;
    } else {
      input.classList.add('wrong');
      input.value = item.answer;
    }
  });
  showResult('iv-fill-result', correct, ivFillData.length, {
    success: 'Superb! All verbs correct!',
    partial: 'Good effort! Check the verb tables again.'
  });
  if (correct >= 5) addScore('irrVerbs', 15, 'iv-fill');
}

/* Exercise 3: Memory Card Game
   FIX: each pair has unique pairId AND requires matching different sides (a/b)
   so cards with similar text (e.g. two 'had') don't falsely match each other */
var memPairs = [
  { a: 'am  (I)',          b: 'was  (I)',        pairId: 0 },
  { a: 'are  (you/we)',    b: 'were  (you/we)',  pairId: 1 },
  { a: 'is  (he/she)',     b: 'was  (he/she)',   pairId: 2 },
  { a: 'have  (I/you)',    b: 'had  (past)',      pairId: 3 },
  { a: 'has  (he/she)',    b: 'had  (past)',      pairId: 4 },
  { a: 'BE  (present)',    b: 'HAVE  (present)', pairId: 5 }
];

var memFlipped = [];
var memMatched = 0;
var memMoves   = 0;
var memLocked  = false;

function initMemoryGame() {
  memFlipped = []; memMatched = 0; memMoves = 0; memLocked = false;
  document.getElementById('memPairs').textContent = 0;
  document.getElementById('memMoves').textContent = 0;

  var cards = [];
  memPairs.forEach(function(pair) {
    cards.push({ text: pair.a, pairId: pair.pairId, side: 'a' });
    cards.push({ text: pair.b, pairId: pair.pairId, side: 'b' });
  });
  cards.sort(function() { return Math.random() - 0.5; });

  var grid = document.getElementById('memory-game');
  grid.innerHTML = '';
  cards.forEach(function(card) {
    var div = document.createElement('div');
    div.className = 'mem-card';
    div.dataset.pairId = card.pairId;
    div.dataset.side   = card.side;
    div.innerHTML =
      '<div class="mem-card-inner">' +
        '<div class="mem-front">?</div>' +
        '<div class="mem-back">' + card.text + '</div>' +
      '</div>';
    div.addEventListener('click', function() { flipMemCard(div); });
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

    var a = memFlipped[0], b = memFlipped[1];
    var sameId   = a.dataset.pairId === b.dataset.pairId;
    var diffSide = a.dataset.side   !== b.dataset.side;

    if (sameId && diffSide) {
      a.classList.add('matched');
      b.classList.add('matched');
      memMatched++;
      document.getElementById('memPairs').textContent = memMatched;
      memFlipped = [];
      memLocked  = false;
      if (memMatched === memPairs.length) {
        showToast('Memory game complete!');
        addScore('irrVerbs', 20, 'memory');
        launchConfetti();
      }
    } else {
      setTimeout(function() {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
        memFlipped = [];
        memLocked  = false;
      }, 900);
    }
  }
}

/* Exercise 4: Story
   FIX: each blank is a separate sentence line; answers displayed clearly */
var ivStoryData = [
  { before: 'My name',       after: 'Tom.',                              hint: '(BE - present, he/she/it)', answer: 'is' },
  { before: 'I',             after: 'ten years old.',                    hint: '(BE - present, I)',         answer: 'am' },
  { before: 'I',             after: 'two brothers.',                     hint: '(HAVE - present, I)',       answer: 'have' },
  { before: 'Last year, we', after: 'a small house.',                    hint: '(HAVE - past)',             answer: 'had' },
  { before: 'My brothers',   after: 'very noisy!',                      hint: '(BE - present, they)',      answer: 'are' },
  { before: 'Yesterday, I',  after: 'sick, but today I am fine.',        hint: '(BE - past, I)',            answer: 'was' }
];

function initIVStory() {
  var container = document.getElementById('iv-story');
  container.innerHTML = '<p class="ex-instruction">Complete each sentence with the correct form of <strong>BE</strong> or <strong>HAVE</strong>. The hint in brackets will help you.</p>';
  ivStoryData.forEach(function(item, i) {
    var div = document.createElement('div');
    div.className = 'fill-sentence';
    div.innerHTML = (i+1) + '. ' + item.before + ' ' +
      '<input class="fill-input" id="iv-story-' + i + '" type="text" placeholder="..." autocomplete="off" style="width:65px" title="' + item.hint + '" /> ' +
      item.after + ' <em style="color:#9CA3AF;font-size:0.82rem">' + item.hint + '</em>';
    container.appendChild(div);
  });
}

function checkIVStory() {
  var correct = 0;
  ivStoryData.forEach(function(item, i) {
    var input = document.getElementById('iv-story-' + i);
    input.classList.remove('correct','wrong');
    if (input.value.trim().toLowerCase() === item.answer) {
      input.classList.add('correct'); correct++;
    } else {
      input.classList.add('wrong');
      input.value = item.answer;
    }
  });
  showResult('iv-story-result', correct, ivStoryData.length, {
    success: 'Great story! You used BE and HAVE perfectly!',
    partial: 'Good job! Check the hints next to each blank.'
  });
  if (correct >= 5) addScore('irrVerbs', 15, 'iv-story');
}

/* =============================================
   INITIALIZATION
   ============================================= */
document.addEventListener('DOMContentLoaded', function() {
  initSeqMC();
  initSeqOrder();
  initSeqFill();
  initSeqTF();

  initConnMC();
  initConnFill();
  initConnMatch();
  initConnError();

  initZCMC();
  initZCFill();
  initZCUnscramble();
  initZCMatch();

  initIVMC();
  initIVFill();
  initMemoryGame();
  initIVStory();

  console.log('English Fun Zone v2 — loaded and ready!');
});
