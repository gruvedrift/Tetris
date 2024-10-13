// Helper function to check whether number has reached max coordinate
import {X_AXIS_DIMENTION, Y_AXIS_DIMENTION} from "../App.tsx";
import {Color, Coordinate, Shape, StackClearInfo} from "./types";
import {createFilter} from "vite";


export function calculatePoints(rowsCleared: number) : number {
    const scoring = [0, 100, 300, 500, 1200]
    return scoring[rowsCleared] | 0
}

/**
 * Helper function to calculate how far the Tetromino can 'fall' down on Hard drop.
 * Returns the lowest distance between any overlapping coordinate between the Tetromino and the stack.
 * Returns distance down to bottom of the Well / game board if there are no overlapping coordinates.
 * */
export function calculateHardDropDistance(shapeCoordinates: Coordinate[], stackCoordinates: Coordinate[]): number {

    const shapeColumnNumbers: number[] = []
    shapeCoordinates.forEach((coordinate) => {
        if (!shapeColumnNumbers.includes(coordinate.x_axis) ) {
           shapeColumnNumbers.push(coordinate.x_axis)
        }
      }
    )

    const stackCoordinatesOverlappingShape = stackCoordinates.filter((coordinate) =>
        shapeColumnNumbers.includes(coordinate.x_axis)
    )

    /**
     * If there are no overlapping coordinates on the stack, this means that the shape is free to hard drop
     * the remaining distance down to bottom of the Well.
    * */
    if (stackCoordinatesOverlappingShape.length == 0 ) {
        let lowestCoordinateInShape: Coordinate = {x_axis: 0 , y_axis: 0 }
        shapeCoordinates.forEach((coordinate) => {
            if(coordinate.y_axis > lowestCoordinateInShape.y_axis) {
                lowestCoordinateInShape = coordinate
            }
        })
        return ( Y_AXIS_DIMENTION - lowestCoordinateInShape.y_axis - 1 )
    }

    /* Find the highest coordinate point on the stack on an overlapping column. */
    let highestCoordinateOnStack: Coordinate = { x_axis: 0, y_axis : Y_AXIS_DIMENTION }
    stackCoordinatesOverlappingShape.forEach((coordinate) => {
        if (coordinate.y_axis < highestCoordinateOnStack.y_axis) {
            highestCoordinateOnStack = coordinate
        }
    })

    /* Find the lowest coordinate point on the Tetromino on an overlapping column */
    let lowestShapeCoordinate: Coordinate = {x_axis: 0, y_axis : 0 }
    shapeCoordinates.forEach((coordinate) => {
        if(coordinate.y_axis > lowestShapeCoordinate.y_axis && coordinate.x_axis == highestCoordinateOnStack.x_axis) {
            lowestShapeCoordinate = coordinate
        }
    })

    return (highestCoordinateOnStack.y_axis - lowestShapeCoordinate.y_axis - 1)
}


/* Helper function for updating shape coordinates on user input. <, V, > */
export function updateCoordinatesOnPlayerMove(
    coordinates: Coordinate[],
    shapeCoordinates: Coordinate[],
    x_adjust: number,
    y_adjust: number,
): { updatedCoordinates: Coordinate[], updatedShapeCoordinates: Coordinate[] }
{
    const updatedCoordinates = coordinates.map(coordinate => (
        { x_axis: coordinate.x_axis + x_adjust ,y_axis: coordinate.y_axis + y_adjust }
    ))
    const updatedShapeCoordinates = shapeCoordinates.map(coordinate => (
        { x_axis: coordinate.x_axis + x_adjust ,y_axis: coordinate.y_axis + y_adjust }
    ))
    return {updatedCoordinates, updatedShapeCoordinates}
}


export function collisionCoordinateOutOfBounds(collisionCoordinates: Coordinate[]): boolean {
    return collisionCoordinates.some(coordinate =>
        coordinate.x_axis > X_AXIS_DIMENTION -1 || coordinate.y_axis > Y_AXIS_DIMENTION -1 ||
        coordinate.x_axis < 0 || coordinate.y_axis < 0
    )
}



// Returns true if any coordinate in shape is 'touching' the bottom stack.
// True on coordinate y-axis - 1 to 'stack' on top.
// TODO expand logic to block on sideways movement into the side of a stack partition
export function isShapeTouchingStack(shape: Shape, stackCoordinates: Coordinate[]): boolean {
    // Find which coordinates are on the top of the stack for each column, should only check if they are touching them
    return shape.shapeCoordinates.some(shapeCoordinates =>
        stackCoordinates.some(stackCoordinates =>
            shapeCoordinates.x_axis === stackCoordinates.x_axis &&
            shapeCoordinates.y_axis === stackCoordinates.y_axis - 1
        )
    )
}

// Returns true if any coordinate in shape is 'touching' bottom of the board.
// True on coordinate y-axis -1 to 'stack' on bottom.
export function isShapeAtBottomOfGameBoard(shape: Shape): boolean {
    return shape.shapeCoordinates.some(coordinate =>
        coordinate.y_axis === Y_AXIS_DIMENTION - 1
    )
}


// Pick new random shape from list
export function generateNewRandomShape(): Shape {
    const shapeList = ['I','J','L','O','S','T','Z']
    const pickedLetter = shapeList[Math.floor(Math.random() * shapeList.length)]
    switch (pickedLetter){
        case 'I': return generateIShape()
        case 'J': return generateJShape()
        case 'L': return generateLShape()
        case 'O': return generateOShape()
        case 'S': return generateSShape()
        case 'T': return generateTShape()
        case 'Z': return generateZShape()
    }
}

export function generateIShape(): Shape {
    return {
        coordinates: [
            {x_axis: 3, y_axis: 0},
            {x_axis: 3, y_axis: 1},
            {x_axis: 3, y_axis: 2},
            {x_axis: 3, y_axis: 3},
            {x_axis: 4, y_axis: 0},
            {x_axis: 4, y_axis: 1},
            {x_axis: 4, y_axis: 2},
            {x_axis: 4, y_axis: 3},
            {x_axis: 5, y_axis: 0},
            {x_axis: 5, y_axis: 1},
            {x_axis: 5, y_axis: 2},
            {x_axis: 5, y_axis: 3},
            {x_axis: 6, y_axis: 0},
            {x_axis: 6, y_axis: 1},
            {x_axis: 6, y_axis: 2},
            {x_axis: 6, y_axis: 3},
        ],
        shapeCoordinates: [
            {x_axis: 3, y_axis: 1},
            {x_axis: 4, y_axis: 1},
            {x_axis: 5, y_axis: 1},
            {x_axis: 6, y_axis: 1},
        ],
        pivotPointCoordinate: 6,
        color: Color.CYAN
    }
}

export function generateJShape(): Shape {
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
        shapeCoordinates: [
            {x_axis: 4, y_axis: 0},
            {x_axis: 4, y_axis: 1},
            {x_axis: 4, y_axis: 2},
            {x_axis: 3, y_axis: 2},
        ],
        pivotPointCoordinate: 4,
        color: Color.BLUE
    }
}

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
        shapeCoordinates: [
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
        shapeCoordinates: [
            {x_axis: 4, y_axis: 0},
            {x_axis: 4, y_axis: 1},
            {x_axis: 5, y_axis: 0},
            {x_axis: 5, y_axis: 1},
        ],
        pivotPointCoordinate: 0,
        color: Color.YELLOW
    }
}

export function generateSShape(): Shape {
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
        shapeCoordinates: [
            {x_axis: 4, y_axis: 0},
            {x_axis: 5, y_axis: 0},
            {x_axis: 3, y_axis: 1},
            {x_axis: 4, y_axis: 1},
        ],
        pivotPointCoordinate: 4,
        color: Color.GREEN
    }
}

export function generateTShape(): Shape {
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
        shapeCoordinates: [
            {x_axis: 4, y_axis: 0},
            {x_axis: 3, y_axis: 1},
            {x_axis: 4, y_axis: 1},
            {x_axis: 5, y_axis: 1},
        ],
        pivotPointCoordinate: 4,
        color: Color.PURPLE
    }
}

export function generateZShape(): Shape {
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
        shapeCoordinates: [
            {x_axis: 3, y_axis: 0},
            {x_axis: 4, y_axis: 0},
            {x_axis: 4, y_axis: 1},
            {x_axis: 5, y_axis: 1},
        ],
        pivotPointCoordinate: 4,
        color: Color.RED
    }
}

/**
 * Simple rotate around pivot algorithm:
 * new_x = pivot.x - (y - pivot.y)
 * new_y = pivot.y + (x - pivot.x)
 * Hardcoded skip rotate on shape that does not need rotation (O)
 * */
export function rotateShape(shape: Shape): Shape {
    if (shape.pivotPointCoordinate == 6 ) return rotateIShape(shape)
    if (shape.pivotPointCoordinate == 0 ) return shape

    const pivotCoordinate = shape.coordinates[shape.pivotPointCoordinate]
    return {
        coordinates: shape.coordinates,
        shapeCoordinates: shape.shapeCoordinates.map(coordinate => {
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

// Hardcoded 'virtual' center of 4x4 grid for I-Shape
export function rotateIShape(shape: Shape): Shape {
    const pivot_x = shape.coordinates[shape.pivotPointCoordinate].x_axis + 0.5;
    const pivot_y = shape.coordinates[shape.pivotPointCoordinate].y_axis - 0.5

    return {
        coordinates: shape.coordinates,
        shapeCoordinates: shape.shapeCoordinates.map(coordinate => {
            const new_x = pivot_x - (coordinate.y_axis - pivot_y);
            const new_y = pivot_y + (coordinate.x_axis - pivot_x);

            return {
                x_axis: Math.round(new_x),
                y_axis: Math.round(new_y),
            };
        }),
        pivotPointCoordinate: shape.pivotPointCoordinate, // Can stay as-is
        color: shape.color,
    };
}


/**
 * Gathers and returns information about how many rows and which coordinates should ( if any ) be cleared from the stack.
 * */
export function getStackClearingInfo(stackCoordinates: Coordinate[]): StackClearInfo {
    const stackClearInfo: StackClearInfo = { coordinatesToClear: [], rowsToClear : [] }

    // Check row by row
    for(let row = 0 ; row < Y_AXIS_DIMENTION ; row++) {
        const rowToCheck = generateRowCoordinates(row)
        if(rowToCheck.every(rowCoordinate =>
          stackCoordinates.some(coordinate =>
            rowCoordinate.x_axis === coordinate.x_axis &&
            rowCoordinate.y_axis === coordinate.y_axis )
        )){
            stackClearInfo.coordinatesToClear.push(...rowToCheck)
            stackClearInfo.rowsToClear.push(row)
        }
    }

    // could calculate score here
    return stackClearInfo
}


/* Generate coordinates in a row number. */
function generateRowCoordinates(rowNumber: number): Coordinate[] {
    const coordinateList: Coordinate[] = []
    for(let x = 0; x < X_AXIS_DIMENTION; x ++){
        coordinateList.push({x_axis: x, y_axis: rowNumber})
    }
    return coordinateList
}



