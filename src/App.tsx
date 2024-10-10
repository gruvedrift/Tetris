import styles from './App.module.scss'
import GameBoard from "./game-board/GameBoard";
import {useEffect, useState} from "react";

// TODO send as props
export const X_AXIS_DIMENTION = 10
export const Y_AXIS_DIMENTION = 24


function App() {
  const [score, setScore] = useState<number>(0)

  const handleScoreUpdate = (points: number) => {
    setScore(previousScore =>  previousScore + points)
  }

  return (
    <div className={styles.root}>
      <h1>Tetris</h1>
      <GameBoard onRowClear={handleScoreUpdate}/>
      {`Score: ${score}`}
      {/*<Clocker/>*/}
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
