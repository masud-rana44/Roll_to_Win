'use strict';

// Selecting elements
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');

const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

let scores, currentScore, activePlayer, playing;
let diceArray = [];

// Starting conditions
const init = function () {
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;
  playing = true;

  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;

  diceEl.classList.add('hidden');
  btnRoll.classList.remove('hidden');
  btnHold.classList.remove('hidden');
  player0El.classList.remove('player--winner');
  player1El.classList.remove('player--winner');
  player0El.classList.add('player--active');
  player1El.classList.remove('player--active');
};
init();

const calcRollTime = function (currentScore) {
  // console.log('Current Score: ', currentScore);
  if (currentScore < 70) {
    const maxValue = Math.floor((100 - currentScore) / 12);

    if (maxValue > 5) return getRandomNumber(1, maxValue);
    else return getRandomNumber(2, 6);
  } else return 4;
};

function getRandomNumber(min, max) {
  return Math.trunc(Math.random() * (max - min + 1)) + min;
}

const randomDice = function (maxNum) {
  return Math.trunc(Math.random() * maxNum) + 1;
};

const randomDiceComputer = function () {
  const zeroOrOne = getRandomNumber(0, 1);
  if (scores[0] - scores[1] > 0 && zeroOrOne === 1) {
    return getRandomNumber(2, 6);
  } else return randomDice(6);
};

// Rolling dice functionality
btnRoll.addEventListener('click', function () {
  if (playing) {
    // 1. Generating a random dice roll
    const dice = randomDice(6);

    // 2. Display dice
    diceEl.classList.remove('hidden');
    diceEl.src = `dice-${dice}.png`;

    // 3. Check for rolled 1
    if (dice !== 1) {
      // Add dice to current score
      currentScore += dice;
      document.getElementById(`current--0`).textContent = currentScore;
    } else {
      btnRoll.classList.add('hidden');
      // Switch to next player
      switchPlayer();
      computerRandomGenerate();
    }
  }
});

btnHold.addEventListener('click', function () {
  btnRoll.classList.add('hidden');
  btnHold.classList.add('hidden');

  if (playing) {
    // 1. Add current score to active player's score
    scores[0] += currentScore;
    // scores[1] = scores[1] + currentScore

    document.getElementById(`score--0`).textContent = scores[0];

    // 2. Check if player's score is >= 100
    if (scores[0] >= 100) {
      window.location.href = '../FinalPage/index.html';

      // Finish the game
      playing = false;
      diceEl.classList.add('hidden');

      document.querySelector(`.player--0`).classList.add('player--winner');
      document.querySelector(`.player--0`).classList.remove('player--active');
    } else {
      // Switch to the next player
      switchPlayer();
      computerRandomGenerate();
    }
  }
});

const computerHold = function () {
  // 1. Add current score to active player's score
  scores[1] += currentScore;
  // console.log('Total of score for computer: ', scores[1]);

  document.getElementById(`score--1`).textContent = scores[1];

  // 2. Check if player's score is >= 100
  if (scores[1] >= 100) {
    window.location.href = '../FinalPage/computer.html';

    // Finish the game
    playing = false;
    diceEl.classList.add('hidden');

    document.querySelector(`.player--1`).classList.add('player--winner');
    document.querySelector(`.player--1`).classList.remove('player--active');
  } else {
    // Switch to the next player
    switchPlayer();
  }
};

const computerRandomGenerate = function () {
  let isOneFound = false;
  let noOfRoll = calcRollTime(scores[1]);
  // console.log('ROLL = ', noOfRoll);

  diceArray = [];

  for (let i = 0; i < noOfRoll; i++) {
    const dice = randomDiceComputer();
    // console.log(`for ${i + 1} itaretion: dice = ${dice}`);
    diceArray.push(dice);
  }
  // console.log('Dice array: ', diceArray);

  for (let i = 0; i < noOfRoll; i++) {
    const timeOut = setTimeout(() => {
      btnRoll.classList.add('hidden');
      btnHold.classList.add('hidden');

      if (scores[1] + currentScore >= 100) {
        window.location.href = '../FinalPage/computer.html';

        playing = false;
        diceEl.classList.add('hidden');

        document.querySelector(`.player--1`).classList.add('player--winner');
        document.querySelector(`.player--1`).classList.remove('player--active');

        score1El.textContent = '100';
      }

      // Display the dice
      diceEl.classList.remove('hidden');
      diceEl.src = `dice-${diceArray[i]}.png`;

      // 3. Check for rolled 1
      if (diceArray[i] !== 1) {
        // Add dice to current score
        currentScore += diceArray[i];
        document.getElementById(`current--1`).textContent = currentScore;
        // console.log(currentScore);
      } else {
        isOneFound = true;
        currentScore = 0;
      }
    }, (i + 1) * 1000);

    if (diceArray.indexOf(1) != -1) {
      const idxOfOne = diceArray.indexOf(1);
      currentScore = 0;
      setTimeout(() => {
        // console.log('Time Out Cleared!');
        clearTimeout(timeOut);
      }, (idxOfOne + 1) * 1000);
    }

    if (isOneFound) {
      currentScore = 0;
      switchPlayer();
      btnRoll.classList.remove('hidden');
      btnHold.classList.remove('hidden');
      break;
    }
  }

  if (!isOneFound) {
    setTimeout(() => {
      btnRoll.classList.remove('hidden');
      btnHold.classList.remove('hidden');
      // console.log('Holding time for computer!');
      computerHold();
    }, noOfRoll * 1000);
  }
};

function switchPlayer() {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0El.classList.toggle('player--active');
  player1El.classList.toggle('player--active');

  // console.log('Active Player: ', activePlayer);
}

btnNew.addEventListener('click', init);
