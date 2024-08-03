// Helper function to check whether number has reached max coordinate
import styles from '../GridCell/GridCelll.module.scss'
import {Shape} from "../game-board/GameBoard";
import {X_AXIS_DIMENTION, Y_AXIS_DIMENTION} from "../App.tsx";
export function coordinateLimit(num: number): boolean {
  return num > 9 || num < 0;
}

// Helper function to make the ternary styling easier to read
export function getStyling(isActive: boolean, stackCell: boolean) : string {
  switch (true) {
    case isActive && stackCell: // Bottom of the page.
      return styles.stackcell
    case !isActive && stackCell: // Cell or shape has reached bottom, change color.
      return styles.stackcell
    case isActive && !stackCell: // Active cell moving around with arrows.
      return styles.isactive
    case !isActive && !stackCell: // Regular background cell, no special styling.
      return styles.gridcell
    default:
      return styles.gridcell // Default case is just give regular styling
  }
}


export function coordinateLimitForShape(shape: Shape): boolean {
  console.log('Checking these coordinates: ', shape)
  return shape.coordinateList.some(coordinate =>
    coordinate.x_axis > X_AXIS_DIMENTION - 1  || coordinate.y_axis > Y_AXIS_DIMENTION -1  ||
    coordinate.x_axis < 0 ||  coordinate.y_axis  < 0
  )
}

export function isShapeAtBottomOfGameBoard(shape: Shape): boolean {
  return shape.coordinateList.some(coordinate =>
      coordinate.y_axis === Y_AXIS_DIMENTION -1
  )
}


