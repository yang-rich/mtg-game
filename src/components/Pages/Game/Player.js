import React from "react";
import Card from "./Card";
import "./Styles/card.css";

const Player = ({
  deck,
  health,
  mana,
  hand,
  board,
  drawCard,
  playCard,
  attackCard,
  currentTurn,
  endTurn,
  isPlayer1,
}) => {
  if (!currentTurn) {
    playCard = () => {};
  }
  const boardStuff = (
    <div className="board">
      {board.map((card) => (
        <>
          <Card key={card.name} />
          <img className="card" src={card.imgUrl} alt={card.name} />
        </>
      ))}
    </div>
  );
  const playerStuff = (
    <>
      <div className="hand">
        {hand.map((card, i) => (
          <>
            <Card key={card.name} />
            <img
              className="card"
              src={card.imgUrl}
              alt={card.name}
              onClick={() => playCard(i)}
            />
          </>
        ))}
      </div>
    </>
  );
  const gameplayStuff = (
    <>
      {health}
      <br />
      {mana}
      <br />
      {deck.length} cards left
      <br />
      {currentTurn && (
        <div className="actionMenu">
          {/* <button onClick={drawCard}>draw</button> */}
          <br />
          <button onClick={attackCard}>Attack</button>
          <br />
          <button onClick={endTurn}>Pass / End Turn</button>
        </div>
      )}
    </>
  );
  if (isPlayer1) {
    return (
      <>
        {gameplayStuff}
        Hand:
        <br />
        {playerStuff}
        <br />
        Board:
        <br />
        {boardStuff}
      </>
    );
  } else {
    return (
      <>
        Board:
        {boardStuff}
        <br />
        Hand:
        {playerStuff}
        {gameplayStuff}
      </>
    );
  }
};

export default Player;

// 0 && 1 vs 1 && 1 example
// 1 && console.log('hi') vs 0 && console.log('hi')

// similar to
// let object;
// function awweogihaw() => {
//   object = object || {something:5};
//   return object.something;
// }

// thing && other
// thing ? other : thing

// thing || other
// thing ? thing : other

// onClick={() => playCard(i)}
// when passing functions from parent to child, arrow functions allows us to pass i to the correct "context"
// this playCard() knows game.js
// the arrow version passes along context where "this" refers to game.js instead of player.js
// use this instead of events

//SOCKET IO STUFF
//unrender hand for isPlayer1
