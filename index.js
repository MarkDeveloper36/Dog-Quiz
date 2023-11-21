let breedToGuess;
let breedToGuessImg;

const getBreedToGuessUrl = 'https://dog.ceo/api/breeds/image/random';
const getImgOfByBreedUrl = 'https://dog.ceo/api/breed/hound/images';

getRandomDogBreed();

function getRandomDogBreed() {
  fetch(getBreedToGuessUrl)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        showBreedToGuess(data);
        getImgOfBreedToGuess();
      } else {
          console.error('Er is een fout opgetreden bij het ophalen van random dog name.');
        }
      })
    .catch(error => {
      console.error('Er is een fout opgetreden bij het ophalen van de gegevens:', error);
  });
}

function showBreedToGuess(apiData) {
  const regexToIsolateBreedName = /breeds\/(.+)\//;
  const breedData = apiData.message.match(regexToIsolateBreedName);
  breedToGuess = breedData[1];

  const breedSpan = document.querySelector('#breedSpan');
  breedSpan.innerText = breedToGuess;
}

function getImgOfBreedToGuess() {
  let getImgOfBreedToGuessUrl = `https://dog.ceo/api/breed/${breedToGuess}/images`;
  
  fetch(getImgOfBreedToGuessUrl)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        showImageOfBreedToGuess(data);
      } else {
        console.error('something went wrong with fetching img of dog to guess.');
      }
    })
    .catch(error => {
      console.error('Somthing went wrong witch fetching data of getImgOfBreedToGuessUrl', error);
    })
}

function showImageOfBreedToGuess(apiData) {
  // get random img of breed to guess form api
  highestIndexImgArrOfBreedToGuess = apiData.message.length;
  randomIndexOfBreedToGuess = getRandomNum(0, (highestIndexImgArrOfBreedToGuess + 1));
  // append img to the document
  breedToGuessImg = document.createElement('img');
  breedToGuessImg.src = apiData.message[randomIndexOfBreedToGuess];
  document.body.appendChild(breedToGuessImg);
}

function getRandomNum(min, max) {return Math.floor(Math.random() * (max - min) + min)} // max is de exclusieve bovengrens