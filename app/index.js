const $cardGameArea = document.querySelector('.card-flip__area');
const $successCount = document.querySelector('.success-count');
const $remainCount = document.querySelector('.remain-count');
const $startPopup = document.querySelector('.card-flip__popup__start');
const $startButton = $startPopup.querySelector('.start-button');
const $resultPopup = document.querySelector('.card-flip__popup__result');
const $resultPopupText = document.querySelector('.card-flip__popup__text');
const $resultButton = document.querySelector('.card-flip__popup__button');
const $timer = document.querySelector('.timer');

const TIME_LIMIT = 30;
const ROW = 4;
const COL = 4;
const POPUP_HIDDEN = 'popup-hidden';
const SELECTED = 'selected';
const TRANSITION = 'transition';
const selectCurrentBackground = [];
const selectCurrentCard = [];
const doubleClick = [];
const frontImages = [
  'card_sinjjanggu',
  'card_sinjjanggu_teacher',
  'card_sinjjanggu_mom',
  'card_sinjjanggu_dad',
  'card_sinjjanga',
  'card_shiro', 
  'card_hun',
  'card_action_mask',
];

let frontImagesCopy = frontImages.concat(frontImages);
let shuffled = [];
let countSuccess = 0;
let countRemain = frontImages.length;
let timer = undefined;
let restTime;
let isStarted = false;

const soundStart = document.querySelector('.start-sound');
const soundProgress = document.querySelector('.progress-sound');
const soundWin = document.querySelector('.win-sound');
const soundLose = document.querySelector('.lose-sound');

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}

function randomPlayer() {
  while(frontImagesCopy.length > 0){
    const colors = Math.floor(Math.random() * frontImagesCopy.length);
    shuffled = shuffled.concat(frontImagesCopy.splice(colors, 1));
  }
}

let id = 0;

function createCardElement() {
  const card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute('data-id', id);
  const front = document.createElement('div');
  front.classList.add('front','item');
  front.setAttribute('data-background', shuffled[id]);
  const back = document.createElement('div');
  back.classList.add('back', 'item');
  back.setAttribute('data-id', id);
  back.style.backgroundImage = `url(./images/${shuffled[id]}.jpg)`;
  card.append(front, back);
  id++;
  return card;
}

function startGameTimer() {
  let timeRemainSec = TIME_LIMIT;
  restTime = `00: ${TIME_LIMIT < 10 ? '0' + TIME_LIMIT : TIME_LIMIT}`;
  $timer.textContent = `${restTime} 남았어요`;
  timer = setInterval(() => {
    if(timeRemainSec < 0) {
      showPopupText('제대로 하세요!!');
      playSound(soundLose);
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
  restTime = `${min < 10 ? '0' + min : min}: ${sec < 10 ? '0' + sec : sec}`;
  $timer.textContent = `${restTime} 남았어요`;
}

$startButton.addEventListener('click',handleStartGame);

function handleStartGame() {
  playSound(soundStart);
  $startPopup.classList.add(POPUP_HIDDEN);
  $startButton.classList.remove(TRANSITION);
  $cardGameArea.classList.remove(POPUP_HIDDEN);
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
  for (let i = 0; i < ROW*COL; i++) {
    const card = createCardElement();
    cardContainer.append(card);
    card.addEventListener('click',handleCardFlip);

    setTimeout(() => {
      card.classList.add(SELECTED);
      isStarted = false;
    }, 100 + 100 * i);

    setTimeout(() => {
      card.classList.remove(SELECTED);
      isStarted = true;
    }, 3000);

  }

  setTimeout(() => {
    startGameTimer();
    playSound(soundProgress);
  }, 4000);
  
  $cardGameArea.append(cardContainer);
}

function handleCardFlip(e) {
  const targetBackground = e.target.dataset.background;
  const currentTarget = e.currentTarget;
  const currentTargetId = e.currentTarget.dataset.id;
  const hasClickedCard = doubleClick.includes(currentTargetId);
  if (!isStarted || hasClickedCard || !targetBackground) {
    return;
  }

  selectCurrentBackground.push(targetBackground);
  selectCurrentCard.push(currentTarget);
  doubleClick.push(currentTargetId);

  currentTarget.classList.add(SELECTED);

  if(selectCurrentBackground.length >= 2){
    if (selectCurrentBackground[0] === selectCurrentBackground[1]) {
      countSuccess++;

      setTimeout(()=>{
        selectCurrentCard[0].classList.add(SELECTED);
        selectCurrentCard[1].classList.add(SELECTED);
      })
      
    } else if (selectCurrentBackground[0] !== selectCurrentBackground[1]){
      setTimeout(() => {
        selectCurrentCard[0].classList.remove(SELECTED);
        selectCurrentCard[1].classList.remove(SELECTED);
        
      },300)
    }

    isStarted = false;
    setTimeout(() => {
      selectCurrentBackground.length = 0;
      selectCurrentCard.length = 0;
      doubleClick.length = 0;
      isStarted = true;
    }, 400)

  }
  countRemain = frontImages.length - countSuccess;
  $successCount.textContent = `찾은 가족 : ${countSuccess}명`;
  $remainCount.textContent = `남은 가족 : ${countRemain}명`;
  showPopupResult(countRemain);
}

function showPopupResult(countRemain) {
  if (countRemain === 0) {
    stopGameTimer();
    setTimeout(() => {
      showPopupText('이겼다 나의승리~~');
      playSound(soundWin);
    },500);
    
  }
}

function showPopupText(text) {
  $resultPopup.classList.remove(POPUP_HIDDEN);
  $resultButton.classList.add(TRANSITION);
  $resultPopupText.textContent = text;
  stopSound(soundProgress);
}

$resultButton.addEventListener('click', () => {
  $resultPopup.classList.add(POPUP_HIDDEN);
  $resultButton.classList.remove(TRANSITION);
  $timer.textContent = '';
  handleStartGame();
});
