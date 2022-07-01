"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports.handler = async function (event, context, callback) {
    const response = {
        statusCode: 200,
        body: JSON.stringify({ message: 'Hello World!' }),
    };
    callback(null, response);
};
