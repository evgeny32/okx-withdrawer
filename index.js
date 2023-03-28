'use strict';

const Okx = require('./okx');
const config = require('./config.json');
const f = require('./api/features');
const colors = require('colors');

const okx = new Okx();

(async () => {
    console.log(`User parameters:`);
    for (let key in config.params) {
        console.log(`${key}: ${config.params[key]}`);
    }
    console.log();

    const addresses = f.fileToArr('./addresses');
    console.log(`List of addresses (${addresses.length}):`);
    addresses.forEach(addr => console.log(colors.black.bgWhite(addr)));
    console.log();

    const coinInfo = await okx.getCoinInfo(config.params.coin, config.params.chain);

    const successful = [];
    for (let i = 0; i < addresses.length; i++) {
        console.log(`————————————`);
        console.log(`[${i + 1}]`);
        console.log(`[${f.getTimeString()}]`);

        const balance = await okx.getCoinBalance(config.params.coin);
        console.log(`Your balance: ${balance} ${config.params.coin}`);

        const address = addresses[i];
        const amount = f.getRandomDecimal(config.params.min_amount, config.params.max_amount, coinInfo.withdrawal_precision);
        
        if (balance > amount) {
            console.log(`Withdraw ${amount} ${config.params.coin} to address ${address}`);

            const resp = await okx.requestWithdrawal(config.params.coin, config.params.chain, address, amount, coinInfo.fee)
            if (resp.result) {
                console.log(`Withdrawal request has been sent`.green);
                successful.push(address);
            } else {
                console.log(`Withdrawal error: ${resp.msg}`.red)
            }
        } else {
            console.log(`Attempt to withdraw ${amount} with a balance of ${balance}. Top up your balance`.red);
            break;
        }

        console.log(`————————————\n`);
        if ((i + 1) < addresses.length) {
            const sleepTime = Math.floor(Math.random() * (config.params.max_delay - config.params.min_delay + 1)) + config.params.min_delay;
            console.log(`⏳ Waiting for ${sleepTime} seconds\n`.yellow);
            await new Promise(resolve => setTimeout(resolve, sleepTime * 1000));
        }
    }

    console.log(`List of addresses with successful withdrawal (${successful.length}):`);
    successful.forEach(addr => console.log(colors.green(addr)));
})();