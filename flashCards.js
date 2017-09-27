const log = console.log;

const fs = require('fs');
const inquirer = require('inquirer');
const clozeCard = require('./ClozeCard.js');
const plainCard = require('./PlainCard.js');

const userCards = require('./userCards.json');    


let count = 0;
let cardsNum = 0;
let cards = [];

let wins = 0;
let losses = 0;

const printScore = (win, loss)=>{
    log('\nTally:\n',
    'Correct: ', wins,
    '\n Incorrect: ', losses)
}

const quizLogic = ()=>{
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
                log('Correct\n');
                wins ++;
                count ++;    
                quizLogic();
            } else {
                log('\nSorry, the correct answer was:\n ', userCards.cards[count].back);
                count ++;    
                losses ++;
                quizLogic();              
            }
        })
    } else {
        printScore();
    }
}

const numCards = () =>{
    inquirer.prompt([
        {
            type : 'input',
            message : '"How many cards do you\'ll think you need?"',
            // validate: function(){
            //     if (isNaN(value) === false){
            //         return true
            //     } else {
            //         log('\n"Something went wrong with your input? Please try again and confirm."\n');
            //         return false                    
            //         numCards();
            //     }
            // },
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
            log('\n"Something went wrong with your input? Please try again and confirm."\n');
            numCards();
        } else {
            cardsNum = inquirerResponse.cardsNum            
            log('"Got it. We\'ll start you out with '+cardsNum+' cards."\n');
            log('\n"Card Number: 1"');                
            buildCards();            
        }
    })
}
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
                log('\n"Something wrong with your form? Please input again and confirm."\n');
                buildCards();
            } else {
                let newCard = new plainCard (response.front, response.back);
                cards.push(newCard);
                count ++;
                let cardNumber = count + 1;
                if (cardNumber <= cardsNum){
                    log('\n"Card Number: '+cardNumber+'"');    
                }
                buildCards();
            }
        })
    } else {   
        userCards.cards = cards;       
        // log(userCards);                     
        log('\n"Begin Quiz:"\n');
        count = 0;        
        quizLogic();
    }
}

numCards();