const { find, pick } = require('lodash');
const AWS = require('aws-sdk');
const { FIFTEEN_MINUTES } = require('../../consts');

const docClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1'
});

const FIFTEEN_MINUTES_AGO = new Date(Date.now() - FIFTEEN_MINUTES).toISOString();

const params = {
    TableName: 'sensei',
    IndexName: 'SK-data-index',
    KeyConditionExpression: 'SK = :sk',
    ExpressionAttributeValues: {
        ":sk": "LOCATION",
    }
};

const secondParams = (deviceId) => ({
    TableName: 'sensei',
    IndexName: 'SK-data-index',
    KeyConditionExpression: 'SK = :sk and begins_with(#d, :data)',
    ExpressionAttributeNames: {
        '#d': 'data'
    },
    FilterExpression: 'createdAt > :date',
    ExpressionAttributeValues: {
        ':sk': 'READING',
        ':data': deviceId,
        ':date': FIFTEEN_MINUTES_AGO
    }
});

const parseReading = ({ 
    createdAt, 
    PK: id, 
    scale, 
    data: deviceId, 
    value
}) => ({
    createdAt,
    deviceId,
    id,
    scale,
    value
});

const parseLocation = ({PK: id, data: deviceId, name }) => ({
    deviceId,
    id,
    name
});

const handleResponse = locations => resp => {
    return resp.map(({Items: readings}) => {
        const reading = parseReading(readings[0]);
        const parsedLocations = locations.map(parseLocation);
        const location = find(parsedLocations, { deviceId: reading.deviceId});
        return {...reading, location};
    });
}

const dashboard = async () => {
    const { Items: locations } = await docClient.query(params).promise();
    const recordingPromises = locations.map(async ({data: deviceId}) => (
        docClient.query(secondParams(deviceId)).promise()
    ));
    const recordings = await Promise.all(recordingPromises);
    return { readings: handleResponse(locations)(recordings)};
};

// const dashboard = () => {
//     return docClient.query(params, (err, data) => {
//         if (err) console.log('error:', err);
//         return data.Items.map(item => {
//             const deviceId = item.data;
//             return docClient.query(secondParams(deviceId), (err, res) => {
//                 const response = { 
//                     ...res.Items['0'], 
//                     location: { 
//                         id: item.PK,
//                         name: item.name, 
//                         deviceId: item.data
//                     }};
//                 if (err) console.log('err:', err)
//                 else console.log(response);
//                 return { readings: response };
//             });
//         });
//     });
// };

module.exports = {
    dashboard,
}