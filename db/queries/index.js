const AWS = require('aws-sdk');
const { FIFTEEN_MINUTES } = require('../../consts');

const docClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1'
});

const getLocations = () => (
    docClient.query({
        TableName: 'sensei',
        IndexName: 'SK-data-index',
        KeyConditionExpression: 'SK = :sk',
        ExpressionAttributeValues: {
            ":sk": "LOCATION"
        }
    })
    .promise()
);

const getReadingsByDeviceId = (id) => {
    const FIFTEEN_MINUTES_AGO = new Date(Date.now() - FIFTEEN_MINUTES).toISOString();
    
    return docClient.query({
        TableName: 'sensei',
        IndexName: 'SK-data-index',
        KeyConditionExpression: 'SK = :sk and begins_with(#d, :data)',
        ExpressionAttributeNames: {
            '#d': 'data'
        },
        FilterExpression: 'createdAt > :date',
        ExpressionAttributeValues: {
            ':sk': 'READING',
            ':data': id,
            ':date': FIFTEEN_MINUTES_AGO
        }
    })
    .promise()
}

module.exports = {
    getLocations,
    getReadingsByDeviceId
}