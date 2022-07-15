/* eslint-disable import/no-import-module-exports */
import csv from 'csvtojson';
import multipart from 'parse-multipart';
import { StatusCodes } from 'http-status-codes';
import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';
import { DocumentClient, WriteRequests } from 'aws-sdk/clients/dynamodb';
import insertCSVData from '../../repository/service';
import batchItems from '../../helpers';
import config from '../../config';

// eslint-disable-next-line func-names
module.exports.handler = async function (event: APIGatewayProxyEvent, context: Context, callback: Callback<any>) {
  try {
		const { tableName } = config.dynamodb;

    const body = Buffer.from(event.body as string);

    const boundary = multipart.getBoundary(event.headers['Content-Type'] as string);

    const buff = multipart.Parse(body, boundary);

    const csvDataString = buff[0].data.toString('utf8');

    const csvData = await csv().fromString(csvDataString);

    const batched = batchItems(csvData);

    console.info('BATCHED:', JSON.stringify(batched, null, 2));

    const unprocessed: {
			batch: number;
			failedItems: WriteRequests
		}[] = [];

    for (let i = 0; i < batched.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      const { UnprocessedItems } = await insertCSVData(batched[i]);

      if (Object.entries(UnprocessedItems!).length) {
				const failedItems = UnprocessedItems![tableName as keyof DocumentClient.BatchWriteItemOutput] || 0;

        unprocessed.push({
					batch: i,
					failedItems
				});
      }
    }

		console.info('UNPROCESSED:', unprocessed)

    const response = {
      statusCode: StatusCodes.OK,
      body: unprocessed.length
        ? JSON.stringify({
            unprocessed,
          })
        : JSON.stringify({
            message: `Successfully uploaded ${csvData.length} records.`,
          }),
    };

    callback(null, response);
  } catch ({ message }) {
    const response = {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      body: message,
    };

    callback(null, response);
  }
};
