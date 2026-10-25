(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');
  const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ01アBCDEFGHIJ0123456789ABCDEF';
  let cols, drops;
  const FONT_SIZE = 14;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / FONT_SIZE);
    drops = new Array(cols).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(2, 12, 5, 0.055)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff66';
    ctx.font = FONT_SIZE + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = CHARS[Math.floor(Math.random() * CHARS.length)];
      ctx.fillText(text, i * FONT_SIZE, drops[i] * FONT_SIZE);
      if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 50);
})();

const input = document.getElementById('password-input');
const toggleBtn = document.getElementById('toggle-btn');
const barFill = document.getElementById('bar-fill');
const scoreNumber = document.getElementById('score-number');
const strengthBadge = document.getElementById('strength-label-badge');
const entropyVal = document.getElementById('entropy-value');
const commonWarn = document.getElementById('common-warning');
const tipsList = document.getElementById('tips-list');
const lengthVal = document.getElementById('length-val');

const criteriaMap = {
  lower: [document.getElementById('c-lower'), document.getElementById('ci-lower')],
  upper: [document.getElementById('c-upper'), document.getElementById('ci-upper')],
  digit: [document.getElementById('c-digit'), document.getElementById('ci-digit')],
  symbol: [document.getElementById('c-symbol'), document.getElementById('ci-symbol')],
  length: [document.getElementById('c-length'), document.getElementById('ci-length')],
};

toggleBtn.addEventListener('click', () => {
  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';
  toggleBtn.textContent = isPassword ? '🙈' : '👁';
});

function scoreColor(score) {
  if (score <= 20) return 'var(--red)';
  if (score <= 40) return 'var(--orange)';
  if (score <= 60) return 'var(--yellow)';
  if (score <= 80) return 'var(--green)';
  return 'var(--bright-green)';
}

function setCriterion(key, ok, okIcon, failIcon) {
  const [box, icon] = criteriaMap[key];
  box.classList.toggle('ok', ok);
  icon.textContent = ok ? okIcon : failIcon;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function applyResult(data) {
  const { score, label, entropy, is_common, criteria, tips } = data;
  const color = scoreColor(score);

  barFill.style.width = score + '%';
  barFill.style.background = color;
  barFill.style.boxShadow = `0 0 12px ${color}`;

  scoreNumber.textContent = score;
  scoreNumber.style.color = color;
  scoreNumber.style.textShadow = `0 0 14px ${color}`;

  strengthBadge.textContent = label;
  strengthBadge.style.color = color;

  entropyVal.textContent = entropy.toFixed(1);

  if (is_common) {
    commonWarn.classList.add('visible');
  } else {
    commonWarn.classList.remove('visible');
  }

  setCriterion('lower', criteria.has_lower, '✅', '❌');
  setCriterion('upper', criteria.has_upper, '✅', '❌');
  setCriterion('digit', criteria.has_digit, '✅', '❌');
  setCriterion('symbol', criteria.has_symbol, '✅', '❌');

  const [lenBox, lenIcon] = criteriaMap.length;
  const lenOk = criteria.length >= 12;
  lenBox.classList.toggle('ok', lenOk);
  lenIcon.textContent = criteria.length >= 8 ? (lenOk ? '✅' : '📏') : '❌';
  lengthVal.textContent = criteria.length + ' car.';

  tipsList.innerHTML = '';
  if (tips.length === 0) {
    const li = document.createElement('li');
    li.innerHTML = '<span class="tip-icon">🌟</span><span>Votre mot de passe est excellent !</span>';
    tipsList.appendChild(li);
  } else {
    tips.forEach((tip, i) => {
      const li = document.createElement('li');
      li.style.animationDelay = (i * 0.06) + 's';
      li.innerHTML = `<span class="tip-icon">💡</span><span>${escapeHtml(tip)}</span>`;
      tipsList.appendChild(li);
    });
  }
}

function resetUI() {
  barFill.style.width = '0%';
  scoreNumber.textContent = '—';
  scoreNumber.style.color = 'var(--glow)';
  scoreNumber.style.textShadow = '0 0 12px var(--glow-dim)';
  strengthBadge.textContent = '—';
  strengthBadge.style.color = 'var(--text-dim)';
  entropyVal.textContent = '—';
  commonWarn.classList.remove('visible');
  lengthVal.textContent = '0 car.';

  ['lower', 'upper', 'digit', 'symbol', 'length'].forEach(k => {
    const [box, icon] = criteriaMap[k];
    box.classList.remove('ok');
    icon.textContent = k === 'length' ? '📏' : '❌';
  });

  tipsList.innerHTML = '<li><span class="tip-icon">💡</span><span class="tips-empty">Commencez à taper pour obtenir des conseils personnalisés…</span></li>';
}

let debounceTimer = null;

async function fetchAnalysis(password) {
  try {
    const res = await fetch('/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) return;
    const data = await res.json();
    applyResult(data);
  } catch (err) {
    console.error('Analyse échouée :', err);
  }
}

input.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  const pw = input.value;
  if (pw.length === 0) {
    resetUI();
    return;
  }
  debounceTimer = setTimeout(() => fetchAnalysis(pw), 300);
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    clearTimeout(debounceTimer);
    const pw = input.value;
    if (pw.length > 0) fetchAnalysis(pw);
  }
});

input.focus();
