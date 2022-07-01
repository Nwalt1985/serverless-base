import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';

module.exports.handler = async function (event: APIGatewayProxyEvent, context: Context, callback: Callback<any>) {
  console.log(event);

  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World!' }),
  };

  callback(null, response);
};
