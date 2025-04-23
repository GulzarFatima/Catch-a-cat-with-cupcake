// == DEFINE VARIABLES == //

// select all hole elements
var holes = document.querySelectorAll('.hole');

// DOM elements for score disply 
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
var lastHole = null; // store last hole so cat dont pop up from the same place
var timeUp = false; // time up flag
var score = 0; // player's score
var popInterval = null; // interval to control cat popping
var gameTimer = null; //game timer

// timer DOM and state
var timerEl = document.getElementById('timer');
var timeLeftEl = document.getElementById('time-left');
var countdownInterval; // for updating the timer

// == GET RANDOM TIME BETWEEN MIN AND MAX == //
function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

// == GET RANDOM HOLE, DIFFERENT FROM LAST == //
function randomHole() {

    // Chooses a random hole but makes sure it's not the same as the last one
    var hole;
    var attempts = 0;

  do {
    var idx = Math.floor(Math.random() * holes.length);
    hole = holes[idx];
    attempts++;

    // prevent infinite loop
    if (attempts > 10) break;
    } 
    while (hole === lastHole);

    lastHole = hole;
    return hole;
}

// == POP-UP ONE RANDOM CAT IN ONE HOLE == //
function peep() {

    // if game over, don't contniue popping cats
    if (timeUp) return;

    var hole = randomHole(); // get  a new hole
    var catDiv = hole.querySelector('.cat-container');
    
    catDiv.className = 'cat-container'; // reset

    // Randomly pick a cat type
    var rand = Math.random();
    if (rand < 0.1) {

        catDiv.classList.add('show-bomb');
        soundCupcake.currentTime

    } else if (rand < 0.4) {
        catDiv.classList.add('show-cupcake');

    } else {
        catDiv.classList.add('show-normal');
    }

    // show cat by moving it up
    hole.classList.add('up');

    // hide cat after a short delay
    setTimeout(function () {
        hole.classList.remove('up');
        catDiv.className = 'cat-container';
    }, 
        // visible time between 1-1.4 secs
        randomTime(1000, 1400));
}

// ---- START THE GAME ----
function startGame() {

    //resent game values
    score = 0;
    scoreEl.textContent = score;
    timeUp = false;
    gameOverEl.hidden = true;

    //reset and show timer
    timerEl.hidden = false;
    timeLeftEl.textContent = 60;

   // restart music
   bgMusic.currentTime = 0;
   bgMusic.play();

   // Hide Start button
    startBtn.style.display = 'none';


  // Begin 60 sec countdown timer
    var secondsLeft = 60;
    countdownInterval = setInterval(function () {
        secondsLeft--;
        timeLeftEl.textContent = secondsLeft;
        if (secondsLeft <= 0) {
          clearInterval(countdownInterval);
          endGame(); //call to end game if time over
        }
     },     1000); 

  // Start popping random cats every 700ms
  popInterval = setInterval(peep, 700);
}

// == END GAME == //
// End the game after 60 seconds countdown timer finishes
function endGame() {
    timeUp = true; // stop cat popping
    clearInterval(popInterval); // stop peep() loop
    clearTimeout(gameTimer); // optional safety
    clearInterval(countdownInterval); // stop the timer
  
   // stop bg music 
    if (bgMusic) bgMusic.pause();

    // show gameover overlay
    gameOverEl.hidden = false;

    // show final score
    finalScore.textContent = score;
  }


// == HANDLE CLICKS ON HOLES == //
holes.forEach(function (hole) {
  hole.addEventListener('click', function () {

    var catDiv = hole.querySelector('.cat-container');

    // Game over if bomb is clicked plays bomb sound
    if (catDiv.classList.contains('show-bomb')) {

        soundBomb.currentTime = 0;
        soundBomb.play();

      endGame();
      return;
    }

    // Score 1 point if cupcake cat is clicked plays cupcake soound
    if (catDiv.classList.contains('show-cupcake')) {

        soundCupcake.currentTime = 0;
        soundCupcake.play();

      score++;
      scoreEl.textContent = score;
    }


    // Normal cat → play normal sound only
    if (catDiv.classList.contains('show-normal')) {
        soundNormal.currentTime = 0;
        soundNormal.play();
      }

    // Hide cat immediately after click
    hole.classList.remove('up');
    catDiv.className = 'cat-container';

  });
});

// == BUTTON EVENTS == // 
// Clicking either start or restart runs the game again
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);