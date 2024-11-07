export const getTextCellColor = (count: string): string => {
  const colors: { [key: string]: string } = {
    "1": "#fff",
    "2": "#ffe25a",
    "3": "#19ff6f",
    "4": "#6445bf",
    "5": "#b72788",
    "6": "#b40000",
    "7": "#ab5c23",
    "8": "#000",
  };

  return colors[count] ?? colors[1];
};
