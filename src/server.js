const express = require('express');
const bodyParser = require('body-parser');
const EventEmitter = require('events');

const PORT = process.env.PORT || 80;

const app = express();
app.use(bodyParser.json());

class WebhookListener extends EventEmitter {
    listen() {
        app.post('/kofi', (req, res) => {
            const data = req.body.data;
            //const { message, timestamp } = data;
            const timestamp = data.timestamp;
            const discName = data.disc_name;
            //const amount = parseFloat(data.amount);
            const realName = data.real_name;
            //const senderName = data.from_name;
            const recordId = data.message_id;
            // const paymentSource = 'Ko-fi';
            const email = data.email;

            // The OK is just for us to see in Postman. Ko-fi doesn't care
            // about the response body, it just wants a 200.
            res.send({ status: 'OK' });

            this.emit(
                'verification',
                recordId,
                timestamp,
                email,
                realName,
                discName,
            );
        });

        app.listen(PORT);
    }
}

const listener = new WebhookListener();
listener.listen();

module.exports = listener;