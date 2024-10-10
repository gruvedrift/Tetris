export interface Coordinate {
    x_axis: number
    y_axis: number
}

export interface Shape {
    // coordinates acts as a 'board' on which the shape is placed. Used for pivot rotations
    coordinates: Coordinate[]
    shapeCoordinates: Coordinate[],
    pivotPointCoordinate: number,
    color: Color,
}

export enum Color {
    CYAN,
    BLUE,
    ORANGE,
    RED,
    GREEN,
    YELLOW,
    PURPLE
}

export interface StackCoordinate extends Coordinate{
    color: Color
}

export interface Stack {
    coordinateList: StackCoordinate[]
}

export interface StackClearInfo {
    coordinatesToClear: Coordinate[]
    rowsToClear: number[]
}
