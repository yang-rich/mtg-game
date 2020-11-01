import React, { useEffect, useState } from "react";
import Player from "./Player";
import dacards from "./allCards/cards";

const Game = () => {
  // console.log(dacards);
  //set initial player states
  const [player1, setPlayer1] = useState({
    deck: [],
    health: 2,
    mana: 1,
    maxMana: 1,
    hand: [],
    board: [],
    drawTurn: 0,
  });
  const [player2, setPlayer2] = useState({
    deck: [],
    health: 2,
    mana: 1,
    maxMana: 1,
    hand: [],
    board: [],
    drawTurn: 0,
  });

  //randomize who goes first
  const turnCoinFlip = () => Math.floor(Math.random() * 2) + 1;
  const [currentTurn, setCurrentTurn] = useState(turnCoinFlip());
  // console.log("turn", currentTurn);

  //deal card
  const dealCard = () => {
    if (currentTurn === 1) {
      let cardDealt = player2.deck.pop();
      player2.hand.push(cardDealt);
      return;
    }
    let cardDealt = player1.deck.pop();
    player1.hand.push(cardDealt);
    return;
  };
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
    let player1Cards = shuffleDeck(
      dacards.filter((card) => card.element === "deck1")
    );
    let player1hand = [];
    let dealtCard;
    for (let i = 0; i < 3; i++) {
      dealtCard = player1Cards.pop();
      player1hand.push(dealtCard);
    }
    setPlayer1({ ...player1, deck: player1Cards, hand: player1hand });
    let player2Cards = shuffleDeck(
      dacards.filter((card) => card.element === "deck2")
    );
    let player2hand = [];
    let dealtCard2;
    for (let i = 0; i < 3; i++) {
      dealtCard2 = player2Cards.pop();
      player2hand.push(dealtCard2);
    }
    setPlayer2({ ...player2, deck: player2Cards, hand: player2hand });
  }, []);
  // useEffect takes 2 params, the callback function and the "dependency array"
  // the array of variables the function depends on
  // empty array means it will only run the first time the component is rendered
  // if we pass something in the dependency array, the callback will run if that values has changed since the last render
  // if we pass player1 in the dependency array, it will check if it has changed since the previous render
  // technically should separate every part of player out to separate useStates so useEffect can be called on them separately

  const drawCard = (player, setPlayer) => {
    // if (player.deck.length === 0) {
    //   // gameLoss();
    //   return;
    // }
    if (player.drawTurn === 0) {
      let cardDraw = player.deck.pop();
      player.hand.push(cardDraw);
      //need to pass {...player} instead of player b/c player was same reference to same object and didnt change, spread operator creates copy of original but with changes, then assigns it back with changes
      setPlayer({ ...player, drawTurn: 1 });
    }
  };
  const playCardForPlayer = (player, setPlayer, cardpos) => {
    //structure conditions for stuff that will not allow code to run first
    //return early for conditional so we know immediately and dont have to look at rest of code
    if (player.hand[cardpos].cmc > player.mana) {
      alert("Not Enough Mana");
      return;
    }
    let cardPlay = player.hand.splice(cardpos, 1);
    // console.log("console log id", cardPlay[0].id);
    // socket.io test case
    player.board.push(cardPlay[0]);
    player.mana -= cardPlay[0].cmc;
    setPlayer({ ...player });
    // console.log("played card");
    console.log(cardPlay);
    // console.log(player.board);
  };
  //end turn function to change actionable player

  //run playerStartTurn for players at endTurn of other player
  //should have the mana reset line
  //change drawTurn to 0

  const playerStartTurn = () => {
    if (currentTurn === 1) {
      dealCard();
      setPlayer2({
        ...player2,
        maxMana: player2.maxMana + 1,
        drawTurn: 0,
        mana: player2.maxMana + 1,
      });
      return;
    }
    dealCard();
    setPlayer1({
      ...player1,
      maxMana: player1.maxMana + 1,
      drawTurn: 0,
      mana: player1.maxMana + 1,
    });
    return;
  };
  const endTurn = () => {
    if (currentTurn === 1) {
      setCurrentTurn(2);
      playerStartTurn();
      // dealCard();
      return;
    }
    setCurrentTurn(1);
    playerStartTurn();
    // dealCard();
  };
  const restartGame = () => {
    window.location.reload();
  };
  const checkWin = () => {
    if (player1.health <= 0) {
      alert("Player 2 wins!");
      restartGame();
    } else if (player2.health <= 0) {
      alert("Player 1 wins!");
      restartGame();
    }
  };
  const attackCard = (attackingPlayer, targetPlayer, setPlayer) => {
    //sum power on board
    //starts with 0, adds card.power from first card, and then sets that to acc for the next iteration
    let sum = attackingPlayer.board.reduce((acc, card) => acc + card.power, 0);
    // let sum = 0;
    // console.log(attackingPlayer);
    // console.log(targetPlayer);
    // console.log("test", attackingPlayer.board[0].power);
    console.log(sum);
    targetPlayer.health -= sum;
    checkWin();
    setPlayer({ ...targetPlayer });
    endTurn(currentTurn, setCurrentTurn);
  };

  return (
    <div>
      <Player
        {...player1}
        drawCard={() => drawCard(player1, setPlayer1)}
        playCard={(i) => playCardForPlayer(player1, setPlayer1, i)}
        attackCard={() => attackCard(player1, player2, setPlayer2)}
        currentTurn={currentTurn === 1}
        endTurn={() => endTurn()}
        isPlayer1={true}
      />
      <br />
      <br />
      <br />
      <Player
        {...player2}
        drawCard={() => drawCard(player2, setPlayer2)}
        playCard={(i) => playCardForPlayer(player2, setPlayer2, i)}
        attackCard={() => attackCard(player2, player1, setPlayer1)}
        currentTurn={currentTurn === 2}
        endTurn={() => endTurn()}
        isPlayer1={false}
      />
    </div>
  );
};

export default Game;

// playCard={(i) => playCardForPlayer(player2, setPlayer2, i)}
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
