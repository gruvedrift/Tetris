import React from "react";
import styles from "./GridCelll.module.scss"
import {Color} from "../assets/types";

interface GridCellProps {
  row: number,
  column: number,
  collisionCell: boolean,
  stackCell: Color,
  shapeColor: Color
}

const GridCell: React.FC<GridCellProps> = (cellProps) => {
  const {row, column, collisionCell, stackCell, shapeColor} = cellProps
  const styling = getStyling(collisionCell, stackCell, shapeColor)

  return (
    <div
      key={`${row}-${column}`}
      className={styling}>
      {row},{column}
    </div>
  )
}
export default GridCell

/*
* Determine styling for cells on game board grid.
* **/
function getStyling(collisionCell: boolean, stackCell: Color, shapeColor: Color): string {

  switch (true) {
    case isColor(stackCell): return getStylingForCell(stackCell)
    case collisionCell: return getStylingForCell(shapeColor)
    default: return styles.gridCell
  }
}

// Helper function to make styling function a bit easier to read
function getStylingForCell(shapeColor: Color) : string {
  switch (shapeColor) {
    case Color.CYAN: return styles.iShape
    case Color.BLUE: return styles.jShape
    case Color.ORANGE: return styles.lShape
    case Color.YELLOW: return styles.oShape
    case Color.GREEN: return styles.sShape
    case Color.PURPLE: return styles.tShape
    case Color.RED: return styles.zShape
  }
}

// Type Guard for handling undefined color cell
function isColor<Color>(value: Color  | undefined): value is Color {
  return value !== undefined
}

