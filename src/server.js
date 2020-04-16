const express = require('express');
var bodyParser = require('body-parser');
const EventEmitter = require('events');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json())

class WebhookListener extends EventEmitter {
    listen() {
        app.post('/verified', (req, res) => {
            console.log(req.body[0].disc_name);

            const discName = req.body[0].disc_name;
            const realName = req.body[0].real_name;
            const email = req.body[0].email;

            res.send({ status: 'OK' });

            this.emit(
                'verification',
                email,
                realName,
                discName
            );
        });

        app.listen(PORT);
    }
}

const listener = new WebhookListener();
listener.listen();

module.exports = listener;