// == DEFINE VARIABLES == //

// select all hole elements
var holes = document.getElementsByClassName('hole');
holes = Array.from(holes); // convert HTMLCollection to array

// DOM elements for score display 
var scoreEl = document.getElementById('score');
var finalScore = document.getElementById('final-score');

// DOM elements for game over overlay and buttons
var gameOverEl = document.getElementById('game-over');
var startBtn = document.getElementById('start-btn');
var restartBtn = document.getElementById('restart-btn');

// audio elements for game sound 
var soundNormal = document.getElementById('sound-normal');
var soundCupcake = document.getElementById('sound-cupcake');
var soundBomb = document.getElementById('sound-bomb');
var bgMusic = document.getElementById('bg-music');

// game state variables
var lastHole = null; // store last hole so cat doesn't pop up from the same place
var timeUp = false; // time up flag
var score = 0; // player's score
var popInterval = null; // interval to control cat popping
var gameTimer = null; // game timer

// timer DOM and state
var timerEl = document.getElementById('timer');
var timeLeftEl = document.getElementById('time-left');
var countdownInterval; // for updating the timer
var secondsLeft = 60; // countdown timer


// == GET RANDOM TIME BETWEEN MIN AND MAX == //
function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

// == GET RANDOM HOLE, DIFFERENT FROM LAST == //
function randomHole() {
  var hole;
  for (var i = 0; i < holes.length; i++) {
    hole = holes[Math.floor(Math.random() * holes.length)];
    if (hole !== lastHole) { // If hole is not the same as last hole, use it
      break;
    }
  }
  lastHole = hole; // Update last hole to avoid repetition
  return hole;
}

// == SHOW CAT IN RANDOM HOLE == //
function showCat() {
  // if game over, don't continue popping cats
  if (timeUp) {
    return;
  }

  var hole = randomHole(); // get a new hole
  if (!hole) return;

  var cat = hole.querySelector('.cat-container');
  cat.className = 'cat-container'; // reset

  // Randomly pick a cat type
  var random = Math.random();
  if (random < 0.1) {
    cat.classList.add('show-bomb');
    soundCupcake.currentTime = 0;
  } else if (random < 0.4) {
    cat.classList.add('show-cupcake');
  } else {
    cat.classList.add('show-normal');
  }

  // show cat by moving it up
  hole.classList.add('up');

  // hide cat after random time
  setTimeout(function() {
    hideCat(hole, cat);
  }, randomTime(1000, 1400));
}

// == HIDE CAT FUNCTION == //
function hideCat(hole, cat) {
  hole.classList.remove('up');
  cat.className = 'cat-container';
}

// == UPDATE TIMER == //
function updateTimer() {
  secondsLeft--;
  timeLeftEl.textContent = secondsLeft;

  if (secondsLeft <= 0) {
    clearInterval(countdownInterval);
    endGame();
  }
}

// == START THE GAME == //
function startGame() {
  // reset game values
  score = 0;
  scoreEl.textContent = score;
  timeUp = false;
  gameOverEl.hidden = true;

  // reset and show timer
  timerEl.hidden = false;
  timeLeftEl.textContent = 60;

  startBtn.style.display = 'none';

  // restart music
  bgMusic.currentTime = 0;
  bgMusic.play();

  // start timer and cat pop-up intervals
  countdownInterval = setInterval(updateTimer, 1000);
  popInterval = setInterval(showCat, 700);
}

// == END GAME == //
// End the game after 60 seconds countdown timer finishes
function endGame() {
  timeUp = true; // stop cat popping
  clearInterval(popInterval); // stop peep() loop
  clearInterval(countdownInterval); // stop the timer

  // stop bg music
  bgMusic.pause();

  // show gameover overlay
  gameOverEl.hidden = false;

  // show final score
  finalScore.textContent = score;
}

// == CAT CLICKS == //
function setupHoleClicks() {
  for (var i = 0; i < holes.length; i++) {
    var hole = holes[i];

    // click function to one hole
    hole.addEventListener('click', function () {
      var cat = this.querySelector('.cat-container');

      // Game over if bomb is clicked plays bomb sound
      if (cat.classList.contains('show-bomb')) {
        soundBomb.currentTime = 0;
        soundBomb.play();
        endGame();
        return;
      }

      // Score 1 point if cupcake cat is clicked plays cupcake sound
      if (cat.classList.contains('show-cupcake')) {
        soundCupcake.currentTime = 0;
        soundCupcake.play();
        score++;
        scoreEl.textContent = score;
      }

      // Normal cat → play normal sound only
      if (cat.classList.contains('show-normal')) {
        soundNormal.currentTime = 0;
        soundNormal.play();
      }

      // Hide cat after click
      hole.classList.remove('up');
      cat.className = 'cat-container';
    });
  }
}

// == BUTTON EVENTS == // 
// Clicking either start or restart runs the game again
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);
setupHoleClicks();
