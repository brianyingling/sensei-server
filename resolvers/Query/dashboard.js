const { find } = require('lodash');
const { parseLocation, parseReading } = require('../utils');
const { getLocations, getReadingsByDeviceId } = require('../../db/queries');

const handleResponse = locations => resp => (
    resp.map(({Items: readings}) => {
        const reading = parseReading(readings[0]);
        const parsedLocations = locations.map(parseLocation);
        const location = find(parsedLocations, { deviceId: reading.deviceId});
        return {...reading, location};
    })
);

const dashboard = async () => {
    const { Items: locations } = await getLocations();
    const recordingPromises = locations.map(({data: id}) => (
        getReadingsByDeviceId(id)
    ));
    const recordings = await Promise.all(recordingPromises);
    return { readings: handleResponse(locations)(recordings)};
};

module.exports = dashboard;