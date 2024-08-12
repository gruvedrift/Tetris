import React from "react";
import {getStyling} from "../assets/Utils";

interface GridCellProps {
  row: number,
  column: number,
  collisionCell: boolean,
  stackCell: boolean,
  paddingCell: boolean,
}

const GridCell: React.FC<GridCellProps> = (cellProps) => {
  const {row, column, collisionCell, stackCell, paddingCell} = cellProps
  const styling = getStyling(collisionCell, stackCell, paddingCell)

  return (
    <div
      key={`${row}-${column}`}
      className={styling}>
      {row},{column}
    </div>
  )
}

export default  GridCell

