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

    let startGame = function (){
      gameBattle.init();
    }

    //Welcome dialog with diections
    showDialog("Welcome to MegaBattle",
        "Hello and welcome to the MegaBattle arena. " +
        "Today you will face some challenging opponents. " +
        "Your objective is to fight each opponent until you are the champion. " +
        "Careful though, your Health Points do not renew so you will have to choose your opponets wisely. Good luck. Click the button to begin.",
        "Let's Play", // Button text
        startGame() // On Click
    );

    // Fight until you or opponent dies if you die game over

});

//Dialog Factory and show function
function showDialog(title, strMsg, btnText, action) {
    let message = "<div id='dialog-message' title='" + title + "'><p>" + strMsg + "</p></div>"
    $("#gameboard").append(message);
    $("#dialog-message").dialog({
        modal: true,
        width: 800,
        height: 600,
        buttons: [{
            text: btnText,
            click: function() {
                action; // main game function call here
                $(this).dialog("close");
            }
        }]
    });
}

let gameBattle = {
    fighter: {},
    defenders: [],
    currentDefender: {},
    battle: "",
    characters: [],

    init: function() {
      console.log("called init");
        // TODO play battle music
        this.battle = new Battle();
        this.characters = createCharacters(playerNames);
        this.drawboard();
        gameBattle.updateMessageBoard("OK, Choose your Fighter!!");
        // Add Fighter Card click eventListener
        $(".fighter").on("click", function() {
            console.log("Clicked " + this.id);
            if (Object.keys(gameBattle.fighter).length === 0) {
                gameBattle.assignFighter(getCharacter(this.id));
                gameBattle.fighter.team = 0;
                gameBattle.updateMessageBoard("OK, Choose you opponent.");
            } else if (Object.keys(gameBattle.currentDefender).length === 0) {
                gameBattle.assignDefender(getCharacter(this.id));
                gameBattle.startBattle();
            }
        });

    }, //End Start

    startBattle: function() {
        let defenderHP = gameBattle.currentDefender.healthPoints;
        let fighterHP = gameBattle.fighter.healthPoints;

        if (gameBattle.currentDefender !== "" && gameBattle.fighter !== "") {
            gameBattle.updateMessageBoard("OK, FIGHT!!");
            gameBattle.showAttackButton();
            // Attack eventListener for attacks
            $(".btn-attack").on("click", function() {
                // attack: play fight soundbite

                // call getHit on defender toggle getHit defender
                gameBattle.currentDefender.getHit(gameBattle.fighter.do_attack());
                // Give fighter experienceBoost to increase attack then take hit from defender
                gameBattle.fighter.experienceBoost();
                gameBattle.fighter.getHit(gameBattle.currentDefender.do_attack());

                //Update the fighters Stats
                gameBattle.updateStats();

                if (gameBattle.fighter.healthPoints <= 0) {
                    for (var i = 0; i < gameBattle.characters.length; i++) {
                        $("#" + gameBattle.characters[i]._id).remove();
                    };
                    gameBattle.reset();
                };

                if (gameBattle.currentDefender.healthPoints <= 0) {
                    gameBattle.updateDefenders(gameBattle.currentDefender);
                    gameBattle.currentDefender = {};
                    $(".defender").addClass("hide");
                    gameBattle.hideAttackButton();
                    gameBattle.updateMessageBoard("OK, Choose another opponent.");
                };

                if (gameBattle.defenders.length === 0) {
                    gameBattle.updateMessageBoard("YOU ARE THE WINNER.");
                };

            });
        }
    },

    reset: function() {
        console.log("Called gameBattle.reset");
        $(".fighter").remove();
        $(".defender").remove();
        showDialog("LOSER", "Yea So you lost", "Replay?", gameBattle.init());
        // gameBattle.updateMessageBoard("YOU LOOSE!!");
        //
        // let button = $("<button>").addClass("btn-restart").html("Replay?");
        // button.on("click", function() {
        //     gameBattle.init();
        // });
        // button.appendTo(".battleFrame");
        gameBattle.battle.reset();
    },

    drawboard: function() {
        for (var i = 0; i < this.characters.length; i++) {
            let gbChars = this.characters;

            let fighterCard = $("<div>").addClass("fighter drop-shadow");
            let anchorWrapper = $("<a>").attr("href", "#");
            let fighterImg = $("<img>").attr("src", gbChars[i].picURL);
            let fighterStats = "<ul><li class='text-center'>" + gbChars[i].name + "</li><li class='health'>Health:<span>" + gbChars[i].healthPoints + "</span><i class='fa fa-heart'></i></li><li class='attack'>Attack:<span>" + gbChars[i].attackPower + "</span><i class='fa fa-bolt'></i></li></ul>";

            fighterCard.attr("id", gbChars[i]._id);
            fighterCard.append(anchorWrapper);
            anchorWrapper.append(fighterImg);
            fighterCard.append(fighterStats);

            //Add the character card to the characterFrame
            $(".characterFrame").append(fighterCard);
        }
    },

    updateStats: function() {
        $(".offender>ul>li.health").find("span").text(gameBattle.fighter.healthPoints);
        $(".offender>ul>li.attack").find("span").text(gameBattle.fighter.attackPower);
        $(".defender>ul>li.health").find("span").text(gameBattle.currentDefender.healthPoints);
    },

    updateMessageBoard: function(msgStr) {
        $(".message-board").text(msgStr);
    },

    assignFighter: function(fighter) {
        gameBattle.fighter = fighter;
        $("#" + gameBattle.fighter._id).addClass("offender");
        $("#" + gameBattle.fighter._id).appendTo(".battleFrame");
    },

    assignDefender: function(defender) {
        gameBattle.currentDefender = defender;
        $("#" + gameBattle.currentDefender._id).removeClass("fighter").addClass("defender");

        if (gameBattle.defenders.length === 0) {
            for (var i = 0; i < gameBattle.characters.length; i++) {

                if (gameBattle.characters[i].team === 1) {
                    gameBattle.defenders.push(gameBattle.characters[i]);
                }
            }
        };

        $("#" + gameBattle.currentDefender._id).appendTo(".battleFrame");
    },

    updateDefenders: function(defender) {
        let result = gameBattle.defenders.filter(function(obj) {
            return obj._id !== defender._id;
        })
        gameBattle.defenders = result;
    },

    showAttackButton: function() {
        let attackButton = $("<button>").addClass("btn-attack");
        attackButton.html("Attack!!")
        attackButton.insertAfter($("#" + gameBattle.fighter._id));
    },

    hideAttackButton: function() {
        $(".btn-attack").remove();
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
        let randomHealth = Math.floor(Math.random() * 100) + 10;

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
        return this.healthPoints;
    };

    this.experienceBoost = function experienceBoost() {
        this.attackPower += this.attackBase; //increase attack power by base
        return this.attackPower;
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
        console.log("Called Battle Reset");
    };
};

// ScoreBoard constructor
function ScoreBoard(id) {
    this.battle_id = id || 0;
    this.winner = "";
    this.losers = [];
};
