export const getNeightboursIds = (
  id: string,
  separator: string,
  size: number
): string[] => {
  const rowId = Number(id.split(separator)[0]);
  const cellId = Number(id.split(separator)[1]);
  const neightbours = [
    { row: rowId - 1, cell: cellId },
    { row: rowId - 1, cell: cellId + 1 },
    { row: rowId, cell: cellId + 1 },
    { row: rowId + 1, cell: cellId + 1 },
    { row: rowId + 1, cell: cellId },
    { row: rowId + 1, cell: cellId - 1 },
    { row: rowId, cell: cellId - 1 },
    { row: rowId - 1, cell: cellId - 1 },
  ];

  return neightbours
    .filter((i) => i.row >= 1 && i.cell >= 1 && i.row <= size && i.cell <= size)
    .map((i) => `${i.row}${separator}${i.cell}`);
};
