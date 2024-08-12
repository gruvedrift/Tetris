import styles from './GameBoard.module.scss';
import React, {useEffect, useState} from "react";
import {
  BOTTOM_ROW_COORDINATES, coordinateLimit,
  coordinateLimitForShape, generateLShape, generateLShapeV2,
  generateNewShape,
  isShapeAtBottomOfGameBoard,
  isShapeTouchingStack,
  numberOfRowsToClear, rotateLShape, rotateLshapeV2
} from "../assets/Utils";
import GridCell from "../GridCell/GridCell";
import {X_AXIS_DIMENTION, Y_AXIS_DIMENTION} from "../App.tsx";
import {Color, Coordinate, Shape, ShapeV2} from "../assets/types.tsx";

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

  const test_stack_shape: Shape = {
    coordinateList: [
      {x_axis: 4, y_axis: 8},
      {x_axis: 5, y_axis: 8},
      {x_axis: 4, y_axis: 9},
      {x_axis: 5, y_axis: 9},
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
  const [activeShape, setActiveShape] = useState<Shape>({coordinateList: []})
  // State to hold the 'stack' of tiles at the bottom of the game board.
  const [stackCoordinates, setStackCoordinates] = useState<Coordinate[]>([])

  // New and improoved??
  const [activeShapeV2, setActiveShapeV2] = useState<ShapeV2>(
    // {coordinates: [], collisionCoordinates: [], pivotPointCoordinate: 0}
    generateLShapeV2
  )


  const handleRotateShape= (event: KeyboardEvent) => {
    console.log('Called')
    setActiveShapeV2(prevState => {
      let updatedCollisionCoordinates: Coordinate[]
      let updatedPaddingCoordinates: Coordinate[]
      switch (event.key) {
        case 'ArrowUp':
          updatedCollisionCoordinates = rotateLshapeV2(prevState).collisionCoordinates
          updatedPaddingCoordinates = rotateLshapeV2(prevState).coordinates
          break;
        default:
          return prevState
      }
      return {
        coordinates: updatedPaddingCoordinates,
        collisionCoordinates: updatedCollisionCoordinates,
        pivotPointCoordinate: prevState.pivotPointCoordinate
      }
    })
  }

  // TODO add some key event for rotating shape
  /*
  * Handles updating x-axis coordinates for the active shape on game board.
  * Checks for out of bounds ( GameBoard x-axis limit )
  * **/
  const handleMoveShape = (event: KeyboardEvent) => {

    setActiveShape(prevState => {
      let updatedCoordinates: Coordinate[]
      switch (event.key) {
        case 'ArrowLeft':
          updatedCoordinates = prevState.coordinateList.map(coordinate => (
            {...coordinate, x_axis: coordinate.x_axis  -1}
          ))
          break;
        case 'ArrowRight':
          updatedCoordinates = prevState.coordinateList.map(coordinate => {
           return {...coordinate, x_axis: coordinate.x_axis + 1 }
          })
          break;
        case 'ArrowDown':
          updatedCoordinates = prevState.coordinateList.map(coordinate => (
            {...coordinate, y_axis: coordinate.y_axis + 1 }
          ))
          break;
        case 'ArrowUp':
          updatedCoordinates = prevState.coordinateList.map(coordinate => (
            {...coordinate, y_axis: coordinate.y_axis - 1 }
          ))
          break;
        case 'x':
          updatedCoordinates = rotateLShape(prevState).coordinateList
          break;
        default:
          return prevState

      }

      // Only update coordinates if shape is not out of bounds on next arrow move
      if (!coordinateLimitForShape({coordinateList: updatedCoordinates})) {
        // console.log('Update coordinates are: ', updatedCoordinates)
        return {coordinateList: updatedCoordinates}
      } else {
        return prevState
      }
    });
  };

  // Add coordinates to stack if they have reached the bottom of the game grid. Also, empty the active shape state
  const addToStack = (shape: Shape) => {
    if (isShapeTouchingStack(shape, stackCoordinates) || isShapeAtBottomOfGameBoard(shape)) {
      console.log('Touching!!!!')
      const updateState = stackCoordinates.concat(shape.coordinateList)
      setStackCoordinates(updateState)
      setActiveShape({coordinateList: []})
    }
  }

  const createNewShape = () => {
    if (activeShape.coordinateList.length === 0) {
      setActiveShape(generateLShape)
    }
  }

  const clearBottomRow = () => {
    if(numberOfRowsToClear(stackCoordinates)) {
      console.log('Clear bottom!!!')
      const updatedStackCoordinates = stackCoordinates.filter(coordinate =>
        !BOTTOM_ROW_COORDINATES.coordinateList.some(bottomRowCoordinate =>
          coordinate.x_axis === bottomRowCoordinate.x_axis &&
          coordinate.y_axis === bottomRowCoordinate.y_axis
        )
      )
      updatedStackCoordinates.forEach(coordinate =>
        coordinate.y_axis += 1
      )
      setStackCoordinates(updatedStackCoordinates)
    }
  }



  useEffect(() => {
    // window.addEventListener('keydown', handleMoveShape)
    window.addEventListener('keydown', handleRotateShape)
    // addToStack(activeShape)
    // createNewShape()
    // clearBottomRow()
    return () => {
      // window.removeEventListener('keydown', handleMoveShape);
      window.removeEventListener('keydown', handleRotateShape)
    }
  }, [activeShapeV2])


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

      const collisionCell = activeShapeV2.collisionCoordinates.some(coordinate =>
        coordinate.x_axis === j && coordinate.y_axis === i
      )

      const paddingCell = activeShapeV2.coordinates.some(coordinate =>
        coordinate.x_axis === j && coordinate.y_axis === i
      )
      // Could need to actually move all the 'active' cells to the left and the right when < >
      // Need then to 'lock' the active in shape cells that has reached the bottom of the game screen.

      grid.push(
        <GridCell
          row={i}
          column={j}
          collisionCell={collisionCell}
          stackCell={stackCoordinate}
          paddingCell={paddingCell}
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
