export interface Coordinate {
    x_axis: number
    y_axis: number
}

export interface Shape {
    coordinateList: Coordinate[]
    // color: Color
}

export interface ShapeV2 {
    coordinates: Coordinate[]
    collisionCoordinates: Coordinate[],
    pivotPointCoordinate: number , // Should always be in center of coordinates
}

// TODO use this mayhaps
export enum Color {
    WHITE,
    BLUE,
    RED,
    GREEN,
    YELLOW,
    PURPLE
}
