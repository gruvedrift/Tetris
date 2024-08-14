// Helper function to check whether number has reached max coordinate
import styles from '../GridCell/GridCelll.module.scss'
import {X_AXIS_DIMENTION, Y_AXIS_DIMENTION} from "../App.tsx";
import {Color, Coordinate, Shape} from "./types";


/* Helper function for updating shape coordinates on user input. <, V, > */
export function updateCoordinatesOnPlayerMove(
    coordinates: Coordinate[],
    collisionCoordinates: Coordinate[],
    x_adjust: number,
    y_adjust: number,
): {updatedCoordinates: Coordinate[], updatedCollisionCoordinates: Coordinate[]} {
    const updatedCoordinates = coordinates.map(coordinate => (
        { x_axis: coordinate.x_axis + x_adjust ,y_axis: coordinate.y_axis + y_adjust }
    ))
    const updatedCollisionCoordinates = collisionCoordinates.map(coordinate => (
        { x_axis: coordinate.x_axis + x_adjust ,y_axis: coordinate.y_axis + y_adjust }
    ))
    return {updatedCoordinates, updatedCollisionCoordinates}
}

// Helper function to make the ternary styling easier to read
export function getStyling(collisionCell: boolean, stackCell: boolean, paddingCell: boolean): string {
    switch (true) {
        case paddingCell && stackCell:
            return styles.stackcell
        case collisionCell && paddingCell:
            return styles.collisioncell
        case !collisionCell && paddingCell:
            return styles.paddingcell
        case collisionCell && stackCell: // Bottom of the page.
            return styles.stackcell
        case !collisionCell && stackCell: // Cell or shape has reached bottom, change color.
            return styles.stackcell
        case collisionCell && !stackCell: // Active cell moving around with arrows.
            return styles.collisioncell
        case !collisionCell && !stackCell: // Regular background cell, no special styling.
            return styles.gridcell
        default:
            return styles.gridcell // Default case is just give regular styling
    }
}

export function collisionCoordinateOutOfBounds(collisionCoordinates: Coordinate[]): boolean {
    return collisionCoordinates.some(coordinate =>
        coordinate.x_axis > X_AXIS_DIMENTION -1 || coordinate.y_axis > Y_AXIS_DIMENTION -1 ||
        coordinate.x_axis < 0 || coordinate.y_axis < 0
    )
}


// Returns true if any coordinate in shape is 'touching' the bottom stack.
// True on coordinate y-axis - 1 to 'stack' on top.
// TODO implement logic to avoid shape 'sticking' to stack when moving sideways
export function isShapeTouchingStack(shape: Shape, stackCoordinates: Coordinate[]): boolean {
    return shape.collisionCoordinates.some(shapeCoordinates =>
        stackCoordinates.some(stackCoordinates =>
            shapeCoordinates.x_axis === stackCoordinates.x_axis &&
            shapeCoordinates.y_axis === stackCoordinates.y_axis - 1
        )
    )
}

// Returns true if any coordinate in shape is 'touching' bottom of the board.
// True on coordinate y-axis -1 to 'stack' on bottom.
export function isShapeAtBottomOfGameBoard(shape: Shape): boolean {
    return shape.collisionCoordinates.some(coordinate =>
        coordinate.y_axis === Y_AXIS_DIMENTION - 1
    )
}

// Generate L shape for testing
export function generateLShape(): Shape {
    return {
        coordinates: [
            {x_axis: 3, y_axis: 0},
            {x_axis: 3, y_axis: 1},
            {x_axis: 3, y_axis: 2},
            {x_axis: 4, y_axis: 0},
            {x_axis: 4, y_axis: 1},
            {x_axis: 4, y_axis: 2},
            {x_axis: 5, y_axis: 0},
            {x_axis: 5, y_axis: 1},
            {x_axis: 5, y_axis: 2},
        ],
        collisionCoordinates: [
            {x_axis: 4, y_axis: 0},
            {x_axis: 4, y_axis: 1},
            {x_axis: 4, y_axis: 2},
            {x_axis: 5, y_axis: 2},
        ],
        pivotPointCoordinate: 4,
        color: Color.ORANGE
    }
}

export function generateOShape(): Shape {
    return {
        coordinates: [
            {x_axis: 3, y_axis: 0},
            {x_axis: 3, y_axis: 1},
            {x_axis: 3, y_axis: 2},
            {x_axis: 4, y_axis: 0},
            {x_axis: 4, y_axis: 1},
            {x_axis: 4, y_axis: 2},
            {x_axis: 5, y_axis: 0},
            {x_axis: 5, y_axis: 1},
            {x_axis: 5, y_axis: 2},
            {x_axis: 6, y_axis: 0},
            {x_axis: 6, y_axis: 1},
            {x_axis: 6, y_axis: 2},
        ],
        collisionCoordinates: [
            {x_axis: 4, y_axis: 0},
            {x_axis: 4, y_axis: 1},
            {x_axis: 5, y_axis: 0},
            {x_axis: 5, y_axis: 1},
        ],
        pivotPointCoordinate: 0,
        color: Color.YELLOW
    }
}

/**
 * Simple rotate around pivot algorithm:
 * new_x = pivot.x - (y - pivot.y)
 * new_y = pivot.y + (x - pivot.x)
 * Hardcoded skip rotate on shape that does not need rotation (O)
 * */
export function rotateShape(shape: Shape): Shape {
    if (shape.pivotPointCoordinate == 0 ) return shape

    const pivotCoordinate = shape.coordinates[shape.pivotPointCoordinate]
    return {
        coordinates: shape.coordinates,
        collisionCoordinates: shape.collisionCoordinates.map(coordinate => {
            const new_x = pivotCoordinate.x_axis -  (coordinate.y_axis - pivotCoordinate.y_axis)
            const new_y = pivotCoordinate.y_axis +  (coordinate.x_axis - pivotCoordinate.x_axis)
            return {
                x_axis: new_x,
                y_axis: new_y
            }
        }),
        pivotPointCoordinate: shape.pivotPointCoordinate,
        color: shape.color,
    }
}


// Helper function to return how many, if any rows should be cleared from the board.
// Number represents the number of rows from the bottom to be cleared.
// -1 represents no row
// temporarily set to return true / false and clear bottom.
// TODO extend to clear multiple rows at a time to manage some scoring system for multiple rows on stack solved.
export function numberOfRowsToClear(stackCoordinates: Coordinate[]): boolean {
    return BOTTOM_ROW_COORDINATES.coordinateList.every(bottomRowCoordinates =>
        stackCoordinates.some(coordinate =>
            bottomRowCoordinates.x_axis === coordinate.x_axis &&
            bottomRowCoordinates.y_axis === coordinate.y_axis
        )
    )
}

export const BOTTOM_ROW_COORDINATES = {
    coordinateList: [
        {x_axis: 0, y_axis: 9},
        {x_axis: 1, y_axis: 9},
        {x_axis: 2, y_axis: 9},
        {x_axis: 3, y_axis: 9},
        {x_axis: 4, y_axis: 9},
        {x_axis: 5, y_axis: 9},
        {x_axis: 6, y_axis: 9},
        {x_axis: 7, y_axis: 9},
        {x_axis: 8, y_axis: 9},
        {x_axis: 9, y_axis: 9},
    ]
}
