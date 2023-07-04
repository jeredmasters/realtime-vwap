export const stableSymbol = (ccy1: string, ccy2: string) => {
  if (ccy1 > ccy2) {
    return `${ccy1}/${ccy2}`;
  }
  return `${ccy2}/${ccy1}`;
};
