let breedToGuess;
let breedToGuessImg;
let clickedBreed;
let points = 0;
let highscore = 0;
let lives = 3;


let regexToIsolateBreedNameOutUrl = /breeds\/(.+)\//;

// const wrongAnswerA = new Image();
// const wrongAnswerB = new Image();
// const wrongAnswerC = new Image();

const pointsSpan = document.querySelector('#points');
const livesSpan = document.querySelector('#lives');
const highscoreSpan = document.querySelector('#highscore');
const breedSpan = document.querySelector('#breedSpan');
const grid = document.querySelector('#grid');
const blockDiv = document.querySelector('#blockdiv');
const endGameDiv = document.querySelector('#endGameDiv');
const wrongSound = document.querySelector('#wrongSound');
const rightSound = document.querySelector('#rightSound');
rightSound.volume = 0.15;
const gameOverSound = document.querySelector('#gameOverSound');
gameOverSound.volume = 0.25;
const highscoreMsg = document.querySelector('#highscoreMsg');
const pointsMsg = document.querySelector('#pointsMsg');

const newGameBtn = document.querySelector('#newGameBtn');
newGameBtn.addEventListener('click', () => {
  points = 0;
  pointsSpan.innerText = points;
  lives = 3;
  livesSpan.innerText = lives;
  resetRound();
  roundLoop();
});

breedSpan.innerText;

const getBreedToGuessUrl = 'https://dog.ceo/api/breeds/image/random';
const getImgOfRandomImgUrl = 'https://dog.ceo/api/breeds/image/random/3';

roundLoop();
function roundLoop(){
  blockDiv.style.zIndex = '1';
  endGameDiv.style.zIndex = '-1';
  getRandomDogBreed()
  .then(() => {
    displayWrongAnswerImg();
    displayWrongAnswerImg();
    displayWrongAnswerImg();
});
}

// functions for right answer
function getRandomDogBreed() {
  return new Promise(resolve => {
    fetch(getBreedToGuessUrl)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        breedToGuess = decideBreedToGuess(data);
        getImgOfBreedToGuess();
      } else {
          console.error('Er is een fout opgetreden bij het ophalen van random dog name.');
        }
      });
    resolve();
  });
}

function decideBreedToGuess(apiData) {
  const decidedBreed = apiData.message.match(regexToIsolateBreedNameOutUrl)[1];
  if (decidedBreed === 'kombai' || decidedBreed === 'cavapoo') {
    getRandomDogBreed();
  } else {
    return decidedBreed;
  }
}

function getImgOfBreedToGuess() {
  let getImgOfBreedToGuessUrl = `https://dog.ceo/api/breed/${breedToGuess}/images`;
  
  fetch(getImgOfBreedToGuessUrl)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        showImageOfBreedToGuess(data);
        breedSpan.innerText = breedToGuess;
      } else {
        getRandomDogBreed();
      }
    });
}

function showImageOfBreedToGuess(apiData) {
  // get random img of breed to guess form api
  highestIndexImgArrOfBreedToGuess = apiData.message.length;
  randomIndexOfBreedToGuess = getRandomNum(0, (highestIndexImgArrOfBreedToGuess + 1));
  // append img to the document
  isValidImageUrl(apiData.message[randomIndexOfBreedToGuess], function(isValid) {
    if(isValid) {
      breedToGuessImg = document.createElement('img');
      breedToGuessImg.src = apiData.message[randomIndexOfBreedToGuess];
      breedToGuessImg.id = decidePosition();
      breedToGuessImg.className = 'imgOption';
      breedToGuessImg.addEventListener('click', selectAnswerListener);
      grid.appendChild(breedToGuessImg);
      blockDiv.style.zIndex = '-1';
    } else {
      getImgOfBreedToGuess();
    }
  })
  
}

function getRandomNum(min, max) {return Math.floor(Math.random() * (max - min) + min)} // max is de exclusieve bovengrens

// functions for wrong answers
function displayWrongAnswerImg() {
    fetch(getImgOfRandomImgUrl)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        let url = data.message[0];
        isValidImageUrl(url, function(isValid) {
          if(isValid) {
            isNotDubbleImage(url, function(isNotDubble) {
              if (isNotDubble) {
                let img = document.createElement('img');
                img.src = url;
                img.className = 'imgOption';
                img.id = decidePosition();
                img.addEventListener('click', selectAnswerListener);
                grid.appendChild(img);
              } else {
                displayWrongAnswerImg();
              } 
            });
          } else {
            displayWrongAnswerImg();
          }
        });
      }
    })
    .catch(error => {
      console.error('Something went wrong with fetching data from the api:', error);
    });
}

function isValidImageUrl(url, callback) {
  let img = new Image();
  img.onload = function() {
    callback(true);
  };
  img.onerror = function() {
    callback(false);
  };
  img.src = url;
}

let availablePositions = ['position1', 'position2', 'position3', 'position4'];

function decidePosition() {
  let result;
  let randomPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
  if (randomPosition === 'position1') {
    let index = availablePositions.indexOf('position1');
    availablePositions.splice(index, 1);
    result = 'topLeft';
  } else if (randomPosition === 'position2') {
    let index = availablePositions.indexOf('position2');
    availablePositions.splice(index, 1);
    result = 'topRight';
  } else if (randomPosition === 'position3') {
    let index = availablePositions.indexOf('position3');
    availablePositions.splice(index, 1);
    result = 'bottomLeft';
  } else {
    let index = availablePositions.indexOf('position4');
    availablePositions.splice(index, 1);
    result = 'bottomRight';
  }
  return result;
}

function isNotDubbleImage(url, callback) {
  const currentImg = document.querySelectorAll('img');
  const imgToCheck = url.match(regexToIsolateBreedNameOutUrl)[1];
  for (let i = 0; i < currentImg.length; i++) {
    let currentBreedToCompair = currentImg[i].src.match(regexToIsolateBreedNameOutUrl)[1];
    if(imgToCheck === currentBreedToCompair) {
      console.log('Prevented double!!!!');
      callback(false);
    }
  }
  callback(true);
}

// give feedback
function selectAnswerListener(event) {
  clickedBreed = event.target.src.match(regexToIsolateBreedNameOutUrl)[1];
  if (breedToGuess === clickedBreed) {
    event.target.classList.add('right');
    points++;
    pointsSpan.innerText = points;
    rightSound.currentTime = 0.35;
    rightSound.play();
    setTimeout(() => {
      resetRound();
      roundLoop();
    }, 1000)
  } else {
    lives--;
    livesSpan.innerText = lives;
    event.target.classList.add('wrong');
    if (lives > 0) {
      wrongSound.currentTime = 1;
      wrongSound.play();
    } else if (lives <= 0) {
      if (points > highscore){highscore = points};
      highscoreMsg.innerText = highscore;
      highscoreSpan.innerText = highscore;
      pointsMsg.innerText = points;
      endGameDiv.style.zIndex = '2';
      gameOverSound.currentTime = 0.5;
      gameOverSound.play();
    }
    
  }
}

function resetRound() {
  blockDiv.style.zIndex = '1';
  const numOfChildEl = grid.children.length;
  for (let i = 0; i < numOfChildEl - 2; i++) {
    grid.removeChild(grid.lastChild);
  }
  availablePositions = ['position1', 'position2', 'position3', 'position4'];
}



