import React from "react";
import styles from "./GridCelll.module.scss"
import {Color} from "../assets/types";

interface GridCellProps {
  row: number,
  column: number,
  collisionCell: boolean,
  stackCell: boolean,
  paddingCell: boolean,
  shapeColor: Color
}

const GridCell: React.FC<GridCellProps> = (cellProps) => {
  const {row, column, collisionCell, stackCell, paddingCell, shapeColor} = cellProps
  const styling = getStyling(collisionCell, stackCell, paddingCell, shapeColor)

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
function getStyling(collisionCell: boolean, stackCell: boolean, paddingCell: boolean, shapeColor: Color): string {
  const conditions = {
    isStackCell: (collisionCell && stackCell && !paddingCell) || (!collisionCell && stackCell && !paddingCell),
    isShapeCell: collisionCell && !stackCell && paddingCell,
    isPaddingCell: !collisionCell && !stackCell && paddingCell,
    isGridCell: !collisionCell && !stackCell && !paddingCell,
  }
  switch (true) {
    case conditions.isStackCell: return styles.stackCell
    case conditions.isShapeCell: return getStylingForShape(shapeColor)
    case conditions.isPaddingCell: return styles.paddingCell
    case conditions.isGridCell: return  styles.gridCell
  }
}

// Helper function to make styling function a bit easier to read
function getStylingForShape(shapeColor: Color) : string {
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
