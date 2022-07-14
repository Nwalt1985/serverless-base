/* eslint-disable import/no-import-module-exports */
import csv from 'csvtojson';
import multipart from 'parse-multipart';
import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';
import insertCSVData from '../../repository/service';
import batchItems from '../../helpers';

// eslint-disable-next-line func-names
module.exports.handler = async function (event: APIGatewayProxyEvent, context: Context, callback: Callback<any>) {

	const body = Buffer.from(event.body as string)

	const boundary = multipart.getBoundary(event.headers["Content-Type"] as string);

	const buff = multipart.Parse(body, boundary);

	const csvDataString = buff[0].data.toString("utf8");

	const csvData = await csv().fromString(csvDataString);

	const batchedItems = batchItems(csvData);

  await insertCSVData(batchedItems);

  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: `Successfully uploaded ${csvData.length} records.` }),
  };

  callback(null, response);
};
