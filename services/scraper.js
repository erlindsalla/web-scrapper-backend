const request = require("request");
const cheerio = require("cheerio");
var Promise = require("bluebird");
const Restaurant = require('../models/restaurant_data');
const City = require('../models/cities');
let emalSender = require('./emailNotification');

var localCity = '';
// this function generates the urls that should be visited to extract restaurant urls for info gathering
const generateUrls = async (url, totalNumberOfPages) => {
  var urls = []
  console.log('url here ===>', url)
  var oaIndex = url.indexOf("-oa");
  var subUrl1 = url.slice(0, oaIndex);
  var subUrl2 = url.slice(oaIndex + 3, url.length)
  for(var i = 1; i <= totalNumberOfPages; i++) {
    let url = `${subUrl1}-oa${i * 30}${subUrl2}`
      urls.push(url)
  }
  return urls
}

// this function gets a url as a param and returns all the restaurants urls for that url
const getUrlsPerPage = (url) => {
    return new Promise((resolve, reject) => {
      request(
        url,
        (error, response, html) => {
          if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            const lastPageEl = $( '.title_wrap a' ).toArray().map( function ( el ) {
              return 'https://www.tripadvisor.com/' + el.attribs.href;
            } );
              resolve(lastPageEl);
          } else {
            reject(error);
          }
        }
      );
    })
  }; 
  
  //this function gets a restaurant url as a param and returns data that are scraped from that page
  const getDataFromPage = (urlPage) => {
    return new Promise((resolve, reject) => {
      request(
        urlPage,
        (error, response, html) => {
          if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            let telNr = $('a[href^="tel"]')[0] ? $('a[href^="tel"]')[0].attribs.href : 'no data';
            let email = $('a[href^="mailto:"]')[0] ? $('a[href^="mailto:"]')[0].attribs.href : 'no data';
            const restaurantName = $('h1.ui_header').text() ? $('h1.ui_header').text()  : 'no data';

            if(email !== 'no data') {
                email = email.slice(7, email.indexOf('?'))
            }
            
            if(telNr !== 'no data') {
              telNr = telNr.slice(4 , telNr.length)
            }

            const restaurant = new Restaurant({
                name : restaurantName,
                phone : telNr,
                email : email,
                city : localCity
            })
            console.log('Obj name ==>', restaurantName )
              resolve(restaurant);
          } else {
            reject(error);
          }
        }
      );
    })
  }; 
  
//this function gets a 2d array as a param and returns a 1d array

const concatenateArray = (array) => {
  let concatenated = []
  array.forEach(arr => {
    concatenated = [
      ...concatenated,
      ...arr
    ]
  })
  return concatenated
}
  
//this is the main function and all the exec goes on here
const jobProcessor = async (url, totalNumberOfPages, city) =>{
    localCity = city;
    const cityObj = new City({
        name : localCity
    })
    cityObj.save((err, data) => {
        console.error('errori te save i cityt',err)
    });

    let totalUrls = await generateUrls(url, totalNumberOfPages);
    let restaurantsUrl = await Promise.map(totalUrls, getUrlsPerPage, {concurrency: 13})
    restaurantsUrl = concatenateArray(restaurantsUrl)

    await Promise.map(restaurantsUrl, getDataFromPage, {concurrency: 10})
    .then(result => {
        Restaurant.insertMany(result)
        console.log('Done!');
    }).catch( error =>{
        console.error(error)
    })
    emalSender(localCity);
}

module.exports = jobProcessor
