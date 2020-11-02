import React, { useCallback, useEffect, useState } from "react";
import Player from "./Player";
import dacards from "./allCards/cards";

//randomize who goes first
const turnCoinFlip = () => Math.floor(Math.random() * 2) + 1;

const Game = () => {
  //set initial player and computer states
  //needed to separate into multiple useStates to be able to change specific things without triggering all useEffects that depends on player or computer
  //can separate now to depend on just the computerDeck instead of all of computer

  const [player, setPlayer] = useState({
    deck: [],
    health: 20,
    mana: 1,
    maxMana: 0,
    hand: [],
    board: [],
    isActive: false,
  });

  const [computer, setComputer] = useState({
    deck: [],
    health: 20,
    mana: 1,
    maxMana: 0,
    hand: [],
    board: [],
    isActive: false,
  });

  //takes coinflip and determines the starting "currentTurn" which decides which player starts
  const [currentTurn, setCurrentTurn] = useState(turnCoinFlip());

  //shuffle deck function
  const shuffleDeck = (deck) => {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  };

  //set starting state of decks to shuffled array of all cards based on elements of which deck they belong to
  //and deal first card to starting player determined by coinflip function
  useEffect(() => {
    let playerCards = shuffleDeck(
      dacards.filter((card) => card.element === "deck1")
    );
    let newPlayerHand = [];
    for (let i = 0; i < 3; i++) {
      newPlayerHand.push(playerCards.pop());
    }

    player.hand = newPlayerHand;
    player.deck = playerCards;

    let computerCards = shuffleDeck(
      dacards.filter((card) => card.element === "deck2")
    );
    let newComputerHand = [];
    for (let i = 0; i < 3; i++) {
      newComputerHand.push(computerCards.pop());
    }

    computer.hand = newComputerHand;
    computer.deck = computerCards;

    if (currentTurn === 1) {
      player.isActive = true;
    } else {
      computer.isActive = true;
    }

    setComputer({ ...computer });
    setPlayer({ ...player });
  }, []);

  // useEffect takes 2 params, the callback function and the "dependency array"
  // the array of variables the function depends on
  // empty array means it will only run the first time the component is rendered
  // if we pass something in the dependency array, the callback will run if that values has changed since the last render
  // if we pass player in the dependency array, it will check if it has changed since the previous render

  //deal card
  const dealCardForPlayer = (player) => {
    //look into coupling
    let cardDealt = player.deck.pop();
    player.hand.push(cardDealt);
  };

  const playCardForPlayer = (player, cardpos) => {
    console.log(player);
    console.log(cardpos);
    //structure conditions for stuff that will not allow code to run first
    //return early for conditional so we know immediately and dont have to look at rest of code
    if (player.hand[cardpos].cmc > player.mana) {
      alert("Not Enough Mana");
      return;
    }
    let cardPlay = player.hand.splice(cardpos, 1);
    // socket.io test case
    player.board.push(cardPlay[0]);
    player.mana -= cardPlay[0].cmc;
  };
  //end turn function to change actionable player

  //run playerStartTurn for players at endPlayerTurn
  //should have the mana reset line
  //change drawTurn to 0
  //isActive used for faceup/facedown

  const playerStartTurn = (nextPlayer, currentPlayer) => {
    dealCardForPlayer(nextPlayer);
    currentPlayer.isActive = false;
    nextPlayer.isActive = true;
    nextPlayer.maxMana = nextPlayer.maxMana + 1;
    nextPlayer.mana = nextPlayer.maxMana + 1;
    console.log("a;woehoiaweg;oawhegiew");
    if (currentTurn === 1) {
      setCurrentTurn(2);
    } else {
      setCurrentTurn(1);
    }
  };
  //run computer logic at the end of endPlayerTurn()
  const restartGame = () => {
    window.location.reload();
  };
  const checkWin = (player1health, computer1health) => {
    if (player1health <= 0) {
      alert("Computer wins!");
      restartGame();
    } else if (computer1health <= 0) {
      alert("Player wins!");
      restartGame();
    }
  };
  const attackCard = (attacker, defender) => {
    //sum power on board
    //starts with 0, adds card.power from first card, and then sets that to acc for the next iteration
    let sum = attacker.board.reduce((acc, card) => acc + card.power, 0);
    console.log(sum);
    defender.health -= sum;
  };

  //separate useEffect runs when currentTurn changes (computer turn stuff)
  useEffect(() => {
    console.log("player", player);
    console.log("computer", computer);
    if (currentTurn === 2) {
      // console.log("1", computer.deck);
      playCardForPlayer(computer, 0);
      // console.log("2", computer.deck);
      // console.log("before");
      // console.log("3", computer.deck);
      attackCard(computer, player);
      // console.log("4", computer.deck);
      // console.log("after");
      // console.log("5", computer.deck);
      playerStartTurn(player, computer);
      // console.log("6", computer.deck);
      checkWin(player.health, computer.health);
      // console.log("7", computer.deck);
      setComputer({ ...computer });
      // console.log("8", computer.deck);
      setPlayer({ ...player });
    }
  }, [currentTurn]);

  return (
    <div>
      <Player {...computer} currentTurn={currentTurn === 2} isPlayer1={false} />
      <Player
        {...player}
        drawCard={() => {
          dealCardForPlayer(player);
          setPlayer({ ...player });
        }}
        playCard={(i) => {
          playCardForPlayer(player, i);
          setPlayer({ ...player });
        }}
        attackCard={() => {
          attackCard(player, computer);
          playerStartTurn(computer, player);
          setComputer({ ...computer });
        }}
        playerStart={() => {
          playerStartTurn(computer, player);
          setComputer({ ...computer });
        }}
        currentTurn={currentTurn === 1}
        isPlayer1={true}
      />
    </div>
  );
};

export default Game;

// playCard={(i) => playCardForPlayer(computer, setComputer, i)}
// playCard is the prop that returns the index of the card being played
// playCardForPlayer is what game.js that actually handles card play

////////////////////////////////////
//TO-DO LIST
////////////////////////////////////

//computer should attack
//buttons dont work
//computer logic to play cards depending on cmc

////////////////////////////////////
//FINISHED LIST
////////////////////////////////////

////shuffle deck
////create players and play areas
////draw card
////play card
////card attack
////tie play card to mana
////create turns
////increment mana on turns
//deal 3 cards on start
//can not draw cards indefinitely
//mana resets to max at the end of every turn or start?
//mana generation on start of turn
//win/loss condition
