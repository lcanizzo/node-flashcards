// C O N S T A N T S
const log = console.log;

// R E Q U I R E S
const fs = require('fs');
const inquirer = require('inquirer');
const clozeCard = require('./ClozeCard.js');
const plainCard = require('./PlainCard.js');
const userCards = require('./userCards.json');    
const chalk = require('chalk');

// C H A L K   T H E M E S
const error = chalk.bold.red;
const title = chalk.yellow;
const h1 = chalk.magentaBright;
const h2 = chalk.blueBright;
const content = chalk.white;

// V A R I A B L E S
let count = 0;
let cardsNum = 0;
let cards = [];
let wins = 0;
let losses = 0;
let quizType = "";

// F U N C T I O N S

// Print Score
const printScore = (win, loss)=>{
    log(title('\nTally:\n'),
    h1('Correct: '), content(wins),
    h1('\n Incorrect: '), content(losses))
}

// Print Instructions
const printInstructions = ()=>{
    if(quizType == "Cloze Deletion") {
        log(title('\nInstructions for Cloze Deletion Quiz.\n'),
            h1('\n  The front of the card holds a sentence with one word replaced by "blank" or another single-word placeholder\n'),
            title('    -example:\n'),
            '      "Enter front of card (question)."',
                    h2('The blank is the powerhouse of the cell.\n'),
            h1('\n  The back of the card holds the complete sentence to be remembered\n'),
            title('    -example:\n'),
            '      "Enter back of card (answer)."',
                    h2('The mitochondira is the powerhouse of the cell.\n'),
            h1('\n  The Cloze Deletion Quiz only takes one-word answers, but returns the full sentence to be memorized.')
        );
    } else if (quizType == "Basic") {
        log(title('\nInstructions for Basic Quiz.\n'),
            h1('\n  The front of the card holds a sentence with one word missing\n'),
            title('    -example:\n'),
            '      "Enter front of card (question)."',
                    h2('The powerhouse of the cell is the \n'),
            h1('\n  The back of the card holds the single word that fills in the blank\n'),
            title('    -example:\n'),
            '      "Enter back of card (answer)."',            
                    h2('Mitochondira\n'),
            h1('\n  The Basix Quiz only takes one-word answers, and returns one word answers.')       
        );
    } 
}

// Pick Quiz Type
const pickQuiz = ()=>{
    inquirer.prompt([
        {
            type : 'list',
            message : '\nSelect Quiz Type:\n',
            choices : ["Cloze Deletion", "Basic"],
            name : 'quizType'
        },
        {
            type : 'confirm',
            message : '"Confirm quiz selection."',
            name : 'confirm',
            default : true
        }
        ])
        .then(function(result){
            if (!result.confirm){
                log(error('\n"Something wrong with your selection? Please try again and confirm."\n'));  
                pickQuiz();      
            } else {
                if(result.quizType == "Cloze Deletion") {
                    log(h1('\n"Got it. We\'ll use your cards in a Cloze Deletion quiz."\n'));
                    quizType = "Cloze Deletion";
                    numCards();
                } else if (result.quizType == "Basic") {
                    log(h1('\n"Got it. We\'ll use your cards in a Basic quiz."\n'));
                    quizType = "Basic";
                    numCards();
                } else {
                    log(error('\n"Sorry, you need to make a valid selection for quiz type. Please try again and confirm."\n'));
                    pickQuiz();                          
                }
            }
        })
}

// Run Basic Quiz Game
const basicLogic = ()=>{
    if (count < cardsNum){
        inquirer.prompt([
        {
            type : 'input',
            message : '\nQuestion:\n   '+ userCards.cards[count].front,
            name : 'question'
        }
        ])
        .then(function(userResponse){
            let answer = userResponse.question.toUpperCase();
            let correct = userCards.cards[count].back.toUpperCase();
            if(answer == correct){
                log(h1('Correct:\n', content(userCards.cards[count].back)));
                wins ++;
                count ++;    
                basicLogic();
            } else {
                log(h2('\nIncorrect, correct answer:\n ', content(userCards.cards[count].back)));
                count ++;    
                losses ++;
                basicLogic();              
            }
        })
    } else {
        printScore();
    }
}

// Run Cloze Deletion Quiz Game
const clozeLogic = ()=>{
    if (count < cardsNum){
        inquirer.prompt([
        {
            type : 'input',
            message : '\nFill in the "blank":\n   '+ userCards.cards[count].front,
            name : 'question'
        }
        ])
        .then(function(userResponse){
            let arrayA = userCards.cards[count].front.trim().split(" ");
            let arrayB = userCards.cards[count].back.trim().split(" ");
            let cloze = "";
            for (let i=0; i<arrayB.length; i++){
                if (arrayA[i] !== arrayB[i]){
                    cloze = arrayB[i].toUpperCase();
                } 
            }
            let answer = userResponse.question.toUpperCase();
            if(answer == cloze){
                log(h1('Correct:\n', content(userCards.cards[count].back)));
                wins ++;
                count ++;    
                clozeLogic();
            } else {
                log(h2('\nIncorrect, correct answer:\n ', content(userCards.cards[count].back)));
                count ++;    
                losses ++;
                clozeLogic();
            }
        })
    } else {
        printScore();
    }
}

// Choose Number of Cards to Play
const numCards = () =>{
    inquirer.prompt([
        {
            type : 'input',
            message : '"How many cards do you\'ll think you need?"',
            name : 'cardsNum'
        },
        {
            type : 'confirm',
            message : '"Confirm number of cards."',
            name : 'confirm',
            default : true
        }
    ])
    .then(function(inquirerResponse){
        if (!inquirerResponse.confirm){
            log(error('\n"Something wrong with your input? Please try again and confirm."\n'));
            numCards();
        } else {
            cardsNum = inquirerResponse.cardsNum            
            log(h1('\n"Got it. We\'ll start you out with '+cardsNum+' cards."\n'));
            printInstructions();
            log(h1('\n"Card Number: 1"'));                
            buildCards();            
        }
    })
}

// Build Cards
const buildCards = ()=>{
    if (count < cardsNum){
        inquirer.prompt([
            {
                type : 'input',
                message : '"Enter front of card (question)."',
                name : 'front'
            },
            {
                type : 'input',
                message : '"Enter back of card (answer)."',
                name : 'back'
            },
            {
                type : 'confirm',
                message: '"Confirm card inputs."',
                name : 'confirm',
                default : true
            }
        ])
        .then(function(response){
            if (!response.confirm){
                log(error('\n"Something wrong with your form? Please input again and confirm."\n'));
                buildCards();
            } else {
                let newCard = new plainCard (response.front, response.back);
                cards.push(newCard);
                count ++;
                let cardNumber = count + 1;
                if (cardNumber <= cardsNum){
                    log(h1('\n"Card Number: '+cardNumber+'"'));    
                }
                buildCards();
            }
        })
    } else {   
        userCards.cards = cards;       
        log(title('\n"Run Quiz:"\n'));
        count = 0;        
        if(quizType == "Cloze Deletion") {
            log(title('\n"Starting Cloze Deletion Quiz."\n'));
            clozeLogic();
        } else if (quizType == "Basic") {
            log(title('\n"Starting Basic Quiz."\n'));
            basicLogic();
        } 
    }
}

pickQuiz();