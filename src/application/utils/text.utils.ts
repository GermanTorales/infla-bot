export const cleanText = (txt: string): string => {
  return txt?.trim()?.replace(/\n|\t|/gim, "");
};

export const cleanPrice = (price: string): number => {
  let cleanedPrice = price.replace(/[^0-9.,]/g, "");

  const hasDot = cleanedPrice.split("").filter(e => e === ".");
  const hasComma = cleanedPrice.split("").filter(e => e === ",");

  if (hasDot.length && hasComma.length) cleanedPrice = cleanedPrice.replace(/\./g, "");

  cleanedPrice = cleanedPrice.replace(/,/g, ".");

  return parseFloat(cleanedPrice);
};
