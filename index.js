const randomBreedUrl = 'https://dog.ceo/api/breeds/image/random';
let breedToGuess;

window.onload(getRandomDogBreed());

function getRandomDogBreed() {
  fetch(randomBreedUrl)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        showBreedToGuess(data);
      } else {
          console.error('Er is een fout opgetreden bij het ophalen van de afbeeldingen.');
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

  const h1 = document.querySelector('#h1');
  h1.innerText = 'Which one is the ' + breedToGuess + '?';
}