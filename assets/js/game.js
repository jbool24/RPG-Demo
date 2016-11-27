// Modify this list to change Characters and their image url----------------
const playerNames = [{
    "name": "Thor",
    "url": "assets/images/thor.jpg"
}, {
    "name": "Hulk",
    "url": "assets/images/hulk.jpg"
}, {
    "name": "Daredevil",
    "url": "assets/images/daredevil.jpg"
}, {
    "name": "Spider Man",
    "url": "assets/images/spiderMan.jpg"
}];
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
//--------------------------------------------------------------------------
//---GAME LOGIC-----------------------------------------------------------------
$(document).ready(function() {

    //Welcome dialog with diections
    showDialog("Welcome to MegaBattle", "Hello and welcome to the MegaBattle arena. \
    Today you will face some challenging opponents. \
    Your objective is to fight each opponent until you are the champion. \
    Careful though, your Health Points do not renew so you will have to choose \
    your opponets wisely. Good luck. Click the button to begin.");

    $("#dialog-message").dialog({
        modal: true,
        width: 800,
        height: 600,
        buttons: {
            "Let's Play": function() {
                gameBattle.init(); // main game function call here
                $(this).dialog("close");
            }
        }
    });

    // Fight until you or opponent dies if you die game over

    //Loop back and pick next opponent unless they are gone then you win
});

//Dialog Factory and show function
function showDialog(title, strMsg) {
    let message = "<div id='dialog-message' title='" + title + "'><p>" + strMsg + "</p></div>"
    $("#gameboard").append(message);
}

let gameBattle = {
    fighter: {},
    defenders: [],
    currentDefender: {},
    battle: "",
    characters: [],

    init: function() {
        // TODO play battle music
        this.battle = new Battle();
        this.characters = createCharacters(playerNames);
        this.drawboard();

        // Add Fighter Card click eventListener
        $(".fighter").on("click", function() {
            console.log("Clicked " + this.id);
            if (Object.keys(gameBattle.fighter).length === 0) {
                gameBattle.assignFighter(getCharacter(this.id));
            } else if (Object.keys(gameBattle.currentDefender).length === 0) {
                gameBattle.assignDefender(getCharacter(this.id));
                gameBattle.startBattle();
            }
        });

    }, //End Start

    startBattle: function() {

        if (gameBattle.currentDefender !== "" && gameBattle.fighter !== "") {
            gameBattle.showAttackButton();
            // Attack eventListener
            $(".btn-attack").on("click", function() {
                // attack: play fight soundbite
                // call getHit on fighter toggle getHit defender
                getCharacter(gameBattle.fighter);
                if (gameBattle.currentDefender.healthPoints === 0) {
                    $(".defender").addClass("hide");
                }
            });
        }
    },

    reset: function() {
        gameBattle.battle.reset();
    },

    drawboard: function() {
        for (var i = 0; i < this.characters.length; i++) {
            let gbChars = this.characters;

            let fighterCard = $("<div>").addClass("fighter drop-shadow");
            let anchorWrapper = $("<a>").attr("href", "#");
            let fighterImg = $("<img>").attr("src", gbChars[i].picURL);
            let fighterStats = "<ul><li class='text-center'>" + gbChars[i].name + "</li><li>Health:<span>" + gbChars[i].healthPoints + "</span><i class='fa fa-heart'></i></li><li>Attack:<span>" + gbChars[i].attackPower + "</span><i class='fa fa-bolt'></i></li></ul>";

            fighterCard.attr("id", gbChars[i]._id);
            fighterCard.append(anchorWrapper);
            anchorWrapper.append(fighterImg);
            fighterCard.append(fighterStats);

            //Add the character card to the characterFrame
            $(".characterFrame").append(fighterCard);
        }
    },

    assignFighter: function(fighter) {
        gameBattle.fighter = fighter;
        $("#" + gameBattle.fighter._id).appendTo(".battleFrame");
    },

    assignDefender: function(defender) {
        gameBattle.currentDefender = defender;
        $("#" + gameBattle.currentDefender._id).removeClass("fighter").addClass("defender");

        for (var i = 0; i < gameBattle.characters.length; i++) {
            gameBattle.defenders.push(gameBattle.characters[i]._id);
        };

        $("#" + gameBattle.currentDefender._id).appendTo(".battleFrame");
    },

    showAttackButton: function() {
        let attackButton = $("<button>").addClass("btn-attack");
        attackButton.html("Attack!!")
        attackButton.insertAfter($("#" + gameBattle.fighter._id));
    }

}; //End gameBattle object

//Getter for Chracter Object
function getCharacter(character_id) {
    let result = gameBattle.characters.filter(function(obj) {
        return obj._id === character_id;
    });
    return result[0];
}

//####### CHARACTER FACTORY ####################################################
// function to create new characters and then add it to the characters array
function createCharacters(namesArray) {
    let characters = [];

    for (var i = 0; i < namesArray.length; i++) {

        let randomAttack = Math.floor(Math.random() * 4) + 2;
        let randomHealth = Math.floor(Math.random() * 100) + 1;

        //Create a new character for each name in local array;
        let newCharacter = new Character("fighter-" + i, namesArray[i].name, 1, randomHealth, randomAttack, namesArray[i].url);

        characters.push(newCharacter);
    }
    return characters;
};

//Character object constructor
function Character(id, name, team, hp, ap, picURL) {
    this._id = id;
    this.name = name;
    this.team = team || 1; // 0:hero || 1:villan
    this.healthPoints = hp;
    this.attackPower = ap;
    this.attackBase = ap;
    this.counterAttackPower = ap || 4;
    this.picURL = picURL;

    this.do_attack = function attack() {
        return this.attackPower;
    };

    this.getHit = function getHit(attackPower) {
        this.healthPoints -= attackPower;
    };

    this.experienceBoost = function experienceBoost() {
        this.attackPower *= this.attackBase; //increase attack power by base
    };
};
//############### END CHARACTER FACTORY ########################################


// Battle object constructor
function Battle(_id, fighter, defenders) {
    this.battle_id = _id || 1;
    this.fighter = fighter || "";
    this.defenders = defenders || [];

    this.scoreBoard = new ScoreBoard();

    this.reset = function() {
        alert("Game Reset");
        console.log("Game Reset");
    };
};

// ScoreBoard constructor
function ScoreBoard(id) {
    this.battle_id = id || 0;
    this.winner = "";
    this.losers = [];
};
