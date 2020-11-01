import React, { useCallback, useEffect, useState } from "react";
import Player from "./Player";
import dacards from "./allCards/cards";

const Game = () => {
  // console.log(dacards);
  //set initial player and computer states
  //needed to separate into multiple useStates to be able to change specific things without triggering all useEffects that depends on player or computer
  //can separate now to depend on just the computerDeck instead of all of computer

  const [computerDeck, setComputerDeck] = useState([]);
  const [computerHealth, setComputerHealth] = useState(20);
  const [computerMana, setComputerMana] = useState(0);
  const [computerMaxMana, setComputerMaxMana] = useState(0);
  const [computerHand, setComputerHand] = useState([]);
  const [computerBoard, setComputerBoard] = useState([]);
  const [computerIsActive, setComputerIsActive] = useState(false);

  const [playerDeck, setPlayerDeck] = useState([]);
  const [playerHealth, setPlayerHealth] = useState(20);
  const [playerMana, setPlayerMana] = useState(0);
  const [playerMaxMana, setPlayerMaxMana] = useState(0);
  const [playerHand, setPlayerHand] = useState([]);
  const [playerBoard, setPlayerBoard] = useState([]);
  const [playerIsActive, setPlayerIsActive] = useState(false);

  //randomize who goes first
  const turnCoinFlip = () => Math.floor(Math.random() * 2) + 1;
  //takes coinflip and determines the starting "currentTurn" which decides which player starts
  const [currentTurn, setCurrentTurn] = useState(turnCoinFlip());
  // console.log("turn", currentTurn);

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

    setPlayerHand(newPlayerHand);
    setPlayerDeck(playerCards);

    let computerCards = shuffleDeck(
      dacards.filter((card) => card.element === "deck2")
    );
    let newComputerHand = [];
    for (let i = 0; i < 3; i++) {
      newComputerHand.push(computerCards.pop());
    }

    setComputerHand(newComputerHand);
    setComputerDeck(computerCards);

    if (currentTurn === 1) {
      setPlayerIsActive(true);
    } else {
      setComputerIsActive(true);
    }
  }, [currentTurn]);

  // useEffect takes 2 params, the callback function and the "dependency array"
  // the array of variables the function depends on
  // empty array means it will only run the first time the component is rendered
  // if we pass something in the dependency array, the callback will run if that values has changed since the last render
  // if we pass player in the dependency array, it will check if it has changed since the previous render

  console.log("render");
  //deal card
  const dealCardForPlayer = (deck, hand, setDeck, setHand) => {
    //look into coupling
    let cardDealt = deck.pop();
    // console.log("dealtcard", cardDealt);
    hand.push(cardDealt);
    setDeck(deck);
    setHand(hand);
    return;
  };
  const playCardForPlayer = (
    hand,
    board,
    mana,
    setHand,
    setBoard,
    setMana,
    cardpos
  ) => {
    //structure conditions for stuff that will not allow code to run first
    //return early for conditional so we know immediately and dont have to look at rest of code
    if (hand[cardpos].cmc > mana) {
      alert("Not Enough Mana");
      return;
    }
    let cardPlay = hand.splice(cardpos, 1);
    // console.log("console log id", cardPlay[0].id);
    // socket.io test case
    board.push(cardPlay[0]);
    mana -= cardPlay[0].cmc;
    setHand(hand);
    setBoard(board);
    setMana(mana);
  };
  //end turn function to change actionable player

  //run playerStartTurn for players at endPlayerTurn
  //should have the mana reset line
  //change drawTurn to 0
  //isActive used for faceup/facedown

  const playerStartTurn = useCallback(
    () => (
      nextPlayer,
      setNextPlayer,
      nextPlayerMaxMana,
      setNextPlayerMana,
      setNextPlayerMaxMana,
      setCurrentPlayerIsActive,
      setNextPlayerIsActive
    ) => {
      dealCardForPlayer(nextPlayer, setNextPlayer);
      setCurrentPlayerIsActive(false);
      setNextPlayerMaxMana(nextPlayerMaxMana + 1);
      setNextPlayerMana(nextPlayerMaxMana + 1);
      setNextPlayerIsActive(true);

      if (currentTurn === 1) {
        setCurrentTurn(2);
      } else {
        setCurrentTurn(1);
      }
    },
    [currentTurn]
  );

  //run computer logic at the end of endPlayerTurn()
  const restartGame = () => {
    window.location.reload();
  };
  const attackCard = useCallback(
    () => (board, health, setHealth) => {
      const checkWin = () => {
        if (playerHealth <= 0) {
          alert("Computer wins!");
          restartGame();
        } else if (computerHealth <= 0) {
          alert("Player wins!");
          restartGame();
        }
      };
      //sum power on board
      //starts with 0, adds card.power from first card, and then sets that to acc for the next iteration
      let sum = board.reduce((acc, card) => acc + card.power, 0);
      // let sum = 0;
      // console.log(attackingPlayer);
      // console.log(targetPlayer);
      // console.log("test", attackingPlayer.board[0].power);
      // console.log(sum);
      checkWin();
      setHealth(health - sum);
    },
    []
  );
  //separate useEffect runs when currentTurn changes (computer turn stuff)
  useEffect(() => {
    if (currentTurn === 2) {
      playerStartTurn(
        computerMaxMana,
        setComputerMana,
        setComputerMaxMana,
        setComputerIsActive,
        setPlayerIsActive
      );
      dealCardForPlayer(
        computerDeck,
        computerHand,
        setComputerDeck,
        setComputerHand
      );
      playCardForPlayer(
        computerHand,
        computerBoard,
        computerMana,
        setComputerHand,
        setComputerBoard,
        setComputerMana,
        0
      );
      attackCard(computerBoard, computerHealth, setPlayerHealth);
    }
  }, [
    attackCard,
    computerBoard,
    computerDeck,
    computerHand,
    computerHealth,
    computerMana,
    computerMaxMana,
    currentTurn,
    playerStartTurn,
  ]);

  return (
    <div>
      <Player
        dealCardForPlayer={() =>
          dealCardForPlayer(
            playerDeck,
            playerHand,
            setPlayerDeck,
            setPlayerHand
          )
        }
        playCard={(i) =>
          playCardForPlayer(
            playerHand,
            playerBoard,
            playerMana,
            setPlayerHand,
            setPlayerBoard,
            setPlayerMana,
            i
          )
        }
        attackCard={() =>
          attackCard(playerBoard, playerHealth, setPlayerHealth)
        }
        currentTurn={currentTurn === 1}
        isPlayer1={true}
      />
      <br />
      <br />
      <br />
      <Player
        dealCardForPlayer={() =>
          dealCardForPlayer(
            computerDeck,
            computerHand,
            setComputerDeck,
            setComputerHand
          )
        }
        playCard={(i) =>
          playCardForPlayer(
            computerHand,
            computerBoard,
            computerMana,
            setComputerHand,
            setComputerBoard,
            setComputerMana,
            i
          )
        }
        attackCard={() =>
          attackCard(computerBoard, computerHealth, setComputerHealth)
        }
        currentTurn={currentTurn === 2}
        isPlayer1={false}
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

//card back when not your turn for hands

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
