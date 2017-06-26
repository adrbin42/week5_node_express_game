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
    mysteryWord = " ",
    hiddenword = [],
    word = [],
    letter;

 function getRandWord(){
  let i = Math.floor(Math.random()* words.length);
  mysteryWord = words[i];
  upWord = mysteryWord.toUpperCase();
  word = upWord.split("");
  return mysteryWord;
}

function showLtr(){
  for(let i = 0;i<word.length;i++){
    if(letter == word[i] ){
      hiddenword.splice(i,1,letter);
    }
  }
  return hiddenword;
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
  };

  res.render("index", {
  word:mysteryWord,
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

});

app.get('/restartApp',function(req,res){
  res.render('restart');
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
