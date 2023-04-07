import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import xImage from "./images/elon.png";
import oImage from "./images/shiba.png";

function Square({ ind, updateSquares, clsName }) {
  const handleClick = () => {
    updateSquares(ind);
  };

  return (
    <button className={`square ${clsName}`} onClick={handleClick}>
      {clsName === "x" && <img src={xImage} alt="X" />}
      {clsName === "o" && <img src={oImage} alt="O" />}
    </button>
  );
}

function Button({ resetGame }) {
  return (
    <button className="reset-game" onClick={resetGame}>
      Reset Game
    </button>
  );
}

function App() {
  const [gridSize, setGridSize] = useState(3);
  const [squares, setSquares] = useState(Array(gridSize * gridSize).fill(""));
  const [turn, setTurn] = useState("x");
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    resetGame();
  }, [gridSize]);

  useEffect(() => {
    const W = checkWinner();
    if (W) {
      setWinner(W);
    } else if (checkEndTheGame()) {
      setWinner("draw");
    }
  }, [squares]);

  const checkEndTheGame = () => squares.every(Boolean);

  const checkWinner = () => {
    let diag1 = new Set();
    let diag2 = new Set();

    for (let i = 0; i < gridSize; i++) {
      const row = new Set();
      const col = new Set();

      for (let j = 0; j < gridSize; j++) {
        row.add(squares[i * gridSize + j]);
        col.add(squares[j * gridSize + i]);

        if (i === j) {
          diag1.add(squares[i * gridSize + j]);
        }

        if (i + j === gridSize - 1) {
          diag2.add(squares[i * gridSize + j]);
        }
      }

      if (row.size === 1 && !row.has("")) {
        return row.values().next().value;
      }

      if (col.size === 1 && !col.has("")) {
        return col.values().next().value;
      }
    }

    if (diag1.size === 1 && !diag1.has("")) {
      return diag1.values().next().value;
    }

    if (diag2.size === 1 && !diag2.has("")) {
      return diag2.values().next().value;
    }

    return null;
  };

  const updateSquares = (ind) => {
    if (squares[ind] || winner) {
      return;
    }
    const newSquares = [...squares];
    newSquares[ind] = turn;
    setSquares(newSquares);
    setTurn(turn === "x" ? "o" : "x");
  };

  const resetGame = () => {
    setSquares(Array(gridSize * gridSize).fill(""));
    setTurn("x");
    setWinner(null);
  };

  const handleGridSizeChange = (event) => {
    const newSize = parseInt(event.target.value);
    setGridSize(newSize);
  };

  return (
    <div className="tic-tac-toe">
      <h1> TIC-TAC-TOE </h1>
      <label htmlFor="grid-size-select">Select grid size:</label>
      <select
        id="grid-size-select"
        name="grid-size-select"
        value={gridSize}
        onChange={handleGridSizeChange}
      >
        <option value="3">3x3</option>
        <option value="4">4x4</option>
        <option value="5">5x5</option>
      </select>
      <Button resetGame={resetGame} />
      <div className="game" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
        {squares.map((clsName, ind) => (
          <Square key={ind} ind={ind} updateSquares={updateSquares} clsName={clsName} />
        ))}
      </div>
      <div className={`turn ${turn === "x" ? "left" : "right"}`}>
        <Square clsName={turn === "x" ? "x" : "o"} updateSquares={updateSquares} />
        <Square clsName={turn === "x" ? "o" : "x"} updateSquares={updateSquares} />
      </div>
      <AnimatePresence>
        {winner && (
          <motion.div
            key={"parent-box"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="winner"
          >
            <motion.div
              key={"child-box"}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="text"
            >
              <motion.h2
                initial={{ scale: 0, y: 100 }}
                animate={{
                  scale: 1,
                  y: 0,
                  transition: {
                    y: { delay: 0.7 },
                    duration: 0.7,
                  },
                }}
              >
                {winner === "draw" ? "Draw :/" : "Win !! :)"}
              </motion.h2>
              <motion.div
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  transition: {
                    delay: 1.3,
                    duration: 0.2,
                  },
                }}
                className="win"
              >
                {winner !== "draw" && <Square clsName={winner} />}
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  transition: { delay: 1.5, duration: 0.3 },
                }}
              >
                <Button resetGame={resetGame} />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
