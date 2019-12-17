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
  var cityName = req.body.fileName;
  var pageNumber = req.body.pageNumber;
  
    try {
     const url = await Url.find({
       name: _url
     })
      if(url.length == 0) {
        const newUrl = new Url({name : _url})

        await newUrl.save()
          jobProcessor(_url, pageNumber, cityName)
          .catch(error => {
            console.error(error)
          });

          return res.redirect('/allRestaurants');
      } else {
        return  res.status(200).send('You can not scrape for the same city twice!')
        }
      } catch (e) {
         res.status(400).send(e)
        }
});

router.get('/allRestaurants', async (req, res, next) => {
  var test = 'null';
  await Cities.find()
    .exec()
    .then(cities => {
      test = cities;
      res.render('allRestaurants', { allCities: cities });
    })
    .catch(err => console.log(err));
    //res.json(test)
});

//get all restaurants data for the specified city with or without filters
router.post('/allRestaurants', async (req, res) => {
  await RestaurantData.find(
      {
        city: req.body.city, 
        phone: { $ne: req.body.phone }, 
        email: { $ne: req.body.email } 
      })
    .exec()
    .then(resData => {  
      console.log({
        city: req.body.city, 
        phone: { $ne: req.body.phone }, 
        email: { $ne: req.body.email }
      })
      return res.status(200).json(resData);
     
    })
    .catch( err => console.log(err));
})

module.exports = router;
