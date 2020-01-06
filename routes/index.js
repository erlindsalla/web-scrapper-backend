var express = require('express');
var router = express.Router();
let jobProcessor = require('../services/scraper')
const RestaurantData = require('../models/restaurant_data');
const Cities = require('../models/cities');
const Url = require('../models/url')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/fetchRestaurantData' , async (req, res) => {
  var _url = req.body.url;
  var cityName = req.body.cityName;
  var totalNumberOfPages = req.body.pageNumber;
    try {
     const url = await Url.find({
       name: _url
     })
      if(url.length == 0) {
        const newUrl = new Url({name : _url})
        await newUrl.save()

        jobProcessor(_url, totalNumberOfPages, cityName)
        .catch(error => {
          console.error(error)
        });

        return res.send('ok');
      } else {
        return  res.status(200).send('You can not scrape for the same city twice!')
        }
      } catch (e) {
         res.status(400).send(e)
        }
});

router.get('/allRestaurants', async (req, res, next) => {
  try {
    const cities = await Cities.find().exec()
    return res.json(cities);
  } catch(e) {
      res.status(400).json({error:e})
  }
});

//get all restaurants data for the specified city with or without filters
router.post('/allRestaurants', async (req, res) => {
  const {city , currentPage} = req.body
  try {
    const resDataLength = await RestaurantData.find(
      {
        city: city, 
        phone: { $ne: req.body.phone }, 
        email: { $ne: req.body.email } 
      })
      .exec()
      console.log('req ===>', req.body.phone, req.body.email);
      const resData = await RestaurantData.find(
        {
          city: city, 
          phone: { $ne: req.body.phone }, 
          email: { $ne: req.body.email } 
        })
        .limit(100)
        .skip(currentPage * 100)
      .exec()
      console.log(resData.length)
      return res.json({resData,'resDataLength': resDataLength.length})
    } catch (e) {
      res.status(400).json({error:e})
    }
})

module.exports = router;
