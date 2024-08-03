import styles from './GameBoard.module.scss';
import React, {useEffect, useState} from "react";
import {coordinateLimitForShape, generateNewShape, isShapeAtBottomOfGameBoard} from "../assets/Utils";
import GridCell from "../GridCell/GridCell";
import {X_AXIS_DIMENTION, Y_AXIS_DIMENTION} from "../App.tsx";
import {Coordinates, Shape} from "../assets/types.tsx";

// TODO move to types.ts

// TODO consider adding useMemo in order to not re-render the whole fucking page each time
const GameBoard: React.FC = () => {
  return (
    <div className={styles.gameboard}>
      <Grid/>
    </div>
  )
}

export default GameBoard

// TODO reverse the grid so that 0,0 is in the bottom left and 9,9 is in the upper right
// Most of the game logic happens within this grid component
const Grid: React.FC = () => {

  const test_shape_l: Shape = {
    coordinateList: [
      {x_axis: 0, y_axis: 0},
      {x_axis: 0, y_axis: 1},
      {x_axis: 0, y_axis: 2},
      {x_axis: 0, y_axis: 3},
      {x_axis: 1, y_axis: 3},
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

  // State to hold the currently active ' moving ' shape
  const [activeShape, setActiveShape] = useState<Shape>(test_shape_square)
  // State to hold the 'stack' of tiles at the bottom of the game board.
  const [stackCoordinates, setStackCoordinates] = useState<Coordinates[]>([])

  const list_of_shapes = [test_shape_l, test_shape_square]


  // TODO something is not working as expected here. Looks like check for coordinate limit blocks
  /*
  * Handles updating x-axis coordinates for the active shape on game board.
  * Checks for out of bounds ( GameBoard x-axis limit )
  * **/
  const handleMoveShape = (event: KeyboardEvent) => {
    setActiveShape(prevState => {
      const updatedCoordinates = prevState.coordinateList.map(coordinates => {
        switch (event.key) {
          case 'ArrowLeft':
            return {...coordinates, x_axis: coordinates.x_axis - 1}
          case'ArrowRight':
            return {...coordinates, x_axis: coordinates.x_axis + 1}
          case 'ArrowUp':
            return {...coordinates, y_axis: coordinates.y_axis - 1}
          case 'ArrowDown':
            return {...coordinates, y_axis: coordinates.y_axis + 1}
          default:
            return coordinates
        }
      })

      // Only update coordinates if shape is not out of bounds on next arrow move
      if (!coordinateLimitForShape({coordinateList: updatedCoordinates})) {
        console.log('Update coordinates are: ', updatedCoordinates)
        return {coordinateList: updatedCoordinates}
      } else {
        return prevState
      }
    });
  };

  // Add coordinates to stack if they have reached hte bottom of the gamegrid. Also, empty the active shape state
  const addToStack = (shape: Shape) => {
    if (isShapeAtBottomOfGameBoard(shape)) {
      const updateState = stackCoordinates.concat(shape.coordinateList)
      setStackCoordinates(updateState)
      setActiveShape({coordinateList: []})
    }
  }

  const createNewShape = () => {
    console.log()
    if(activeShape.coordinateList.length === 0){
      setActiveShape(generateNewShape)
    }
  }



  // TODO generate and place new shape on board if the activeShape state is empty.
  useEffect(() => {
    window.addEventListener('keydown', handleMoveShape)
    addToStack(activeShape)
    createNewShape()
    return () => {
      window.removeEventListener('keydown', handleMoveShape);
    }
  }, [activeShape])


  const row = Y_AXIS_DIMENTION;
  const column = X_AXIS_DIMENTION;
  const grid = []
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < column; j++) {

      // Calculate if coordinate is matching the stack state coordinates
      const stackCoordinate = stackCoordinates?.some(coordinate =>
        coordinate.x_axis === j && coordinate.y_axis === i
      )

      // Calculate if coordinate is matching the active shape state coordinates
      const activeShapeCoordinate = activeShape.coordinateList.some(coordinate =>
        coordinate.x_axis === j && coordinate.y_axis === i
      )

      // used for list
      const test = list_of_shapes.some(shape =>
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
          isActive={activeShapeCoordinate}
          stackCell={stackCoordinate}
        />
      )
    }
  }
  return (
    <div className={styles.gridcontainer}>
      {grid}
    </div>
  )
}
