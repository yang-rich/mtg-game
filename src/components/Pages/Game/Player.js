import React from "react";
import Card from "./Card";

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
}) => {
  return (
    <>
      {health}
      <br />
      {mana}
      {hand.map((card) => (
        <>
          <Card name={card.name} key={card.name} playCard={playCard} />
          <img src={card.imgUrl} alt={card.name} />
        </>
      ))}
      <br />
      {deck.length} cards left
      <br />
      {currentTurn && (
        <>
          <button onClick={drawCard}>draw</button>
          <br />
          <button onClick={attackCard}>Attack</button>
          <br />
          <button onClick={endTurn}>End Turn</button>
        </>
      )}
      {board.map((card) => (
        <>
          <Card key={card.name} img={card.imgUrl} />
          <img src={card.imgUrl} alt={card.name} />
        </>
      ))}
      {console.log(board)}
    </>
  );
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
