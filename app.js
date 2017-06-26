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
    guessedRight = [],
    letter;

 function getRandWord(mysterWord){
  let i = Math.floor(Math.random()* words.length);
  mysteryWord = words[i];
  return mysteryWord;
}



function showLtr(guess){

  let upWord = mysteryWord.toUpperCase();
  let word = upWord.split("");


  let index = word.indexOf(guess);
  let letterFound = word[index];
  console.log(letterFound);
  for(let i = 0;i<word.length;i++){

  }
  // word.forEach(function(letter){
  //
  //   letGuessed.push(word[i].indexOf(letter));
  // })
  // let letGuessed = word.indexOf(letter);
  // word.forEach(function(letter){
  //   letGuessed =
  // })

  // console.log(letGuessed);

  // if(index !== -1){
  // alert("You guessed correctly!");
  // letGuessed.push(word[index]);
  // }

  return letGuessed;
}

app.get('/', function(req, res) {
  let underscores;
  if(maxGuesses == 8){
    getRandWord(mysteryWord);
  }

  if(letter){showLtr(letter);}
  // console.log(showLtr("i","Adriinni"));
  res.render("index", {word:mysteryWord,
  hiddenword:underscores,
  guessesLeft:maxGuesses});

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
  mysterWord = " ";
  maxGuesses = 8;
  letGuessed = [];
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("Working hard... Listening on 3000");
});
