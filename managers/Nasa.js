const config = require('../config.js');
const axios = require('axios');
const Logger = require('../Logger.js');
const NasaApod = require('../models/NasaApod');

const NASA_API_KEY = config.nasaApiKey;



/*******************************************************
            APOD METHODS
*******************************************************/

exports.getAstronomyPictureOfTheDay = async() => {
    const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;
    const response = await axios.get(url);
    return response.data;
};

/* Returns true if Nasa APOD image has already been saved/archived */
const doesNasaApodExist = async(apod) => {
    Logger.log('Determining if APOD is already archived...');
    const resultSet = await NasaApod.find({
        date: apod.date,
        explanation: apod.explanation,
        hdurl: apod.hdurl,
        media_type: apod.media_type,
        service_version: apod.service_version,
        title: apod.title,
        url: apod.url
    });
    const apodAlreadyArchived = resultSet.length > 0;
    Logger.log(`Apod already archived: ${apodAlreadyArchived}`);
    return apodAlreadyArchived;
};

/* Archives the provided APOD if not already saved */
exports.saveNasaApod = async(apod) => {
    Logger.log('Attempting to save NASA APOD...');
    const apodAlreadyExists = await doesNasaApodExist(apod);
    if (!apodAlreadyExists)
    {
        Logger.log('saving new APOD..');
        return await NasaApod.create(apod);
    } else {
        Logger.log('Nothing saved.');
        return apod;
    }
};

/* Returns all saved/archived NASA APODs */
exports.getSavedNasaApods = async() => {
    Logger.log('Fetching saved APODs..');
    const savedApods = await NasaApod.find({});
    Logger.log(`Number of apods returned: ${savedApods.length}`);
    return savedApods;
};


/*******************************************************
            EARTH IMAGERY/ASSET METHODS
*******************************************************/

exports.getEarthImage = async(lat, lon, dim, date, cloud_score) => {
    // base url (lat/lon required)
    Logger.log(`fetching earth image for Lat:${lat} Lon:${lon}...`);
    let url = `https://api.nasa.gov/planetary/earth/imagery/?lat=${lat}&lon=${lon}&api_key=${NASA_API_KEY}`;
    if (dim) url += `&dim=${dim}`;
    if (date) url += `&date=${date}`;
    if (cloud_score) url += `&cloud_score=${cloud_score}`;
    const response = await axios.get(url);
    return response.data;
};

exports.getLandsatAssets = async(lat,lon, begin, end) => {
    // base url (lat/lon required)
    Logger.log('fetching landsat assets...');
    let url = `https://api.nasa.gov/planetary/earth/assets?lat=${lat}&lon=${lon}&api_key=${NASA_API_KEY}`;
    if (begin) url += `&begin=${begin}`;
    if (end) url += `&end=${end}`;
    const response = await axios.get(url);
    Logger.log(`Number of assets returned: ${response.data.count}`)
    return response.data.results;
};




