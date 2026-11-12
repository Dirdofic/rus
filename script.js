const tasks = [
  {
    type: "choice",
    question: "Выберите правильное написание:",
    content: "пр_вет",
    options: ["и", "е"],
    correct: "и"
  },
  {
    type: "input",
    question: "Вставьте пропущенную букву:",
    content: "к_рова",
    correct: "о"
  },
  {
    type: "stress",
    question: "Нажмите на ударную гласную:",
    content: "звонит",
    correct: 4
  },
  {
    type: "stress",
    question: "Где ударение?",
    content: "торты",
    correct: 0
  }
];

let currentTask = 0;
let selectedOption = null;
let selectedVowelIndex = null;

function loadTask() {
  const task = tasks[currentTask];
  document.getElementById('questionText').textContent = task.question;

  const contentDiv = document.getElementById('content');
  contentDiv.innerHTML = '';

  if (task.type === 'choice') {
    const wordDiv = document.createElement('div');
    wordDiv.className = 'word';
    wordDiv.textContent = task.content;
    contentDiv.appendChild(wordDiv);

    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';

    task.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.onclick = () => selectOption(btn, opt);
      optionsDiv.appendChild(btn);
    });
    contentDiv.appendChild(optionsDiv);
  } else if (task.type === 'input') {
    const wordDiv = document.createElement('div');
    wordDiv.className = 'word';
    wordDiv.textContent = task.content;
    contentDiv.appendChild(wordDiv);

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'answerInput';
    input.placeholder = '?';
    input.oninput = function() {
      selectedOption = this.value;
      document.getElementById('checkBtn').disabled = !this.value;
    };
    contentDiv.appendChild(input);
  } else if (task.type === 'stress') {
    const wordDiv = document.createElement('div');
    wordDiv.className = 'word';

    for (let i = 0; i < task.content.length; i++) {
      const char = task.content[i];
      const span = document.createElement('span');
      span.textContent = char;

      if ('аеёиоуыэюя'.includes(char.toLowerCase())) {
        span.className = 'vowel';
        span.dataset.index = i;
        span.onclick = () => selectVowel(span, i);
      }

      wordDiv.appendChild(span);
    }
    contentDiv.appendChild(wordDiv);
  }

  selectedOption = null;
  selectedVowelIndex = null;
  document.getElementById('checkBtn').disabled = true;
  document.getElementById('task-screen').classList.remove('hidden');
  document.getElementById('result-screen').classList.add('hidden');
}

function selectOption(btn, option) {
  document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedOption = option;
  document.getElementById('checkBtn').disabled = false;
}

function selectVowel(span, index) {
  document.querySelectorAll('.vowel').forEach(v => v.classList.remove('selected'));
  span.classList.add('selected');
  selectedVowelIndex = index;
  document.getElementById('checkBtn').disabled = false;
}

function checkAnswer() {
  const task = tasks[currentTask];
  let isCorrect = false;

  if (task.type === 'choice' || task.type === 'input') {
    let userAnswer = task.type === 'input'
      ? document.getElementById('answerInput').value.trim()
      : selectedOption;
    isCorrect = userAnswer.toLowerCase() === task.correct.toLowerCase();
  } else if (task.type === 'stress') {
    isCorrect = selectedVowelIndex === task.correct;
  }

  const resultDiv = document.getElementById('resultMessage');
  resultDiv.className = isCorrect ? 'correct' : 'incorrect';

  if (task.type === 'stress') {
    const correctWord = task.content.split('');
    correctWord[task.correct] = correctWord[task.correct].toUpperCase();
    resultDiv.innerHTML = isCorrect
      ? '✓ Правильно!'
      : `✗ Ошибка! Правильно: ${correctWord.join('')}`;
  } else {
    resultDiv.innerHTML = isCorrect
      ? '✓ Правильно!'
      : `✗ Ошибка! Правильный ответ: ${task.correct}`;
  }

  document.getElementById('task-screen').classList.add('hidden');
  document.getElementById('result-screen').classList.remove('hidden');
}

function nextTask() {
  currentTask++;
  if (currentTask >= tasks.length) {
    currentTask = 0;
  }
  loadTask();
}

loadTask();
