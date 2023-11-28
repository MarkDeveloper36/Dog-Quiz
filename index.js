let breedToGuess;
let breedToGuessImg;

const wrongAnswerA = new Image();
const wrongAnswerB = new Image();
const wrongAnswerC = new Image();

const breedSpan = document.querySelector('#breedSpan');
breedSpan.innerText;

const grid = document.querySelector('#grid');

const getBreedToGuessUrl = 'https://dog.ceo/api/breeds/image/random';
const getImgOfRandomImgUrl = 'https://dog.ceo/api/breeds/image/random/3';

getRandomDogBreed();
for (let i = 0; i < 3; i++) {
  displayWrongAnswersImgs(i);
}

// functions for right answer
function getRandomDogBreed() {
  fetch(getBreedToGuessUrl)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        decideBreedToGuess(data);
        getImgOfBreedToGuess();
      } else {
          console.error('Er is een fout opgetreden bij het ophalen van random dog name.');
        }
      });
}

function decideBreedToGuess(apiData) {
  const regexToIsolateBreedName = /breeds\/(.+)\//;
  const breedData = apiData.message.match(regexToIsolateBreedName);
  breedToGuess = breedData[1];
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
      grid.appendChild(breedToGuessImg);
    } else {
      getImgOfBreedToGuess();
    }
  })
  
}

function getRandomNum(min, max) {return Math.floor(Math.random() * (max - min) + min)} // max is de exclusieve bovengrens

// functions for wrong answers
function displayWrongAnswersImgs(count) {
    fetch(getImgOfRandomImgUrl)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        let url = data.message[0];
        isValidImageUrl(url, function(isValid) {
          if(isValid) {
            let img = document.createElement('img');
            img.src = url;
            img.className = 'imgOption';
            img.id = decidePosition();
            grid.appendChild(img);
          } else {
            displayWrongAnswersImgs();
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

const availablePositions = ['position1', 'position2', 'position3', 'position4'];

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