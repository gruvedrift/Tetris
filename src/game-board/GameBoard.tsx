import styles from './GameBoard.module.scss';
import React, {useEffect, useState} from "react";
import {coordinateLimit, coordinateLimitForShape} from "../assets/Utils";
import GridCell from "../GridCell/GridCell";

// TODO move to types.ts
interface Coordinates {
  x_axis: number
  y_axis: number
}

// TODO consider adding useMemo in order to not re-render the whole fucking page each time
const GameBoard: React.FC = () => {

  const handleKeydown = (event: KeyboardEvent) => {
    setCoordinate(prevState => {
      let new_y_axis = prevState.y_axis;
      let new_x_axis = prevState.x_axis;

      switch (event.key) {
        case 'ArrowUp':
          new_y_axis -= 1;
          break;
        case 'ArrowDown':
          new_y_axis += 1;
          break;
        case 'ArrowLeft':
          new_x_axis -= 1;
          break;
        case 'ArrowRight':
          new_x_axis += 1;
          break;
        default:
          return prevState;
      }
      if (coordinateLimit(new_x_axis) || coordinateLimit(new_y_axis)) {
        console.log('Limit reached')
        return prevState
      } else {
        return {x_axis: new_x_axis, y_axis: new_y_axis};
      }
    });
  };

  const [coordinate, setCoordinate] = useState<Coordinates>({x_axis: 0, y_axis: 0})

  console.log('These are the coordinates: ', coordinate)


  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    }
  },)

  return (
    <div className={styles.gameboard}>
      <Grid coordinates={coordinate}/>
    </div>
  )
}

export default GameBoard

interface GridProps {
  coordinates: Coordinates
}

// TODO reverse the grid so that 0,0 is in the bottom left and 9,9 is in the upper right
// Most of the game logic happens within this grid component
const Grid: React.FC<GridProps> = ({coordinates}) => {
  const x_axis_dimention = 10
  const y_axis_dimention = 10
  const test_shape_l: Shape =  {
    coordinateList: [
      {x_axis: 0, y_axis: 0},
      {x_axis: 0, y_axis: 1},
      {x_axis: 0, y_axis: 2},
      {x_axis: 0, y_axis: 3},
      {x_axis: 1, y_axis:3},
    ]
  }
  const test_shape_square: Shape = {
    coordinateList: [
      {x_axis: 8, y_axis: 2},
      {x_axis: 9, y_axis: 2},
      {x_axis: 8, y_axis: 3},
      {x_axis: 9, y_axis: 3},
    ]
  }
  const [shapes, setShapes] = useState<Shape[]>()
  const [movingShapeCoordinates, setMovingShapeCoordinates] = useState<Shape>(test_shape_square)
  const list_of_shapes = [test_shape_l, test_shape_square]

  // TODO something is not working as expected here. Looks like check for coordinate limit blocks
  /*
  * Handles updating x-axis coordinates for the active shape on game board.
  * Checks for out of bounds ( GameBoard x-axis limit )
  * **/
  const handleMoveShape = (event: KeyboardEvent) => {
    setMovingShapeCoordinates(prevState => {
      const updatedCoordinates = prevState.coordinateList.map(coordinates => {
        switch (event.key) {
          case 'ArrowLeft':
              return {...coordinates, x_axis: coordinates.x_axis - 1}
          case'ArrowRight':
            return {...coordinates, x_axis: coordinates.x_axis + 1}
            default:
              return coordinates
        }
      })
      if (!coordinateLimitForShape({coordinateList: updatedCoordinates})) {
        return { coordinateList: updatedCoordinates}
      } else {
        return prevState
      }
    });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleMoveShape)
    return () => {
      window.removeEventListener('keydown', handleMoveShape);
    }
  })


  const row = y_axis_dimention;
  const column = x_axis_dimention;
  const grid = []
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < column; j++) {

      const active = coordinates.y_axis === i && coordinates.x_axis == j
      const reachedBottom = coordinates.y_axis === 9 && coordinates.y_axis === i && coordinates.x_axis === j
      const inShape = movingShapeCoordinates.coordinateList.some(coordinate =>
        coordinate.x_axis === j && coordinate.y_axis === i
      )

      // used for list
      const test = list_of_shapes.some( shape =>
         shape.coordinateList.some(coordinate =>
           coordinate.x_axis === j && coordinate.y_axis === i
         )
      )

      // Could need to actually move all the 'active' cells to the left and the right when < >
      // Need then to 'lock' the active in shape cells that has reached the bottom of the game screen.

      grid.push(
        <GridCell
          row={i}
          column={j}
          isActive={active}
          reachedBottom={reachedBottom}
          inShape={inShape}
          shapeList={[test_shape_square]}/>
      )
    }
  }
  return (
    <div className={styles.gridcontainer}>
      {grid}
    </div>
  )
}


export interface Shape {
  coordinateList: Coordinates[]
}
