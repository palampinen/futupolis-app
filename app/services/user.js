export const getInitialLetters = (name, length = 2) => {
  if (!name || !name.length) {
    return null;
  }

  return name
    .split(' ')
    .slice(0, length)
    .map(t => t.substring(0, 1))
    .join('');
};
