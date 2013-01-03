(function(){

   var apiKey = '68a0ba70fe868d952a8060ab56e0cc25a5d0913f9649e019b';
   var definitionUrl = 'http://api.wordnik.com/v4/word.json/$0/definitions?includeRelated=false&includeTags=false&useCanonical=false&api_key=' + apiKey;
   var alphabet = Array(3).join('abcdefghijklmnopqrstuvwxyz').split('');
   var randAlph = getRandomAlphabet();
   var score = 0;
   var countdown = 366;
   var countdownSpeed = 100;
   var started = false;
   var highestScore = localStorage.getItem('highestScore') || 0;
   var countdownEl, grid, spans, submit, scoreEl, displayListEl, highScoresEl;

   window.onload = function(){
      prepareDom();
      addEventHandlers();
      initGrid();
   };

   function prepareDom(){
      countdownEl = document.getElementsByClassName('countdown')[0];
      grid = document.getElementsByClassName('grid')[0];
      spans = Array.prototype.slice.call(document.querySelectorAll('.grid span'));
      submit = document.getElementsByClassName('submit')[0];
      scoreEl = document.getElementsByClassName('score')[0];
      displayListEl = document.getElementsByClassName('display-list')[0];
   }

   function getRandomAlphabet(){
      return alphabet.sort( function() {
         return 0.5 - Math.random();
      });
   }

   function dictionaryQuery(query){
      var req = new XMLHttpRequest();
      req.open('GET', definitionUrl.replace('$0', query), false);
      req.send();
      if (req.status == 200) {
         if (eval("(" + req.responseText + ")")[0]) {
            onDictionaryQuerySuccess();
         } else {
            onDictionaryQueryFailure();
         }
      }
   }

   function onDictionaryQuerySuccess() {
      var randomAlpha = getRandomAlphabet();
      var selectedSpans = Array.prototype.slice.call(document.querySelectorAll('span.selected'));
      var increment = selectedSpans.length;
      increment *= increment;
      countdown += increment;
      score += increment;
      selectedSpans.forEach(function(el, i){
         el.removeAttribute('class')
         el.setAttribute('class', 'correct');
         setTimeout(function(){
            el.removeAttribute('class')
            el.innerHTML = randomAlpha[i];
         },1000);
      });
      displayListEl.innerHTML = '';
      scoreEl.innerHTML = score;
   }

   function onDictionaryQueryFailure() {
      var selectedSpans = Array.prototype.slice.call(document.querySelectorAll('span.selected'));
      selectedSpans.forEach(function(el){
         el.setAttribute('class', 'incorrect');
      });
      setTimeout(function(){
         selectedSpans.forEach(function(el){
            el.removeAttribute('class');
         });
         displayListEl.innerHTML = "";
      }, 500);
   }

   function onCountdownZero() {
      grid.style.display = 'none';
      submit.style.display = 'none';
      countdownEl.style.display = 'none';
      displayListEl.style.display = 'none';
      if (score > highestScore) {
         localStorage.setItem('highestScore', score);
         scoreEl.innerHTML = 'Congratulations you got the highest score! ' + score;
      } else {
         scoreEl.innerHTML = 'You scored ' + score + ', the highest score is ' + highestScore;
      }
      highScoresEl.innerHTML = 'You scored ' + score;
   }

   function addEventHandlers(){
      submit.addEventListener('click', handleSubmitClick);
      spans.forEach(function(el){
         el.addEventListener('click', handleGridSpanClick);
      });
   }

   function handleSubmitClick() {
      var letters = Array.prototype.slice.call(displayListEl.querySelectorAll('li'));
      var query = '';
      letters.forEach(function(el){
         query += el.innerHTML;
      });
      dictionaryQuery(query);
   }

   function handleGridSpanClick(ev){
      if (!started) {
         initTimer();
         started = true;
      }
      var span = ev.target;
      var letter = span.innerHTML;
      var order = span.getAttribute('data-order');
      var el;
      if (span.className.match('selected')) {
         var el = document.querySelector('li[data-order="' + order + '"]');
         el.parentNode.removeChild(el);
         span.className = '';
      }  else {
         el = document.createElement('li');
         el.setAttribute('data-order', order);
         el.innerHTML = letter;
         displayListEl.appendChild(el);
         span.className = 'selected';
      }
   }

   function initTimer(){
      setInterval(function(){
         countdownEl.querySelector('span').style.bottom = (countdown / 366) * 366 + 'px';
         if (countdown > 0) {
            countdown -= 1;
         } else {
            onCountdownZero();
         }
      }, countdownSpeed);
   }

   function initGrid(){
      spans.forEach(function(el, i) {
         el.innerHTML = randAlph[i];
         el.setAttribute('data-order', i);
      });
   }

})();