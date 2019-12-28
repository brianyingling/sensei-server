const parseLocation = ({PK: id, data: deviceId, name }) => ({
    deviceId,
    id,
    name
});

const parseReading = ({ createdAt, PK: id, scale, data: deviceId, value }) => ({
    createdAt,
    deviceId,
    id,
    scale,
    value
});

module.exports = {
    parseLocation,
    parseReading
}