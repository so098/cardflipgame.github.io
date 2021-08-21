const $cardGameArea = document.querySelector('.card-flip__area');
const $successCount = document.querySelector('.success-count');
const $remainCount = document.querySelector('.remain-count');
const $startPopup = document.querySelector('.card-flip__popup__start');
const $startButton = $startPopup.querySelector('.start-button');
const $resultPopup = document.querySelector('.card-flip__popup__result');
const $resultPopupText = document.querySelector('.card-flip__popup__text');
const $resultButton = document.querySelector('.card-flip__popup__button');
const $timer = document.querySelector('.timer');
const frontImages = ['card_sinjjanggu','card_sinjjanggu_teacher','card_sinjjanggu_mom','card_sinjjanggu_dad','card_sinjjanga','card_shiro', 'card_hun','card_action_mask'];
const TIME_LIMIT = 30;
let frontImagesCopy = frontImages.concat(frontImages);
let shuffled = [];
let countSuccess = 0;
let countRemain = frontImages.length;
let timer = undefined;
let restTime;
const ROW = 4;
const COL = 4;
let isStarted = false;
function randomPlayer() {
  while(frontImagesCopy.length > 0){
    const colors = Math.floor(Math.random()*frontImagesCopy.length);
    shuffled = shuffled.concat(frontImagesCopy.splice(colors,1));
  }
}

let id = 0;
function createCardElement() {
  const card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute('data-id',id);
  const front = document.createElement('div');
  front.classList.add('front','item');
  front.setAttribute('data-background',shuffled[id]);
  const back = document.createElement('div');
  back.classList.add('back','item');
  back.setAttribute('data-id',id);
  
  back.style.backgroundImage = `url(./images/${shuffled[id]}.jpg)`;
  card.append(front,back);
  id++;
  return card;
  
}
function startGameTimer() {
  let timeRemainSec = TIME_LIMIT;
  restTime = `00: ${TIME_LIMIT < 10 ? '0' + TIME_LIMIT : TIME_LIMIT}`;
  $timer.textContent = `${restTime} 남았어요`;

  timer = setInterval(() => {
    if(timeRemainSec < 0) {
      showPopupText('괜차나~ 다음번에 다 찾으면 돼~')
      clearInterval(timer);
      return;
    }

    updateTimerText(timeRemainSec--);
  }, 1000);
}

function stopGameTimer() {
  clearInterval(timer);
}

function updateTimerText(time) {
  const min = Math.floor(time / 60);
  const sec = time % 60;
  restTime = `${min< 10 ? '0' + min : min}: ${sec < 10 ? '0' + sec : sec}`;
  $timer.textContent = `${restTime} 남았어요`;
}

$startButton.addEventListener('click',handleStartGame);

function handleStartGame() {
  $startPopup.classList.add('popup-hidden');
  $startButton.classList.remove('transition');
  $cardGameArea.classList.remove('popup-hidden');
  isStarted = true;
  $cardGameArea.textContent = '';
  frontImagesCopy = frontImages.concat(frontImages);
  shuffled = [];
  id = 0;
  countSuccess = 0;
  countRemain = frontImages.length;
  $successCount.textContent = `찾은 가족 : ${countSuccess}명`;
  $remainCount.textContent = `남은 가족 : ${countRemain}명`;
  randomPlayer();
  cardControl();

}

function cardControl() {
  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card-container');
  cardContainer.addEventListener('click',(e)=>{
    console.log(e.target+'front back',e.target.parentNode+'card');
   // e.currentTarget.style.background = '#fce700';
    handleCard(e);
  });
  for (let i = 0; i < ROW*COL; i++) {
    const card = createCardElement();
    cardContainer.append(card);
    
    setTimeout(() => {
      card.classList.add('selected');
      isStarted = false;
    },100+100*i);
    setTimeout(() => {
      card.classList.remove('selected');
      isStarted = true;
    },3000);
  }

  setTimeout(() => {
    startGameTimer();
  },4000);
  
  $cardGameArea.append(cardContainer);
}

const twoTarget = [];
const whileTwo = [];
const doubleClick = [];
function handleCard(e) {
  if (!isStarted || doubleClick.includes(e.target.parentNode.dataset.id) || !e.target.dataset.background) {
    return;
  }

  twoTarget.push(e.target.dataset.background);
  whileTwo.push(e.target.parentNode);
  doubleClick.push(e.target.parentNode.dataset.id)

  e.target.parentNode.classList.add('selected');

  if(twoTarget.length>=2){
    if (twoTarget[0] === twoTarget[1]) {
      countSuccess++;
      console.log('맞춤');

      setTimeout(()=>{
        whileTwo[0].classList.add('selected');
          whileTwo[1].classList.add('selected');
      })
      
    } else if (twoTarget[0] !== twoTarget[1]){
      setTimeout(() => {
        whileTwo[0].classList.remove('selected');
        whileTwo[1].classList.remove('selected');
        console.log('못맞충',whileTwo);
        
      },300)
    }
    isStarted = false;
    setTimeout(() => {
      twoTarget.length = 0;
      whileTwo.length = 0;
      doubleClick.length = 0;
      isStarted = true;
    },400)

  }
  countRemain = frontImages.length - countSuccess;
  $successCount.textContent = `찾은 가족 : ${countSuccess}명`;
  $remainCount.textContent = `남은 가족 : ${countRemain}명`;
  showPopupResult(countRemain);
}
function showPopupResult(countRemain){
  if(countRemain === 0) {
    stopGameTimer();
    setTimeout(()=>{
      showPopupText('그걸 다 찾다니 굉장해 엄청나~!')
    },500);
    
  }
}

function showPopupText(text) {
  $resultPopup.classList.remove('popup-hidden');
  $resultButton.classList.add('transition');
  $resultPopupText.textContent = text;
}

$resultButton.addEventListener('click',()=>{
  $resultPopup.classList.add('popup-hidden');
  $resultButton.classList.remove('transition');
  $timer.textContent = '';
  handleStartGame();
});
