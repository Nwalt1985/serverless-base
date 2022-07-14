import AWS from 'aws-sdk';
import config from '../config';

export default function client() {
	AWS.config.update({ region: config.AWS.region });

	const documentClient =
		process.env.NODE_ENV === 'development'
			? new AWS.DynamoDB.DocumentClient(config.dynamodb.local)
			: new AWS.DynamoDB.DocumentClient({ apiVersion: 'latest' });

	return documentClient;
}
