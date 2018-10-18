//To handle the modal window

// document.body.onload = playFunc
// function playFunc () {
//   responsiveVoice.speak("Hello Procrastinators, welcome to the secret diary of your dreams!", "UK English Male")
// }

var closer = document.querySelector('.close')
closer.addEventListener('click', () => {
  var toBeClosed = document.querySelector('.modalWindow')
  toBeClosed.style.display = 'none'
})
