let breedToGuess;
let breedToGuessImg;

let wrongAnswerA;
let wrongAnswerB;
let wrongAnswerC;

let randomImgAUrl;
let randomImgBUrl;
let randomImgCUrl;

const breedSpan = document.querySelector('#breedSpan');
breedSpan.innerText;

const grid = document.querySelector('#grid');

const getBreedToGuessUrl = 'https://dog.ceo/api/breeds/image/random';
const getImgOfRandomImgUrl = 'https://dog.ceo/api/breeds/image/random/3';

getRandomDogBreed();
getWrongAnswersImgs();

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
  breedToGuessImg = document.createElement('img');
  breedToGuessImg.src = apiData.message[randomIndexOfBreedToGuess];
  breedToGuessImg.id = 'topLeft';
  breedToGuessImg.className = 'imgOption';
  grid.appendChild(breedToGuessImg);
}

function getRandomNum(min, max) {return Math.floor(Math.random() * (max - min) + min)} // max is de exclusieve bovengrens

// functions for wrong answers
function getWrongAnswersImgs() {
  fetch(getImgOfRandomImgUrl)
  .then(response => response.json())
  .then(data => {
    if (data.status === 'success') {
      randomImgAUrl = data.message[0];
      randomImgBUrl = data.message[1];
      randomImgCUrl = data.message[2];
      appendWongAnswers();
    }})
  .catch(error => {
    console.error('Something went wrong with fetching data from the api:', error);
  });
}

function appendWongAnswers() {
  wrongAnswerA = document.createElement('img');
  wrongAnswerA.src = randomImgAUrl;
  wrongAnswerA.id = 'topRight';
  wrongAnswerA.className = 'imgOption';
  grid.appendChild(wrongAnswerA);

  wrongAnswerB = document.createElement('img');
  wrongAnswerB.src = randomImgBUrl;
  wrongAnswerB.id = 'bottomLeft';
  wrongAnswerB.className = 'imgOption';
  grid.appendChild(wrongAnswerB);

  wrongAnswerC = document.createElement('img');
  wrongAnswerC.src = randomImgCUrl;
  wrongAnswerC.id = 'bottomRight';
  wrongAnswerC.className = 'imgOption';
  grid.appendChild(wrongAnswerC);
}

function isValidImageUrl(url) {
  let img = new Image();
  img.onload = function() {
    console.log(true);
  };
  img.onerror = function() {
    console.log(false);
  };
  img.src = url;
}

const timeOut = setTimeout(function() {
  console.log(randomImgAUrl);
  isValidImageUrl(randomImgAUrl)
}, 1000);
