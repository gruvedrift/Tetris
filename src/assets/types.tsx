export interface Coordinate {
    x_axis: number
    y_axis: number
}

export interface Shape {
    coordinates: Coordinate[]
    collisionCoordinates: Coordinate[],
    pivotPointCoordinate: number,
    color: Color,
}


// TODO implement different colors for different shapes
export enum Color {
    CYAN,
    BLUE,
    ORANGE,
    RED,
    GREEN,
    YELLOW,
    PURPLE
}

// TODO cook up a structure for the stack. Just holding regular coordinates are too messy.
// TODO copy the
export interface StackCoordinate extends Coordinate{
    color: Color
}

export interface Stack {
    coordinateList: StackCoordinate[]
}
