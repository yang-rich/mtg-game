import React, { useEffect, useState } from "react";
import Player from "./Player";
import dacards from "./json/cards";

const Game = () => {
  // console.log(dacards);
  //set initial player states
  const [player1, setPlayer1] = useState({
    deck: [],
    health: 20,
    mana: 0,
    hand: [],
    board: [],
    // graveyard: [],
  });
  const [player2, setPlayer2] = useState({
    deck: [],
    health: 20,
    mana: 0,
    hand: [],
    board: [],
    // graveyard: [],
  });

  useEffect(() => {
    let player1Cards = dacards.filter((card) => card.element === "deck1");
    setPlayer1({ ...player1, deck: player1Cards });
    let player2Cards = dacards.filter((card) => card.element === "deck2");
    setPlayer2({ ...player2, deck: player2Cards });
  }, []);
  // useEffect takes 2 params, the callback function and the "dependency array"
  // the array of variables the function depends on
  // empty array means it will only run the first time the component is rendered
  // if we pass something in the dependency array, the callback will run if that values has changed since the last render
  // if we pass player1 in the dependency array, it will check if it has changed since the previous render
  // technically should separate every part of player out to separate useStates so useEffect can be called on them separately

  const turnCoinFlip = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  };

  const [currentTurn, setCurrentTurn] = useState(turnCoinFlip(1, 2));

  const drawCard = (player, setPlayer) => {
    if (player.deck.length === 0) {
      // gameLoss();
      return;
    }
    let cardDraw = player.deck.pop();
    player.hand.push(cardDraw);
    //need to pass {...player} instead of player b/c player was same reference to same object and dint change
    setPlayer({ ...player });
  };
  const playCard = (player, setPlayer) => {
    let cardPlay = player.hand.pop();
    player.board.push(cardPlay);
    setPlayer({ ...player });
    console.log("played card");
    console.log(cardPlay);
    console.log(player.board);
  };
  const attackCard = (attackingPlayer, targetPlayer, setPlayer) => {
    //starts with 0, adds card.power from first card, and then sets that to acc for the next iteration
    let sum = attackingPlayer.board.reduce((acc, card) => acc + card.power, 0);
    //sum power on board
    // let sum = 0;
    // console.log(attackingPlayer);
    // console.log(targetPlayer);
    // console.log("test", attackingPlayer.board[0].power);
    // for (let key in attackingPlayer.board) {
    //   sum += attackingPlayer.board[key].power;
    // }
    console.log(sum);
    targetPlayer.health -= sum;
    setPlayer({ ...targetPlayer });
  };
  const endTurn = (currentTurn, setCurrentTurn) => {
    if (currentTurn === 1) {
      setCurrentTurn(2);
    } else {
      setCurrentTurn(1);
    }
  };
  return (
    <div>
      <Player
        {...player1}
        drawCard={() => drawCard(player1, setPlayer1)}
        playCard={() => playCard(player1, setPlayer1)}
        attackCard={() => attackCard(player1, player2, setPlayer2)}
        currentTurn={currentTurn === 1}
        endTurn={() => endTurn(currentTurn, setCurrentTurn)}
      />
      <br />
      <br />
      <br />
      <Player
        {...player2}
        drawCard={() => drawCard(player2, setPlayer2)}
        playCard={() => playCard(player2, setPlayer2)}
        attackCard={() => attackCard(player2, player1, setPlayer1)}
        currentTurn={currentTurn === 2}
        endTurn={() => endTurn(currentTurn, setCurrentTurn)}
      />
    </div>
  );
};

export default Game;

// make players unactionable when not their turn
// make attack only clickable once (combine attackCard and endTurn)
// make playCard only clickable on active player turn
