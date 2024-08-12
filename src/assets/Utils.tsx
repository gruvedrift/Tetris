// Helper function to check whether number has reached max coordinate
import styles from '../GridCell/GridCelll.module.scss'
import {X_AXIS_DIMENTION, Y_AXIS_DIMENTION} from "../App.tsx";
import {Coordinate, Shape, ShapeV2} from "./types";

export function coordinateLimit(num: number): boolean {
  return num > 9 || num < 0;
}

// Helper function to make the ternary styling easier to read
export function getStyling(collisionCell: boolean, stackCell: boolean, paddingCell: boolean): string {
  switch (true) {
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


// Basic check of shape will be 'out of bound' on next move.
export function coordinateLimitForShape(shape: Shape): boolean {
  return shape.coordinateList.some(coordinate =>
    coordinate.x_axis > X_AXIS_DIMENTION - 1 || coordinate.y_axis > Y_AXIS_DIMENTION - 1 ||
    coordinate.x_axis < 0 || coordinate.y_axis < 0
  )
}

// Returns true if any coordinate in shape is 'touching' the bottom stack.
// True on coordinate y-axis - 1 to 'stack' on top.
export function isShapeTouchingStack(shape: Shape, stackCoordinates: Coordinate[]): boolean {
  return shape.coordinateList.some(shapeCoordinates =>
    stackCoordinates.some(stackCoordinates =>
      shapeCoordinates.x_axis === stackCoordinates.x_axis &&
      shapeCoordinates.y_axis === stackCoordinates.y_axis - 1
    )
  )
}

// Returns true if any coordinate in shape is 'touching' bottom of the board.
// True on coordinate y-axis -1 to 'stack' on bottom.
export function isShapeAtBottomOfGameBoard(shape: Shape): boolean {
  return shape.coordinateList.some(coordinate =>
    coordinate.y_axis === Y_AXIS_DIMENTION - 1
  )
}

// Helper function to generate new shapes.
// TODO make shape hold color also?
export function generateNewShape(): Shape {
  return {
    coordinateList: [
      {x_axis: 4, y_axis: 0},
      {x_axis: 4, y_axis: 1},
      {x_axis: 5, y_axis: 0},
      {x_axis: 5, y_axis: 1},
    ]
  }
}

// Generate L shape for testing
export function generateLShape(): Shape {
  return {
    coordinateList: [
      {x_axis: 4, y_axis: 0},
      {x_axis: 4, y_axis: 1},
      {x_axis: 4, y_axis: 2},
      {x_axis: 5, y_axis: 2},
    ]
  }
}

// Generate L shape for testing
export function generateLShapeV2(): ShapeV2 {
  return {
    // Padding for shape
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
  }
}

export function rotateLshapeV2(shape: ShapeV2): ShapeV2 {
  return generateLShapeV2()
}


// Rotates the L-shape 90 degrees if possible ( without surpassing the board limits )
// Simple math formula from geometry (x, y) - > (y, -x).
// Add 9 to x-coordinate and 0 to y coordinate to adjust for no negative coordinates
export function rotateLShape(shape: Shape): Shape {
  const pivot = shape.coordinateList[3]
  console.log('Pivot point', pivot)
  return {
    coordinateList: shape.coordinateList.map(coordinate => {
      const translatedX = coordinate.x_axis = pivot.x_axis
      const translatedY = coordinate.y_axis = pivot.y_axis

      const rotatedX = translatedY
      const rotatedY = -translatedX
      return {
        x_axis: rotatedX + pivot.x_axis,
        y_axis: ( rotatedY + pivot.y_axis * -1) + 9
        // y_axis: (coordinate.x_axis * -1) + 9,
      }
    })
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


// TODO implement
export function adjustStackAfterRowClear(stackCoordinates: Coordinate[]): Coordinate[] {
  return []
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
