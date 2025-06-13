import  { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
const socket = io('https://twoplayergame-server.onrender.com');

function App() {
  const [player, setPlayer] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isMyTurn, setIsMyTurn] = useState(false);

  useEffect(() => {
    socket.emit('joinGame');

    socket.on('playerAssigned', (playerNumber) => {
      setPlayer(playerNumber);
      setIsMyTurn(playerNumber === 1);
    });

    socket.on('moveMade', ({ index, symbol }) => {
      setBoard((prev) => {
        const newBoard = [...prev];
        newBoard[index] = symbol;
        return newBoard;
      });
      setIsMyTurn(true);
    });

    return () => {
      socket.off('playerAssigned');
      socket.off('moveMade');
    };
  }, []);

  const handleClick = (index:any) => {
    if (!isMyTurn || board[index]) return;
    const newBoard = [...board];
    const symbol = player === 1 ? 'X' : 'O';
    newBoard[index] = symbol;
    setBoard(newBoard);
    setIsMyTurn(false);
    socket.emit('makeMove', { index, symbol });
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>You are Player {player} ({player === 1 ? 'X' : 'O'})</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 100px)' }}>
        {board.map((cell, i) => (
          <div
            key={i}
            onClick={() => handleClick(i)}
            style={{
              border: '1px solid black',
              height: '100px',
              fontSize: '2rem',
              lineHeight: '100px',
              cursor: 'pointer',
            }}
          >
            {cell}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
