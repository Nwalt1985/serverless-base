import client from './connect';
import config from '../config';
import { PricingData } from '../types';

export async function insertCSVData(data: PricingData[]) {
  try {
		const { tableName } = config.dynamodb;
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
        [tableName]: itemsArray,
      },
    };

   return await db.batchWrite(params).promise();

  } catch ({ message }) {
    throw new Error(message as string);
  }
}

export async function getPricingData(sku: string) {
	try {
		const db = client();

		const params = {
			TableName: config.dynamodb.tableName as string,
			Key: {
				sku
			}
		};

		const response = await db.get(params).promise();

		if(!response.Item) return 'No pricing data found';

		return response.Item as PricingData;

	} catch({message}) {
		throw new Error(message as string)
	}
}
