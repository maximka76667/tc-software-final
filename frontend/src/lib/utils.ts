// Function used for charts' X axis labels
export const arrayUntil = (n: number) => {
  const res: number[] = [];
  for (let i = 0; i < n; i++) {
    res.push(i);
  }
  return res;
};

// Adds new element to an array and returns last n elements
export const addAndGetLastNElements = <T>(
  array: T[],
  newValue: T,
  n: number
) => {
  const newValues = [...array, newValue].slice(-n);
  return newValues;
};

// Returns string with uppercase first letter
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function capitalizeWords(str: string) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export const mapRange = (
  value: number,
  min1: number,
  max1: number,
  min2: number,
  max2: number
): number => {
  return ((value - min1) * (max2 - min2)) / (max1 - min1) + min2;
};

export function formatDateTime(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // Months are 0-indexed
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const milliseconds = date.getMilliseconds().toString().padStart(3, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}:${milliseconds}`;
}

export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
