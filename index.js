let breedToGuess;
let breedToGuessImg;
let clickedBreed;

let regexToIsolateBreedNameOutUrl = /breeds\/(.+)\//;

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
  displayWrongAnswerImg();
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
  const breedData = apiData.message.match(regexToIsolateBreedNameOutUrl);
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

setTimeout(function() {
  const imgElements = document.querySelectorAll('img');
  imgElements.forEach(element => {
  element.addEventListener('click', () => {
    let regexMatch = element.src.match(regexToIsolateBreedNameOutUrl);
    clickedBreed = regexMatch[1];
    console.log(clickedBreed);
  })
});
}, 1400) // sometimes  this function is called before the last image is loaded from the api. this can cause the img to be not clickable
