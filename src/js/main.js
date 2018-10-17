import './vendor/modernizr-3.6.0.min';
import './plugins.js';
import '../css/normalize.css';
import '../css/main.css';

var forEach = function(array, callback, scope) {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]); // passes back stuff we need
  }
};

// Usage:
// optionally change the scope as final parameter too, like ECMA5
var link = document.querySelectorAll('.input');
forEach(link, function(index, value) {
  value.addEventListener('focus', function() {
    value.parentElement.classList.add('focus');
  });
  value.addEventListener('blur', function() {
    value.parentElement.classList.remove('focus');
  });
});
