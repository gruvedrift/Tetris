export interface Coordinate {
    x_axis: number
    y_axis: number
}

export interface Shape {
    coordinates: Coordinate[]
    collisionCoordinates: Coordinate[],
    pivotPointCoordinate: number,
    color: Color
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
