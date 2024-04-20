import { InflationCalculatedDtoV1 } from "src/application/dtos";
import { IHistoryPriceEntity, IProductEntity } from "src/domain/entites";

export const calculateInflation = (products: IProductEntity[], lastPrices: IHistoryPriceEntity[], currentPrices: IHistoryPriceEntity[]) => {
  if (lastPrices.length === 0 || currentPrices.length === 0) return [];

  const inflationByProducts: InflationCalculatedDtoV1[] = products
    .map(product => {
      const lastPrice = lastPrices.find(price => price.product.id === product.id);
      const currentPrice = currentPrices.find(price => price.product.id === product.id);

      if (!lastPrice || !currentPrice) return null;

      let inflation: number = 0;

      if (lastPrice.price && currentPrice.price) inflation = ((currentPrice.price - lastPrice.price) / lastPrice.price) * 100;

      return {
        id: product.id,
        name: product.name,
        inflation: inflation.toFixed(2),
        lastPrice: lastPrice.price,
        currentPrice: currentPrice.price,
      };
    })
    .filter(e => e);

  return inflationByProducts.sort((a: InflationCalculatedDtoV1, b: InflationCalculatedDtoV1) => parseFloat(b.inflation) - parseFloat(a.inflation));
};
