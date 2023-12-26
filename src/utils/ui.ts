export const formatDuration = (milliseconds: number) => {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor(milliseconds / 1000 / 60);

  return `${minutes}:${seconds.toFixed().padStart(2, "0")}`;
};
