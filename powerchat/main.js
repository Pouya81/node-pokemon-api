const express = require('express');
const app = express();
const port = 3008;
const struct = '<form action="./" method="post"><input type="text" id="mess" name="mess"></br><input type="submit" name="submit" value="Send">-<input type="submit" name="receive" value="Receive"></form><br/>';
var message = "";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function(req, res, next) {
    if (req.body.submit) console.log('Time: '+Date.now()+' Message '+req.body.mess);
    else console.log('Time: '+Date.now()+' Message '+message);
    next();
})

app.listen(port, () => console.log(`PowerChat is now running on : http://localhost:${port}`));

app.get('/', (req,res) => res.send(struct));
app.post('/', function (req, res) {
    let action = 'submit';
    if(req.body.receive) action = 'receive';

    if (action == "submit") {  message = req.body.mess; res.send(struct); }
    else { if(message != "") res.send(struct+message); }
});
