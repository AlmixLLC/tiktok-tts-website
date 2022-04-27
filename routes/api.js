var express = require('express');
var router = express.Router();
var stream = require('stream');
const request = require('request');

/* GET api listing. */
router.get('/', function(req, res, next) {
  res.send('invalid endpoint');
});
router.get('/v1', function(req, res, next) {
  res.send('invalid but this is an api endpoint');
});
router.get('/v1/tts', function(req, res, next) {
  res.send('stoopid this is a GET request');
});

router.post('/v1/tts', function(req, res, next) {
  stuff = req.body.stuff;
  voices = req.body.voices;
  if (stuff != null && voices != null) {
    nospace = stuff.replace(/ /g,"+");
    noascii = nospace.replace(/[^\x00-\x7F]/g, "");
    e = noascii.replace(/(\r\n|\n|\r)/gm, "");

    request.post('https://api16-normal-useast5.us.tiktokv.com/media/api/text/speech/invoke/?text_speaker=' + voices + '&req_text=' + e, { json: true }, (err, ress, body) => {
      if (err) { return console.log(err); }
      pdf = body.data.v_str;
      console.log("someone has requested a tts of: " + stuff + " (not formatted)");
      var fileContents = Buffer.from(pdf, "base64");
  
      var readStream = new stream.PassThrough();
      readStream.end(fileContents);
    
      res.set('Content-disposition', 'attachment; filename=' + "almix_net_tiktoktts_" + voices + ".mp3");
      res.set('Content-Type', 'text/plain');
    
      readStream.pipe(res);
    });
  }else res.send('invalid request');
});
module.exports = router;
