import styles from './GameBoard.module.scss';
import React, {useEffect, useState} from "react";
import {
    collisionCoordinateOutOfBounds,
    generateNewRandomShape,
    isShapeAtBottomOfGameBoard,
    isShapeTouchingStack,
    numberOfRowsToClear, rotateShape, updateCoordinatesOnPlayerMove
} from "../assets/Utils";
import GridCell from "../GridCell/GridCell";
import {X_AXIS_DIMENTION, Y_AXIS_DIMENTION} from "../App.tsx";
import { Coordinate, Shape, StackCoordinate, Stack, Color} from "../assets/types.tsx";
import {types} from "sass";

const GameBoard: React.FC = () => {
    return (
        <div className={styles.gameboard}>
            <Grid/>
        </div>
    )
}

export default GameBoard

// TODO reverse the grid so that 0,0 is in the bottom left and 9,9 is in the upper right
const Grid: React.FC = () => {

    // State to hold the currently active ' moving ' shape
    const [activeShapeV2, setActiveShapeV2] = useState<Shape>(generateNewRandomShape)
    console.log('This is the active shape', activeShapeV2)

    // State to hold the 'stack' of tiles at the bottom of the game board.
    const [stackCoordinates, setStackCoordinates] = useState<Coordinate[]>([])
    console.log('These are the sack coordinates: ', stackCoordinates)

    // Test state to hold the new and improved stack
    const [stack, setStack] = useState<Stack>({coordinateList:[]})
    console.log('TEST STACK COORDINATES: ', stack)



    /*
    * Handles updating x-axis coordinates for the active shape on game board.
    * Checks for out of bounds ( GameBoard x-axis limit )
    * **/
    const handleRotateShape = (event: KeyboardEvent) => {
        setActiveShapeV2(prevState => {

            let updatedCoordinates: Coordinate[]
            let updatedCollisionCoordinates: Coordinate[]
            const rotatedShape = rotateShape(prevState)
            switch (event.key) {
                case 'ArrowUp':
                    updatedCoordinates = rotatedShape.coordinates
                    updatedCollisionCoordinates = rotatedShape.collisionCoordinates
                    break;
                case 'ArrowDown':
                    ({updatedCoordinates, updatedCollisionCoordinates} = updateCoordinatesOnPlayerMove(
                        prevState.coordinates,
                        prevState.collisionCoordinates,
                        0, 1
                    ))
                    break;
                case 'ArrowLeft':
                    ({updatedCoordinates, updatedCollisionCoordinates} = updateCoordinatesOnPlayerMove(
                        prevState.coordinates,
                        prevState.collisionCoordinates,
                        -1, 0
                    ))
                    break;
                case 'ArrowRight':
                    ({updatedCoordinates, updatedCollisionCoordinates} = updateCoordinatesOnPlayerMove(
                        prevState.coordinates,
                        prevState.collisionCoordinates,
                        1,0
                    ))
                    break;
                default:
                    return prevState
            }

            // Update only if collision coordinates does not touch edges. Ensures rotational safety
            if (!collisionCoordinateOutOfBounds(updatedCollisionCoordinates)) {
                return {
                    coordinates: updatedCoordinates,
                    collisionCoordinates: updatedCollisionCoordinates,
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
        if (isShapeTouchingStack(shape, stackCoordinates) || isShapeAtBottomOfGameBoard(shape)) {
            console.log('Touching!!!!')
            // TODO could move this to a separate function actually
            const test: Stack = { coordinateList: []}
            shape.collisionCoordinates.forEach(coordinate =>
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

            setStackCoordinates(prevState => {
                return prevState.concat(shape.collisionCoordinates)
            })
            setActiveShapeV2(generateNewRandomShape)
        }
    }

    // TODO should consider counting up number of potential rows to clear in one swoop
    // TODO must move rows above cleared x number of y-coordinates down
    // TODO handle case where maybe every other row is cleared
    // TODO handle multiple rows being cleared adjusts stock accordingly and settle to the bottom.
    // Could potentially keep track of a single row on stack and move it based on how many rows below itself was cleared.
    // ... fuck me dude
    const clearBottomRow = () => {
        const coordinatesToClear = numberOfRowsToClear(stackCoordinates)
        const clearedRows = coordinatesToClear / 10
        if (coordinatesToClear.length > 0) {
            console.log('clearing row(s)!!!')
            const updatedStackCoordinates = stackCoordinates.filter(stackCoordinate =>
                !coordinatesToClear.some(coordinateToClear =>
                    stackCoordinate.x_axis === coordinateToClear.x_axis &&
                    stackCoordinate.y_axis === coordinateToClear.y_axis
                )
            )

            updatedStackCoordinates.forEach(coordinate =>
                coordinate.y_axis += 1
            )
            setStackCoordinates(updatedStackCoordinates)
        }
    }


    useEffect(() => {
        window.addEventListener('keydown', handleRotateShape)
        // TODO fix this hardcoded stack logic
        addToStack(activeShapeV2)
        // clearBottomRow()
        return () => {
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


            const test = stack.coordinateList.find( coordinate =>
              coordinate.x_axis === j && coordinate.y_axis === i
            )?.color

            const collisionCell = activeShapeV2.collisionCoordinates.some(coordinate =>
                coordinate.x_axis === j && coordinate.y_axis === i
            )

            const paddingCell = activeShapeV2.coordinates.some(coordinate =>
                coordinate.x_axis === j && coordinate.y_axis === i
            )

            const shapeColor = activeShapeV2.color

            // Could need to actually move all the 'active' cells to the left and the right when < >
            // Need then to 'lock' the active in shape cells that has reached the bottom of the game screen.

            grid.push(
                <GridCell
                    row={i}
                    column={j}
                    collisionCell={collisionCell}
                    stackCell={test}
                    paddingCell={paddingCell}
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
