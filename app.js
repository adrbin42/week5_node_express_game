const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const fs = require('fs');
const parseurl = require('parseurl');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(express.static('public'));

app.use(session({
  secret: 'winnerswin',
  resave: false,
  saveUninitialized: true
}));

app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set ('view engine', 'mustache');

let maxGuesses = 8,
    mysterWord = " ",
    hiddenword = [],
    ltrGuesses = [],
    word = [],
    letter;

 function getRandWord(){
  let i = Math.floor(Math.random()* words.length);
  mysterWord
 = words[i];
  upWord = mysterWord
.toUpperCase();
  word = upWord.split("");
  return mysterWord
;
}

function showLtr(){
  for(let i = 0;i<word.length;i++){
    if(letter == word[i] ){
      hiddenword.splice(i,1,letter);
    }
  }
  return hiddenword;
}

// function takeAGuess(){
//   let wordGuess = window.prompt('Take a guess at the word!');
//   if(wordGuess == mysterWord){
//
//   }
// }

function youWin(){
  let winner;
  if(hiddenword.indexOf('_ ') == -1){
    winner = true;
  }else if(maxGuesses == 0){
    winner = false;
  }else{
    winner = 'stilltrying';
  }
  return winner;
}

app.get('/', function(req, res) {
  if(maxGuesses == 8){
    getRandWord();
    for(let i = 0;i<word.length;i++){
      hiddenword.push('_ ');
    }
  }
  if(letter){
    showLtr();
    youWin();
  };
  res.render("index", {
  word:mysterWord,
  hiddenwordOutput:hiddenword,
  guessesLeft:maxGuesses
  });
});

app.post('/makeGuess',function(req,res) {
  maxGuesses--;
  if(maxGuesses !== 0){
    res.redirect("/");
  }else{
    res.redirect("/restartApp");
  }
  let charGuess = req.body.ltr_guess;
  letter = charGuess.toUpperCase();
  if(letter){
    ltrGuesses.push(letter + ", ");
  }
});

app.get('/restartApp',function(req,res){
  res.render('restart',{chkIfWin:winner});
});

app.post('/restartApp',function(req,res){
  mysterWord = "";
  maxGuesses = 8;
  hiddenword = [];
  word = [];
  letter = "";
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Working hard... Listening on 3000");
});
