/**
 * React Card Game Exampe 1
 * Matthew Moczynski
 * 
 * Note: This contains some debugging code that is commented out in some places.
 * 
 */

import { useState } from "react";

function Card() {

  let [active, setActive] = useState(false);

  function handleClick(event) {
    setActive(true);
    event.target.classList.add("active-card");
  }

  return <div className="card" onClick={handleClick}></div>
}

/**
 * Takes an array and creates a new shuffled array
 * @param {*} arr 
 * @returns Shuffled Array
 */

function createShuffledArr(arr) {

  // New array

  var newArr = Array.from(arr);

  // Array for randomized indexes
  var randomizedIndices = [];

  // Get array containing all of the indexes for arr from 0 to arr.length - 1.
  var keys = Object.keys(arr);

  /**
   * This loop removes a random element from the keys array until there is no more.
   * 
   */

  while(keys.length > 0) {

    // Select one of the random indexes in the keys array.

    var randomIndex = Math.floor(Math.random() * keys.length);

    // Remove a random index and then put it into the randomized indices array.

    randomizedIndices.push(keys.splice(randomIndex,1)[0]);

  }

  //console.log(randomizedIndices);

  // Loop through

  for(let i = 0; i < randomizedIndices.length; i++) {

    // Select a random index

    let index = randomizedIndices[i];

    // Set to currently selected random index

    newArr[i] = arr[index];
  }

  return newArr;

}

//window.createShuffledArr = createShuffledArr;

/**
 * Board
 * @returns 
 */


const objarr = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8];
var shuffledArr = createShuffledArr(objarr);
//var shuffledArr = objarr;

/**
 * ScoreBoard component
 * @param {*} param0 
 * @returns 
 */

function ScoreBoard({movecount, pairsleft, gamecompleted}) {

  function generateMsg() {
    if(gamecompleted) {
      return "Game Compeleted!";
    }
  }

  return(
    <div className="scoreboard">
      <h3>Scoreboard:</h3>
      Moves: <span className="move-count">{movecount}</span><br></br>
      Pairs Left: <span className="pairs-left">{pairsleft}</span><br></br>
      <span className="gamecompleted">{generateMsg()}</span>
    </div>
  );
}

//var cardMask = Array.from(shuffledArr).map(() => 0);

//console.log(cardMask);

// Note: I did not use react hooks for this because of the asyc nature of the react hook.
// They are also global to prevent the values being changed to an unwanted value because of some rendering.
// May or may not be the best pattern to use, but it seems to work.

var firstCardElm;
var secondCardElm;

function App() {

  // State variables

  var [moveCount, setMoveCount] = useState(0)
  var [pairsLeft, setPairCount] = useState(shuffledArr.length / 2);

  //function handleOnClick(event) {
    //if(event.target.classList.contains("card")) {
      //
    //}
  //}

  //var [cards, setCards] = useState([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);

  //var [cards, setCards] = useState([1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8]);
  
  /*
  * Get card value at the row `rowIndex` and column `columnIndex`
  */

  function retrieveCardValue(rowIndex, columnIndex) {
    return shuffledArr[rowIndex * 4 + columnIndex];
  }

  //setCards(createShuffledArr([1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8]))

  //initBoard();

  function removeFlip(elm) {
    elm.classList.remove("flipped");
    elm.innerText = "";
  }

  function handleClickEvent(event) {

    // Prevents applying the click handler on things that are not cards or cards that are already flipped.

    if(!event.target.classList.contains("card") || event.target.classList.contains("flipped")) {
      return false;
    }

    else {
      //moveCount++;
      setMoveCount(moveCount + 1);
      event.target.classList.add("flipped");
    }

    let o = {

      /**
       * The
       */

      eventTarget: event.target,

      /**
       * The parent row element of the card
       */

      rowElement: event.target.parentElement,

      /**
       * 
       * Getter for finding the column index for the card in the row.
       * The "children" property of instantations of JavaScript's "Element" class does not have an indexOf method.
       * Therefore, the Array.from method is used to generate an array so that the indexOf method can be used.
       * 
       * See more info about the children property of the Element class for JavaScript:
       * https://developer.mozilla.org/en-US/docs/Web/API/Element/children 
       */

      get columnIndex() {
        return Array.from(this.rowElement.children).indexOf(event.target);
      },

      get rowIndex() {
        return Array.from(this.rowElement.parentElement.children).indexOf(this.rowElement);
      }

    }
    
    //console.log(o);

    //console.log("Column index: " + o.columnIndex);
    //console.log("Row index: " + o.rowIndex);

    // If a pair is not selected

    event.target.innerText = retrieveCardValue(o.rowIndex, o.columnIndex);
    event.target.classList.add("flipped");

    if(!firstCardElm && !secondCardElm) {
      firstCardElm = event.target;
    }

    else if(firstCardElm && !secondCardElm) {

      secondCardElm = event.target;

      if(firstCardElm.innerText === secondCardElm.innerText) {

        //alert("Matching pair!");

        //firstCardElm.classList.add("disabled");
        //secondCardElm.classList.add("disabled");

        firstCardElm = null;
        secondCardElm = null;

        setPairCount(pairsLeft - 1);

      }

      else {

        // Closure to prevent "undefined object" errors

        let temp = [firstCardElm, secondCardElm]

        // Nullify comparison variables

        firstCardElm = null;
        secondCardElm = null;

        setTimeout(function(){
          removeFlip(temp[0]);
          removeFlip(temp[1]);
        }, 500);
      }

    }

  }

  function resetCards() {

    firstCardElm = null;
    secondCardElm = null;

    // Reshuffle cards
    //console.log(shuffledArr);
    shuffledArr = createShuffledArr(objarr);
    //console.log(shuffledArr);

    // Set scoreboard data back to default values
    setMoveCount(0);
    setPairCount(shuffledArr.length / 2);

    // Remove card flips

    Array.from(document.querySelectorAll(".card")).forEach(function(elm){
      removeFlip(elm);
    })

  }

  return (
    <div className="container" onClick={handleClickEvent}>
      <div className="board">
        <div className="row">
          <Card></Card>
          <Card></Card>
          <Card></Card>
          <Card></Card>
        </div>
        <div className="row">
          <Card></Card>
          <Card></Card>
          <Card></Card>
          <Card></Card>
        </div>
        <div className="row">
          <Card></Card>
          <Card></Card>
          <Card></Card>
          <Card></Card>
        </div>
        <div className="row">
          <Card></Card>
          <Card></Card>
          <Card></Card>
          <Card></Card>
        </div>
      </div>
      <button onClick={resetCards} className="restart-button">Restart</button>
      <ScoreBoard movecount={moveCount} pairsleft={pairsLeft} gamecompleted={pairsLeft === 0}></ScoreBoard>
    </div>
  );
}

export default App;
