window.onload = function() {

  var button = document.querySelector('#toggle-menu');
  var menu = document.querySelector('.navigation');
  if (!button || !menu) return;
  button.addEventListener('click', function() {
    // simple toggle for the example sidebar menu
    menu.classList.toggle('hidden');
  });

};
