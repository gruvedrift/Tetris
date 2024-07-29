// Helper function to check whether number has reached max coordinate
import styles from '../GridCell/GridCelll.module.scss'
import {Shape} from "../game-board/GameBoard";
export function coordinateLimit(num: number): boolean {
  return num > 9 || num < 0;
}

// Helper function to make the ternary styling easier to read
export function getStyling(isActive: boolean, reachedBottom: boolean, inShape: boolean) : string {
  switch (true) {
    case isActive && reachedBottom && !inShape: // Bottom of the page.
      return styles.reachedbottom
    case !isActive && reachedBottom && !inShape: // Cell or shape has reached bottom, change color.
      return styles.reachedbottom
    case isActive && !reachedBottom && !inShape: // Active cell moving around with arrows.
      return styles.isactive
    case !isActive && !reachedBottom && !inShape: // Regular background cell, no special styling.
      return styles.gridcell
    case inShape && !isActive && !reachedBottom: // Give the shape custom styling.
      return styles.inshape
    default:
      return styles.gridcell // Default case is just give regular styling
  }
}


export function coordinateLimitForShape(shape: Shape): boolean {
  console.log('Checking these coordinates: ', shape)
  return shape.coordinateList.some(coordinate =>
    (coordinate.x_axis || coordinate.y_axis) > 9 ||
    (coordinate.x_axis || coordinate.y_axis) < 0
  )
}


