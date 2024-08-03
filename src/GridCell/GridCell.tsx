import React from "react";
import {getStyling} from "../assets/Utils";

interface GridCellProps {
  row: number,
  column: number,
  isActive: boolean,
  stackCell: boolean,
}

const GridCell: React.FC<GridCellProps> = (cellProps) => {
  const {row, column, isActive, stackCell} = cellProps
  const styling = getStyling(isActive, stackCell)

  return (
    <div
      key={`${row}-${column}`}
      className={styling}>
      {row},{column}
    </div>
  )
}

export default  GridCell

