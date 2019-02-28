document.addEventListener("DOMContentLoaded", async () => {
   console.log("DOM fully loaded and parsed");


const allPups = await data();
const filterDiv = document.querySelector('#filter-div');
const dogBar = document.querySelector('#dog-bar');
const dogContainer = document.querySelector('#dog-summary-container')
const dogInfo = document.querySelector('#dog-info');


async function data() {
  const response = await fetch(' http://localhost:3000/pups')
  const jsonResponse = await response.json();
  return jsonResponse;
}



const indvidualPup = (pupId) =>  {
  return fetch(` http://localhost:3000/pups/${pupId}`).then(resp => resp.json())
}

const renderDogBar = (pups) => {
  dogBar.innerHTML = pups.map(showDogBar).join('')
}


const showDogBar = (pup) => {
  return (`
    <span class="doggo" data-id="${pup.id}">${pup.name}</span>
    `)
}

dogBar.addEventListener('click', handleShowPup)

function handleShowPup(event) {
  // debugger
  if (event.target.classList.contains('doggo')) {
    const dogId = event.target.dataset.id

    indvidualPup(dogId).then(pups => {
      dogInfo.innerHTML = `<img src=${pups.image}>
      <h2>${pups.name}</h2>
      <button id="btn" data-id="${pups.id}">${pups.isGoodDog}</button>`
      let doggoStatus;
         if(pups.isGoodDog === true) {
        doggoStatus = 'Good Dog!'
      } else {
        doggoStatus = 'Bad Dog'
      }
      const button = document.querySelector('#btn').innerText = `${doggoStatus}`
    })
  }
}

dogInfo.addEventListener('click', handleButton)


function handleButton(event) {
  // debugger
  if (event.target.id === 'btn') {
    const pupId = event.target.dataset.id;


    let pupValue;
    if(event.target.textContent.includes('Good')) {
       event.target.textContent = 'Bad Dog!'
       pupValue = false;
    } else {
      event.target.textContent = 'Good Dog!'
      pupValue = true;
    }
    patchPupsButton(pupId, pupValue).then()
  }

}

const patchPupsButton = (pupId, pupValue) => {
  return fetch(` http://localhost:3000/pups/${pupId}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ isGoodDog: pupValue })
  }).then(resp => resp.json())
}


filterDiv.addEventListener('click', handleFilterDogs)

function handleFilterDogs(event) {
  // debugger
  if(event.target.textContent.includes('OFF')) {
    event.target.textContent = 'Filter good dogs: ON'
    dogBar.innerHTML = ""
      allPups.filter(pup => {
        if (pup.isGoodDog === true) {
          dogBar.innerHTML += showDogBar(pup)
        }
      })
  } else {
    event.target.textContent = 'Filter good dogs: OFF'
    dogBar.innerHTML = ""
    dogBar.innerHTML += allPups.map(showDogBar).join('')
  }
}









renderDogBar(allPups)









 });
