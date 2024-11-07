const shuffleArray = (arr: string[]): string[] => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const getRandomIds = (arr: string[], percent: number): string[] => {
  const count = Math.ceil(arr.length * percent);
  const shuffledArray = shuffleArray([...arr]);
  return shuffledArray.slice(0, count);
};
