export const cleanText = (txt: string): string => {
  return txt?.trim()?.replace(/\n|\t|/gim, "");
};

export const cleanPrice = (price: string): number => {
  let cleanNumber = price.replace(/[^0-9.,]/g, "");
  const dotInx = cleanNumber.indexOf(".");
  const commaInx = cleanNumber.indexOf(",");

  if (dotInx !== -1 && dotInx < commaInx) cleanNumber = cleanNumber.replace(".", "").replace(",", "."); // 1.234,65 -> 1234.65
  else if (dotInx !== -1 && commaInx === -1) cleanNumber = cleanNumber.replace(/\.+[0-9]+/, ""); // 900.00 -> 900
  else if (dotInx === -1) cleanNumber = cleanNumber.replace(",", "."); // 1253,56 -> 1253.56

  return parseFloat(cleanNumber);
};
