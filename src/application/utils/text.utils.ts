export const cleanText = (txt: string): string => {
  return txt?.trim()?.replace(/\n|\t|/gim, "");
};

export const cleanPrice = (price: string): number => {
  let cleanedPrice = price.replace(/[^0-9.,]/g, "");
  cleanedPrice = cleanedPrice.replace(/\./g, "");
  cleanedPrice = cleanedPrice.replace(/,/g, ".");

  return parseFloat(cleanedPrice);
};
