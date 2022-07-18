/* eslint-disable import/no-import-module-exports */
import csv from 'csvtojson';
import multipart from 'parse-multipart';
import { S3 } from 'aws-sdk'
import { StatusCodes } from 'http-status-codes';
import { Callback, Context } from 'aws-lambda';
import { DocumentClient, WriteRequests } from 'aws-sdk/clients/dynamodb';
import { insertCSVData } from '../../repository/service';
import batchItems from '../../helpers';
import config from '../../config';

const s3 = new S3({ apiVersion: '2006-03-01' });

// eslint-disable-next-line func-names
module.exports.handler = async function (event: any, context: Context, callback: Callback<any>) {
  try {
		const bucket = event.Records[0].s3.bucket.name;

		const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

		const params = {
        Bucket: bucket,
        Key: key,
    };

		const { Body: s3Data } = await s3.getObject(params).promise();

		console.log('BODY:', s3Data)

		const { tableName } = config.dynamodb;

    const body = Buffer.from(s3Data as string);

		const csvDataString = body.toString('utf-8');

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
