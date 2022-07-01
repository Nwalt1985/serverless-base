# Instagram Proxy Service

This service is to facilitate 0auth requests to Instagram.

## Schema

To do

## Endpoints

| Method | Stage | URL                                            |
| ------ | ----- | ---------------------------------------------- |
| POST   | dev   | http://localhost:3000/dev/instagram/user/token |

## Lambda functions

- **postUserToken**: This function receives a JSON object constaining a users access key and ID. A call is made to Instagram to convert the token to a long term token. This is returned and saved in the `instagram-auth-tokens-[stage]` table.

- **refreshUserTokens**: This is a scheduled lambda which is triggered every 7 days. This will use the refresh token which is stored in `instagram-auth-tokens-[stage]` table to create a new long term token. The table values will be updated with the new tokens.

## Local development

**serverless offline**

```
npm run start
```

**dynamodb-admin** https://www.npmjs.com/package/dynamodb-admin

install gloablly

```
npm i -g dynamodb-admin
```

run

```
npm run dynamodb-local
```
