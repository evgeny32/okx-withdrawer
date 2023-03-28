'use strict';

const config = require('../config.json');
const f = require('./features');
const crypto = require('crypto');
const querystring = require('querystring');

class REST {
    static request = async (method, endpoint, data) => {
        const timestamp = (Date.now() / 1000).toString();
		const signature = this.#getSign(timestamp, method, endpoint, data);

        const response = await f.request(`${config.url}${endpoint}`, {
            method: method,
            headers: {
                'OK-ACCESS-KEY': config.auth.key,
                'OK-ACCESS-SIGN': signature,
                'OK-ACCESS-TIMESTAMP': timestamp,
                'OK-ACCESS-PASSPHRASE': config.auth.passphrase,
                'Content-Type': 'application/json',
            },
        },
        data);

        return response;
    }

    static #getSign = (timestamp, method, endpoint, data) => {
        if (method == 'GET' || method == 'DELETE') {
			if (JSON.stringify(data) !== '{}') {
				data = '?' + querystring.stringify(data);
			} else {
				data = '';
			}
		}
		
		if (method == 'POST' || method == 'PUT') {
			if (JSON.stringify(data) !== '{}') {
				data = JSON.stringify(data);
			} else {
				data = '';
			}
		}
		
		const signPayload =  timestamp + method + endpoint + data;
		return crypto.createHmac('sha256', config.auth.secret).update(signPayload).digest('base64');
	}
}

module.exports = REST;