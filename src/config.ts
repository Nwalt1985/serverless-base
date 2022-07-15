import 'dotenv';

const AWS = {
  region: process.env.CONFIG_REGION,
};

const dynamodb = {
  tableName: process.env.DYNAMODB_TABLE_NAME,
  local: {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  },
};

export default {
  AWS,
  dynamodb,
};
