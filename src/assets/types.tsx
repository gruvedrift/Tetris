export interface Coordinates {
    x_axis: number
    y_axis: number
}

export interface Shape {
    coordinateList: Coordinates[]
    // color: Color
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
