const log = console.log;

const fs = require('fs');
const inquirer = require('inquirer');
const clozeCard = require('./ClozeCard.js');
const plainCard = require('./PlainCard.js');

let count = 0;
let cardsNum = 0;
let cards = [];

const numCards = () =>{
    // Write an empty string to user cards file to clear it
    fs.writeFile('userCards.json', '');                            
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
            log('\n"Got it. We\'ll start you out with '+cardsNum+' cards."\n');
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
                // log(cards);
            }
        })
    } else {
        fs.appendFile('userCards.json', JSON.stringify(cards));                        
        log('\n"Form complete."\n');
    }
}

numCards();