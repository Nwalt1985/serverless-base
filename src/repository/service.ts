import client from './connect';
import config from '../config';

export default async function insertCSVData(data: any[]) {
	try {
		const db = client();

		const itemsArray = [];

		// eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (let i = 0; i < data.length; i++) {
			itemsArray.push({
					PutRequest: {
							Item: data[i]
					}
			});
		}

		const params = {
			RequestItems: {
				[`${config.dynamodb.tableName}`]: itemsArray
			}
		};

		await db.batchWrite(params).promise();

		return ;
	} catch (err) {
		throw new Error(err as any);
	}
}
