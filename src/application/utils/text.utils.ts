export const cleanText = (txt: string): string => {
  return txt?.trim()?.replace(/\n|\t|/gim, "");
};

export const cleanPrice = (price: string): number => {
  /*
  The first "replace" remove the percentage discount from the price.
  The second "replace" removes all characters that are not numbers, dots or commas.
  */
  let cleanedPrice = price.replace(/(?:\s[0-9]+%)/g, "").replace(/[^0-9.,]/g, "");

  const hasDot = cleanedPrice.split("").filter(e => e === ".");
  const hasComma = cleanedPrice.split("").filter(e => e === ",");

  if (hasDot.length && hasComma.length) cleanedPrice = cleanedPrice.replace(/\./g, "");

  cleanedPrice = cleanedPrice.replace(/,/g, ".");

  return parseFloat(cleanedPrice);
};
