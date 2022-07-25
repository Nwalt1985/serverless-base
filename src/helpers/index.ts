import { PricingData } from '../types';

export default function batchItems(data: any[]) {
  const batchAmount = 25;

  const result = data.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / batchAmount);

    if (!resultArray[chunkIndex]) {
      // eslint-disable-next-line no-param-reassign
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

  return result as PricingData[][];
}

export async function wait(ms: number) {
  // eslint-disable-next-line no-promise-executor-return
  return new Promise((res) => setTimeout(res, ms));
}
