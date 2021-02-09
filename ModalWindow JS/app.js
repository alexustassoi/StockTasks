let btn = document.querySelector('button');
let modal = document.querySelector('.modal');
let closeBtn = document.querySelector('.closeBtn');


btn.addEventListener('click', function() {
  modal.style.display = 'flex';
});

closeBtn.addEventListener('click', function() {
  modal.style.display = 'none';
});


window.addEventListener('click', function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});