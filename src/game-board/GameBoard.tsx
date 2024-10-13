import styles from './GameBoard.module.scss';
import React, {useEffect, useState} from "react";
import {
    calculateHardDropDistance,
    calculatePoints,
    collisionCoordinateOutOfBounds,
    generateNewRandomShape, getStackClearingInfo,
    isShapeAtBottomOfGameBoard,
    isShapeTouchingStack,
    rotateShape, updateCoordinatesOnPlayerMove
} from "../assets/Utils";
import GridCell from "../GridCell/GridCell";
import {X_AXIS_DIMENTION, Y_AXIS_DIMENTION} from "../App.tsx";
import { Coordinate, Shape, Stack } from "../assets/types.tsx";

interface GameBoardProps {
    onRowClear: (points: number ) => void
}

const GameBoard: React.FC<GameBoardProps> = ({onRowClear}) => {
    return (
        <div className={styles.gameboard}>
            <Grid onRowClear={onRowClear}/>
        </div>
    )
}

export default GameBoard

interface GridProps {
    onRowClear: (points: number) => void
}

// TODO reverse the grid so that 0,0 is in the bottom left and 9,9 is in the upper right
const Grid: React.FC<GridProps>  = ({onRowClear}) => {

    // State to hold the currently active ' moving ' shape
    const [activeShape, setActiveShape] = useState<Shape>(generateNewRandomShape)

    // State to hold the 'stack' of tiles at the bottom of the game board.
    const [stack, setStack] = useState<Stack>({coordinateList:[]})

    /**
     * Handles updating x-axis coordinates for the active shape on game board.
     * Checks for out of bounds ( GameBoard x-axis limit )
    * **/
    const handleRotateShape = (event: KeyboardEvent) => {
        setActiveShape(prevState => {

            let updatedCoordinates: Coordinate[]
            let updatedShapeCoordinates: Coordinate[]
            const rotatedShape = rotateShape(prevState)
            switch (event.key) {
                case 'ArrowUp':
                    updatedCoordinates = rotatedShape.coordinates
                    updatedShapeCoordinates = rotatedShape.shapeCoordinates
                    break;
                case 'ArrowDown':
                    ({updatedCoordinates, updatedShapeCoordinates} = updateCoordinatesOnPlayerMove(
                        prevState.coordinates,
                        prevState.shapeCoordinates,
                        0, 1
                    ))
                    break;
                case 'ArrowLeft':
                    ({updatedCoordinates, updatedShapeCoordinates} = updateCoordinatesOnPlayerMove(
                        prevState.coordinates,
                        prevState.shapeCoordinates,
                        -1, 0
                    ))
                    break;
                case 'ArrowRight':
                    ({updatedCoordinates, updatedShapeCoordinates} = updateCoordinatesOnPlayerMove(
                        prevState.coordinates,
                        prevState.shapeCoordinates,
                        1,0
                    ))
                    break;
                case ' ':
                    ({updatedCoordinates, updatedShapeCoordinates} = updateCoordinatesOnPlayerMove(
                      prevState.coordinates,
                      prevState.shapeCoordinates,
                      0, calculateHardDropDistance(prevState.shapeCoordinates, stack.coordinateList)
                ))
                    break;
                default:
                    return prevState
            }

            // Update only if collision coordinates does not touch edges. Ensures rotational safety
            if (!collisionCoordinateOutOfBounds(updatedShapeCoordinates)) {
                return {
                    coordinates: updatedCoordinates,
                    shapeCoordinates: updatedShapeCoordinates,
                    pivotPointCoordinate: prevState.pivotPointCoordinate,
                    color: prevState.color
                }
            } else {
                return prevState
            }
        })
    }

    // Add coordinates to stack if they have reached the bottom of the game grid. Also, empty the active shape state
    // Best practice is to du functional state updates whenever state is dependent on previous state!!
    const addToStack = (shape: Shape) => {
        if (isShapeTouchingStack(shape, stack.coordinateList) || isShapeAtBottomOfGameBoard(shape)) {
            console.log('Touching!!!!')
            // TODO could move this to a separate function actually
            const test: Stack = { coordinateList: []}
            shape.shapeCoordinates.forEach(coordinate =>
              test.coordinateList.push(
                {
                    x_axis: coordinate.x_axis,
                    y_axis: coordinate.y_axis,
                    color: shape.color
                }
              )
            )
            setStack(prevState => {
                return {
                    coordinateList: prevState.coordinateList.concat(test.coordinateList)
                }
            })
            setActiveShape(generateNewRandomShape)
        }
    }


    // TODO merge coordinate list and row number list into a single logical step
    const clearBottomRow = () => {
        const { coordinatesToClear, rowsToClear }  = getStackClearingInfo(stack.coordinateList)

        const lowestRow = Math.min(...rowsToClear)
        console.log('I want to clear these rows', rowsToClear)

        if (coordinatesToClear.length > 0) {
            console.log('clearing row(s)!!!')
            const updatedStackCoordinates = stack.coordinateList.filter(stackCoordinate =>
                !coordinatesToClear.some(coordinateToClear =>
                    stackCoordinate.x_axis === coordinateToClear.x_axis &&
                    stackCoordinate.y_axis === coordinateToClear.y_axis
                )
            )
            updatedStackCoordinates.forEach((coordinate) => {
                   if(coordinate.y_axis < lowestRow) {
                       coordinate.y_axis += rowsToClear.length
                   }
                }
            )

            setStack({
                coordinateList: updatedStackCoordinates
                }
            )
            onRowClear(calculatePoints(rowsToClear.length))
        }
    }


    useEffect(() => {
        window.addEventListener('keydown', handleRotateShape)
        addToStack(activeShape)
        clearBottomRow()
        return () => {
            window.removeEventListener('keydown', handleRotateShape)
        }
    }, [activeShape] )



    const row = Y_AXIS_DIMENTION;
    const column = X_AXIS_DIMENTION;
    const grid = []
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {

            const stackCell = stack.coordinateList.find( coordinate =>
              coordinate.x_axis === j && coordinate.y_axis === i
            )?.color

            const collisionCell = activeShape.shapeCoordinates.some(coordinate =>
                coordinate.x_axis === j && coordinate.y_axis === i
            )

            const shapeColor = activeShape.color

            grid.push(
                <GridCell
                    row={i}
                    column={j}
                    collisionCell={collisionCell}
                    stackCell={stackCell}
                    shapeColor={shapeColor}
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
