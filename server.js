const path = require('path');
const express = require('express');
//const {
//    datafileURL
//} = require('./constants');
const bodyParser = require('body-parser');
const app = new express();

//if (!datafileURL) {
//    console.log('WARNING: No datafile URL provided');
//    return;
//}


app.use(express.static(__dirname + '/src'));
app.use(bodyParser.text({
    type: "*/*"
}));


app.get('/dist/bundle.js', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist') + '/bundle.js');
});

app.post('/users.csv', bodyParser.text({
    type: "*/*"
}), function (req, res) {
    res.send(req.body);
});

app.listen(8080, () => console.log('Running on port 8080!'));
