import React from "react";
import {getStyling} from "../assets/Utils";
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

