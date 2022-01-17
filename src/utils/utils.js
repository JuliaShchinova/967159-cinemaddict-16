export const addClass = (className) => (detail) => detail ? className : '';

export const getUserRank = (count, rank = {}) => {
  const userRank = Object.keys(rank).find((key) => count >= rank[key].MIN && count <= rank[key].MAX);

  return userRank;
};
