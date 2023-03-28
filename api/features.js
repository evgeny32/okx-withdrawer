'use strict';

const https = require('https');
const querystring = require('querystring');
const fs = require('fs');

class Features {
    static request(url, options, data = null) {
        if (options.method == 'GET') {
            if (data !== null && JSON.stringify(data) !== '{}') {
                url += '?' + querystring.stringify(data);
            }
            
            return new Promise((resolve, reject) => {
                let req = https.request(
                    `${url}`,
                    options,
                    (res) => {
                        let response = '';
                        res.on('data', function(chunk) {
                            response += chunk;
                        });
                        
                        res.on('end', function() {
                            resolve(JSON.parse(response));
                        });
                    }
                );
                req.on('error', function(err) {
                    reject(err);
                });
                req.end();
            });
        }
        
        if (options.method == 'POST') {
            return new Promise((resolve, reject) => {
                let req = https.request(
                    url,
                    options,
                    (res) => {
                        let response = '';
                        res.on('data', function(chunk) {
                            response += chunk;
                        });
                        
                        res.on('end', function() {
                            resolve(JSON.parse(response));
                        });
                    }
                );

                req.on('error', function(err) {
                    reject(err);
                });

                if (data !== null && JSON.stringify(data) !== '{}') {
                    req.write(JSON.stringify(data));
                }
                req.end();
            });
        }
        
    }

    static getTimeString() {
        let timeOptions = {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        
        return new Date().toLocaleString('ru', timeOptions);
    }

    static uid() {
        return Math.random().toString(36).slice(2).substr(0, 6);
    }

    static fileToArr(file) {
        let lines = fs.readFileSync(file).toString('UTF8').split('\n');
        lines = lines.map(line => line.trim());
        lines.pop();
        return lines;
    }

    static getRandomDecimal(min, max, precision) {
        let amount = Math.random() * (max - min) + min;
        return +amount.toFixed(precision);
    }
}

module.exports = Features;
