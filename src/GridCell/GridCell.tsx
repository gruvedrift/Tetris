import React from "react";
import {getStyling} from "../assets/Utils";
import {Shape} from "../game-board/GameBoard";

interface GridCellProps {
  row: number,
  column: number,
  isActive: boolean,
  reachedBottom: boolean,
  inShape: boolean,
  shapeList: Shape[] // TODO might not need this
}

const GridCell: React.FC<GridCellProps> = (cellProps) => {
  const {row, column, isActive, reachedBottom, inShape, shapeList} = cellProps
  const styling = getStyling(isActive, reachedBottom, inShape)

  return (
    <div
      key={`${row}-${column}`}
      className={styling}>
      {row},{column}
    </div>
  )
}

export default  GridCell

