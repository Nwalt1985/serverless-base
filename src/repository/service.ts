import client from './connect';
import config from '../config';
import { PricingData } from '../types';

export default async function insertCSVData(data: PricingData[]) {
  try {
    const db = client();

    const itemsArray = [];

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (let i = 0; i < data.length; i++) {
      itemsArray.push({
        PutRequest: {
          Item: data[i],
        },
      });
    }

    const params = {
      RequestItems: {
        [`${config.dynamodb.tableName}`]: itemsArray,
      },
    };

    return await db.batchWrite(params).promise();
  } catch ({ message }) {
    throw new Error(message as string);
  }
}
