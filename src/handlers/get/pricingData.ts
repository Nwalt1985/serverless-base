/* eslint-disable import/no-import-module-exports */
import { StatusCodes } from 'http-status-codes';
import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';
import { getPricingData } from '../../repository/service';

type PricingRequest = {
	sku: string;
}

// eslint-disable-next-line func-names
module.exports.handler = async function (event: APIGatewayProxyEvent, context: Context, callback: Callback<any>) {
  try {
		const { sku } = event.queryStringParameters as PricingRequest;

		const data = await getPricingData(sku);

    const response = {
      statusCode: StatusCodes.OK,
      body: JSON.stringify(data, null, 2)
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
