import React from "react";

const Card = ({ name, playCard }) => {
  //   const [name, setName] = useState("");
  // include in ({}) to set as props
  if (playCard) {
    return (
      <>
        <div>{name}</div>
        <button onClick={playCard}>Play</button>
      </>
    );
  }
  return <div> {name}</div>;
};

export default Card;
