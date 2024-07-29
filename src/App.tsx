import styles from './App.module.scss'
import GameBoard from "./game-board/GameBoard";
import {useEffect, useState} from "react";

function App() {

  return (
    <div className={styles.root}>
      <h1 >Tetris</h1>
      <GameBoard/>
      <Clocker/>
    </div>
  )
}
const Clocker: React.FC = () => {

  const [counter, setCounter] = useState<number>(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prevState => prevState + 1);
    }, 10000)
    return () => clearInterval(interval)
  })

  return (
    <div>
      ${counter}
    </div>
  )
}


export default App
