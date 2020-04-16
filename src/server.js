const express = require('express');
const bodyParser = require('body-parser');
const EventEmitter = require('events');

const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

class WebhookListener extends EventEmitter {
    listen() {
        app.post('/verified', (req, res) => {
            const data = req.body.data;

            const discName = data.disc_name;
            const realName = data.real_name;
            const email = data.email;

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