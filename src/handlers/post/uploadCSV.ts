/* eslint-disable import/no-import-module-exports */
import csv from 'csvtojson';
import multipart from 'parse-multipart';
import { StatusCodes } from 'http-status-codes'
import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';
import insertCSVData from '../../repository/service';
import batchItems from '../../helpers';

// eslint-disable-next-line func-names
module.exports.handler = async function (event: APIGatewayProxyEvent, context: Context, callback: Callback<any>) {
	try {
		const body = Buffer.from(event.body as string)

		const boundary = multipart.getBoundary(event.headers["Content-Type"] as string);

		const buff = multipart.Parse(body, boundary);

		const csvDataString = buff[0].data.toString("utf8");

		const csvData = await csv().fromString(csvDataString);

		const batched = batchItems(csvData);

		const responseData: any[] = [];

		for(let i = 0; i < batched.length; i++) {
			// eslint-disable-next-line no-await-in-loop
			const { UnprocessedItems, ConsumedCapacity } = await insertCSVData(batched[i]);

			if (Object.entries(UnprocessedItems!).length) {
				responseData.push({ batch: i, unprocessed: UnprocessedItems!['pricing-table'] || 0, ConsumedCapacity })
			}
		};

		const response = {
			statusCode: StatusCodes.OK,
			body: responseData.length ? JSON.stringify({
				responseData
			}) : JSON.stringify({
				message: `Successfully uploaded ${csvData.length} records.`
			}),
		};

		callback(null, response);

	} catch ({message}) {
		const response = {
			statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
			body: message,
		};

		callback(null, response);
	}
};
