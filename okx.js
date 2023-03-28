'use strict';

const api = require('./api/rest');

class Okx {
    getCoinBalance = async (coin) => {
        const method = 'GET';
        const endpoint = '/api/v5/asset/balances';
        const data = {ccy: coin};

        const balance = await api.request(method, endpoint, data);
		return +balance.data[0].availBal;
    }

    getCoinInfo = async (coin, chain) => {
        const method = 'GET';
        const endpoint = '/api/v5/asset/currencies';
        const data = {ccy: coin};

        const resp = await api.request(method, endpoint, data);

        for (let i = 0; i < resp.data.length; i++) {
            if (resp.data[i].chain == `${coin}-${chain}`) {
                return {fee: +resp.data[i].minFee, withdrawal_precision: +resp.data[i].wdTickSz};
            }
        }

		return {error: `Chain ${chain} was not found for the coin ${coin}`};
    }
    
    requestWithdrawal = async (coin, chain, address, amount, fee) => {
        const method = 'POST';
        const endpoint = '/api/v5/asset/withdrawal';
        const data = {
            ccy: coin,
            amt: amount,
            dest: '4',
            toAddr: address,
            fee: fee,
            chain: `${coin}-${chain}`
        };

        const resp = await api.request(method, endpoint, data);
        if (resp.code == '0') {
            return {result: true};
        } else {
            return {result: false, msg: resp.msg};
        }
    }

}

module.exports = Okx;