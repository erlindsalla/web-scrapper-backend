const nodemailer = require('nodemailer');

const emailSender = async (cityName) => {
    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
           user: 'webscrapper1@gmail.com',
           pass: 'vodafonesmart2'
        }
    });
    
    const message = {
        from: 'webscrapper1@gmail.com', // Sender address
        to: 'ilirteshoo@gmail.com',         // List of recipients
        subject: 'Data Scrapping finished!!!', // Subject line
        text: 'The ' + `${cityName}`+ ' finished scrapping!' // Plain text body
    };
    
    transport.sendMail(message, function(err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }
    });
}
module.exports = emailSender;