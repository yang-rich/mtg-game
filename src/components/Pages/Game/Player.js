import React from "react";
import Card from "./Card";
import playerHealth from "../../../Images/playerHealth.png";
import computerHealth from "../../../Images/computerHealth.png";
import dacards from "./allCards/cards";
import "./Styles/card.css";

const Player = ({
  deck,
  health,
  mana,
  hand,
  board,
  playCard,
  attackCard,
  currentTurn,
  playerStart,
  isPlayer1,
}) => {
  //if not your turn, disable playCard functionality by setting to empty function
  if (!currentTurn) {
    playCard = () => {};
  }
  const computerBoardStuff = (
    <div className="computerBoard">
      {board.map((card) => (
        <>
          <Card key={card.name} />
          <img className="computerCard" src={card.imgUrl} alt={card.name} />
        </>
      ))}
    </div>
  );
  const playerBoardStuff = (
    <div className="board">
      {board.map((card) => (
        <>
          <Card key={card.name} />
          <img className="card" src={card.imgUrl} alt={card.name} />
        </>
      ))}
    </div>
  );
  console.log(hand);
  //this ternary handles cards face up or face down depending on active player
  //intended to not show opposing player for now
  //i in map lets us pick index for playCard();
  const playerStuff = (
    <>
      {
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
      }
    </>
  );
  const computerStuff = (
    <>
      {
        <div className="computerHand">
          {hand.map((card, i) => (
            <>
              <Card key={card.name} />
              <img className="card" src={card.backImgUrl} alt={card.name} />
            </>
          ))}
        </div>
      }
    </>
  );
  // const computerGameplayStuff = (

  const playerGameplayStuff = (
    <>
      <div className="playerArea">
        <div className="playerHealth">
          <div className="playerHealthMana">
            {health}
            <br />
            {mana}
            <br />
          </div>
        </div>
        <div className="playerHealthImage">
          <img src={playerHealth} />
        </div>
        {currentTurn && (
          <div className="actionMenu">
            {/* <button onClick={dealCardForPlayer}>draw</button>
          <br /> */}
            <button className="buttons" onClick={attackCard}>
              Attack
            </button>
            <br />
            <button className="buttons" onClick={playerStart}>
              Pass / End Turn
            </button>
          </div>
        )}
        <div className="deckSpot">
          <img className="deckStack" src={dacards[0].backImgUrl} />
          <br />
          <div className="cardsLeft">{deck.length} cards left</div>
        </div>
        <br />
      </div>
    </>
  );
  const computerGameplayStuff = (
    <>
      <div className="computerArea">
        <div className="computerHealth">
          <div className="computerHealthImage">
            <img src={computerHealth} />
          </div>
          <div className="computerHealthMana">
            {health}
            <br />
            {mana}
            <br />
          </div>
        </div>
        <div className="deckSpot">
          {" "}
          <img className="deckStack" src={dacards[0].backImgUrl} />
          <div className="cardsLeft">{deck.length} cards left</div>
          <br />
        </div>
        <br />
      </div>
    </>
  );

  //separated each part of game to separate components to re-order based on positioning (player board board player)
  return isPlayer1 ? (
    <div className="playerBackground">
      {playerBoardStuff}
      <br />
      {playerStuff}
      {playerGameplayStuff}
    </div>
  ) : (
    <div className="computerBackground">
      <>
        {computerGameplayStuff}
        <br />
        {computerStuff}
        <br />
        {computerBoardStuff}
      </>
    </div>
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

// onClick={() => playCard(i)}
// when passing functions from parent to child, arrow functions allows us to pass i to the correct "context"
// this playCard() knows game.js
// the arrow version passes along context where "this" refers to game.js instead of player.js
// use this instead of events

//SOCKET IO STUFF
//unrender hand for isPlayer1
