/* eslint-disable import/no-import-module-exports */
import { StatusCodes } from 'http-status-codes';
import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';

type PricingRequest = {
	sku: string;
}

// eslint-disable-next-line func-names
module.exports.handler = async function (event: APIGatewayProxyEvent, context: Context, callback: Callback<any>) {
  try {
		const { sku } = event.queryStringParameters as PricingRequest;

		console.log(sku)

    const response = {
      statusCode: StatusCodes.OK,
      body: ''
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
