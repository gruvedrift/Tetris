import styles from './GameBoard.module.scss';
import React, {useEffect, useState} from "react";
import {
    BOTTOM_ROW_COORDINATES, collisionCoordinateOutOfBounds, generateIShape, generateJShape,
    generateLShape, generateNewRandomShape, generateOShape, generateSShape, generateTShape, generateZShape,
    isShapeAtBottomOfGameBoard,
    isShapeTouchingStack,
    numberOfRowsToClear, rotateShape, updateCoordinatesOnPlayerMove
} from "../assets/Utils";
import GridCell from "../GridCell/GridCell";
import {X_AXIS_DIMENTION, Y_AXIS_DIMENTION} from "../App.tsx";
import { Coordinate, Shape} from "../assets/types.tsx";

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

    // State to hold the 'stack' of tiles at the bottom of the game board.
    const [stackCoordinates, setStackCoordinates] = useState<Coordinate[]>([])



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
    const addToStack = (shape: Shape) => {
        if (isShapeTouchingStack(shape, stackCoordinates) || isShapeAtBottomOfGameBoard(shape)) {
            console.log('Touching!!!!')
            const updateState = stackCoordinates.concat(shape.collisionCoordinates)
            setStackCoordinates(updateState)
            setActiveShapeV2(generateNewRandomShape)
        }
    }

    // Might never need this
    // const createNewShape = () => {
    //     if (activeShapeV2.coordinates.length === 0) {
    //         setActiveShapeV2(generateNewRandomShape)
    //     }
    // }

    // TODO should consider counting up number of potential rows to clear in one swoop
    const clearBottomRow = () => {
        if (numberOfRowsToClear(stackCoordinates)) {
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
        window.addEventListener('keydown', handleRotateShape)
        // TODO fix this hardcoded stack logic
        addToStack(activeShapeV2)
        // createNewShape()
        clearBottomRow()
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
                    stackCell={stackCoordinate}
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
