const display = document.querySelector('.display');
const buttons = document.querySelectorAll('button');

let currentInput = '0';
let previousInput = '';
let operator = null;
let shouldResetScreen = false;

// ===== Sound Function =====
function playClickSound() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.08);

  gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.08);
}

// ===== Button Click Events =====
buttons.forEach(button => {
  button.addEventListener('click', () => {
    handleInput(button.textContent);
  });
});

// ===== Keyboard Support =====
document.addEventListener('keydown', (e) => {
  const key = e.key;

  // Numbers
  if (key >= '0' && key <= '9') {
    handleInput(key);
  }
  // Decimal
  else if (key === '.') {
    handleInput('.');
  }
  // Operators
  else if (key === '+') {
    handleInput('+');
  }
  else if (key === '-') {
    handleInput('−');
  }
  else if (key === '*') {
    handleInput('×');
  }
  else if (key === '/') {
    e.preventDefault(); // browser search prevent
    handleInput('÷');
  }
  // Equals
  else if (key === 'Enter' || key === '=') {
    handleInput('=');
  }
  // Clear
  else if (key === 'Escape' || key.toLowerCase() === 'c') {
    handleInput('C');
  }
  // Percentage
  else if (key === '%') {
    handleInput('%');
  }
});

// ===== Common Input Handler =====
function handleInput(value) {
  playClickSound();

  if (value >= '0' && value <= '9') {
    appendNumber(value);
  } 
  else if (value === '.') {
    appendDecimal();
  } 
  else if (value === 'C') {
    clear();
  } 
  else if (value === '±') {
    toggleSign();
  } 
  else if (value === '%') {
    percentage();
  } 
  else if (value === '=') {
    calculate();
  } 
  else {
    setOperator(value);
  }

  updateDisplay();
}

function appendNumber(number) {
  if (shouldResetScreen) {
    currentInput = number;
    shouldResetScreen = false;
  } else {
    currentInput = currentInput === '0' ? number : currentInput + number;
  }
}

function appendDecimal() {
  if (shouldResetScreen) {
    currentInput = '0.';
    shouldResetScreen = false;
    return;
  }
  if (!currentInput.includes('.')) {
    currentInput += '.';
  }
}

function clear() {
  currentInput = '0';
  previousInput = '';
  operator = null;
  shouldResetScreen = false;
}

function toggleSign() {
  currentInput = (parseFloat(currentInput) * -1).toString();
}

function percentage() {
  currentInput = (parseFloat(currentInput) / 100).toString();
}

function setOperator(op) {
  if (operator !== null && !shouldResetScreen) {
    calculate();
  }
  previousInput = currentInput;
  operator = op;
  shouldResetScreen = true;
}

function calculate() {
  if (operator === null || shouldResetScreen) return;

  const prev = parseFloat(previousInput);
  const current = parseFloat(currentInput);
  let result;

  switch (operator) {
    case '+':
      result = prev + current;
      break;
    case '−':
      result = prev - current;
      break;
    case '×':
      result = prev * current;
      break;
    case '÷':
      result = current === 0 ? 'Error' : prev / current;
      break;
    default:
      return;
  }

  currentInput = result === 'Error' ? 'Error' : parseFloat(result.toFixed(8)).toString();
  operator = null;
  previousInput = '';
  shouldResetScreen = true;
}

function updateDisplay() {
  if (operator && previousInput !== '') {
    display.textContent = `${previousInput}${operator}${shouldResetScreen ? '' : currentInput}`;
  } else {
    display.textContent = currentInput;
  }

  if (display.textContent.length > 14) {
    display.style.fontSize = '1.8rem';
  } else {
    display.style.fontSize = '2.6rem';
  }
}