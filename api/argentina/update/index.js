// require libs
const trae = require('trae')
const { redisGet, redisSet } = require('../../../modules/redis')

// functions to request prices
const getPrices = async () => {
  try {
    // ripio.com
    const ripio = await trae.get('https://ripio.com/api/v1/rates/')
    const ripioPrices = {
      BTC_ARS: {
        bid: Number(ripio.data.rates.ARS_SELL),
        ask: Number(ripio.data.rates.ARS_BUY)
      }
    }

    // bitso.com
    const bitso = await trae.get('https://api.bitso.com/v3/ticker')
    const bitso_BTC_ARS = bitso.data.payload.find(coin => coin.book === 'btc_ars')
    const bitsoPrices = {
      BTC_ARS: {
        bid: Number(bitso_BTC_ARS.bid),
        ask: Number(bitso_BTC_ARS.ask)
      }
    }

    // argenbtc.com
    const argenbtc = await trae.get('https://argenbtc.com/public/cotizacion_js.php')
    const argenbtc_BTC_ARS = JSON.parse(argenbtc.data)
    const argenbtcPrices = {
      BTC_ARS: {
        bid: Number(argenbtc_BTC_ARS.precio_venta),
        ask: Number(argenbtc_BTC_ARS.precio_compra)
      }
    }

    // satoshitango.com
    const satoshitango = await trae.get('https://api.satoshitango.com/v3/ticker/ARS')
    const satoshitangoPrices = {
      BTC_ARS: {
        bid: Number(satoshitango.data.data.ticker.BTC.bid),
        ask: Number(satoshitango.data.data.ticker.BTC.ask)
      },
      ETH_ARS: {
        bid: Number(satoshitango.data.data.ticker.ETH.bid),
        ask: Number(satoshitango.data.data.ticker.ETH.ask)
      },
      LTC_ARS: {
        bid: Number(satoshitango.data.data.ticker.LTC.bid),
        ask: Number(satoshitango.data.data.ticker.LTC.ask)
      },
      XRP_ARS: {
        bid: Number(satoshitango.data.data.ticker.XRP.bid),
        ask: Number(satoshitango.data.data.ticker.XRP.ask)
      },
      BCH_ARS: {
        bid: Number(satoshitango.data.data.ticker.BCH.bid),
        ask: Number(satoshitango.data.data.ticker.BCH.ask)
      }
    }

    // cryptomkt.com
    const cryptomkt = await trae.get('https://api.cryptomkt.com/v1/ticker')
    const cryptomkt_BTC_ARS = cryptomkt.data.data.find(coin => coin.market === 'BTCARS')
    const cryptomkt_ETH_ARS = cryptomkt.data.data.find(coin => coin.market === 'ETHARS')
    const cryptomkt_EOS_ARS = cryptomkt.data.data.find(coin => coin.market === 'EOSARS')
    const cryptomkt_XLM_ARS = cryptomkt.data.data.find(coin => coin.market === 'XLMARS')
    const cryptomktPrices = {
      BTC_ARS: {
        bid: Number(cryptomkt_BTC_ARS.bid),
        ask: Number(cryptomkt_BTC_ARS.ask)
      },
      ETH_ARS: {
        bid: Number(cryptomkt_ETH_ARS.bid),
        ask: Number(cryptomkt_ETH_ARS.ask)
      },
      EOS_ARS: {
        bid: Number(cryptomkt_EOS_ARS.bid),
        ask: Number(cryptomkt_EOS_ARS.ask)
      },
      XLM_ARS: {
        bid: Number(cryptomkt_XLM_ARS.bid),
        ask: Number(cryptomkt_XLM_ARS.ask)
      }
    }

    // bitex.la
    const bitex = await trae.get('https://bitex.la/api/tickers/btc_ars')
    const bitexParse = JSON.parse(bitex.data).data.attributes
    const bitexPrices = {
      BTC_ARS: {
        bid: Number(bitexParse.bid),
        ask: Number(bitexParse.ask)
      }
    }

    // buda.com
    const buda_BTC = await trae.get('https://www.buda.com/api/v2/markets/btc-ars/ticker')
    const buda_ETH = await trae.get('https://www.buda.com/api/v2/markets/eth-ars/ticker')
    const buda_LTC = await trae.get('https://www.buda.com/api/v2/markets/ltc-ars/ticker')
    const buda_BCH = await trae.get('https://www.buda.com/api/v2/markets/bch-ars/ticker')
    const budaPrices = {
      BTC_ARS: {
        bid: Number(buda_BTC.data.ticker.max_bid[0]),
        ask: Number(buda_BTC.data.ticker.min_ask[0])
      },
      ETH_ARS: {
        bid: Number(buda_ETH.data.ticker.max_bid[0]),
        ask: Number(buda_ETH.data.ticker.min_ask[0])
      },
      LTC_ARS: {
        bid: Number(buda_LTC.data.ticker.max_bid[0]),
        ask: Number(buda_LTC.data.ticker.min_ask[0])
      },
      BCH_ARS: {
        bid: Number(buda_BCH.data.ticker.max_bid[0]),
        ask: Number(buda_BCH.data.ticker.min_ask[0])
      }
    }

    // qubit.com.ar
    const qubit_bid = await trae.get('https://www.qubit.com.ar/c_unvalue')
    const qubit_ask = await trae.get('https://www.qubit.com.ar/c_value')
    const qubitPrices = {
      BTC_ARS: {
        bid: Number(qubit_bid.data.BTC[2]),
        ask: Number(qubit_ask.data.BTC[2])
      },
      USDT_ARS: {
        bid: Number(qubit_bid.data.USDT[2]),
        ask: Number(qubit_ask.data.USDT[2])
      },
      ETH_ARS: {
        bid: Number(qubit_bid.data.ETH[2]),
        ask: Number(qubit_ask.data.ETH[2])
      },
      XRP_ARS: {
        bid: Number(qubit_bid.data.XRP[2]),
        ask: Number(qubit_ask.data.XRP[2])
      },
      ADA_ARS: {
        bid: Number(qubit_bid.data.ADA[2]),
        ask: Number(qubit_ask.data.ADA[2])
      },
      ETC_ARS: {
        bid: Number(qubit_bid.data.ETC[2]),
        ask: Number(qubit_ask.data.ETC[2])
      },
      LINK_ARS: {
        bid: Number(qubit_bid.data.LINK[2]),
        ask: Number(qubit_ask.data.LINK[2])
      },
      XLM_ARS: {
        bid: Number(qubit_bid.data.XLM[2]),
        ask: Number(qubit_ask.data.XLM[2])
      },
      QTUM_ARS: {
        bid: Number(qubit_bid.data.QTUM[2]),
        ask: Number(qubit_ask.data.QTUM[2])
      },
      EOS_ARS: {
        bid: Number(qubit_bid.data.EOS[2]),
        ask: Number(qubit_ask.data.EOS[2])
      },
      TUSD_ARS: {
        bid: Number(qubit_bid.data.TUSD[2]),
        ask: Number(qubit_ask.data.TUSD[2])
      },
      PAX_ARS: {
        bid: Number(qubit_bid.data.PAX[2]),
        ask: Number(qubit_ask.data.PAX[2])
      },
      BNB_ARS: {
        bid: Number(qubit_bid.data.BNB[2]),
        ask: Number(qubit_ask.data.BNB[2])
      },
      LTC_ARS: {
        bid: Number(qubit_bid.data.LTC[2]),
        ask: Number(qubit_ask.data.LTC[2])
      },
      IOTA_ARS: {
        bid: Number(qubit_bid.data.IOTA[2]),
        ask: Number(qubit_ask.data.IOTA[2])
      },
      ICX_ARS: {
        bid: Number(qubit_bid.data.ICX[2]),
        ask: Number(qubit_ask.data.ICX[2])
      },
      NEO_ARS: {
        bid: Number(qubit_bid.data.NEO[2]),
        ask: Number(qubit_ask.data.NEO[2])
      }
    }

    // buenbit.com
    const buenbit = await trae.get('https://be.buenbit.com/api/market/tickers/')
    const buenbit_old = await trae.get('https://exchange.buenbit.com/api/v2/tickers')
    const buenbitPrices = {
      DAI_ARS: {
        bid: Number(buenbit.data.object.daiars.purchase_price),
        ask: Number(buenbit.data.object.daiars.selling_price)
      },
      DAI_USD: {
        bid: Number(buenbit.data.object.daiusd.purchase_price),
        ask: Number(buenbit.data.object.daiusd.selling_price)
      },
      BTC_ARS: {
        bid: Number(buenbit_old.data.btcars.ticker.buy),
        ask: Number(buenbit_old.data.btcars.ticker.sell)
      },
      ETH_ARS: {
        bid: Number(buenbit_old.data.ethars.ticker.buy),
        ask: Number(buenbit_old.data.ethars.ticker.sell)
      },
      BTC_DAI: {
        bid: Number(buenbit_old.data.btcdai.ticker.buy),
        ask: Number(buenbit_old.data.btcdai.ticker.sell)
      }
    }


    // universalcoins.net
    const universalcoins = await trae.get('https://api.universalcoins.net/Criptomonedas/obtenerDatosHome')
    const universalcoins_BTC_ARS = universalcoins.data.find(coin => coin.codigo === 'BTC')
    const universalcoins_ETH_ARS = universalcoins.data.find(coin => coin.codigo === 'ETH')
    const universalcoins_XRP_ARS = universalcoins.data.find(coin => coin.codigo === 'XRP')
    const universalcoins_LTC_ARS = universalcoins.data.find(coin => coin.codigo === 'LTC')
    const universalcoins_BCH_ARS = universalcoins.data.find(coin => coin.codigo === 'BCH')
    const universalcoins_EOS_ARS = universalcoins.data.find(coin => coin.codigo === 'EOS')
    const universalcoinsPrices = {
      BTC_ARS: {
        bid: Number(universalcoins_BTC_ARS.cotizacionBaseCompraARS) * Number(universalcoins_BTC_ARS.multiplicadorCompraARS),
        ask: Number(universalcoins_BTC_ARS.cotizacionBaseCompraARS) * Number(universalcoins_BTC_ARS.multiplicadorVentaARS)
      },
      ETH_ARS: {
        bid: Number(universalcoins_ETH_ARS.cotizacionBaseCompraARS) * Number(universalcoins_ETH_ARS.multiplicadorCompraARS),
        ask: Number(universalcoins_ETH_ARS.cotizacionBaseCompraARS) * Number(universalcoins_ETH_ARS.multiplicadorVentaARS)
      },
      XRP_ARS: {
        bid: Number(universalcoins_XRP_ARS.cotizacionBaseCompraARS) * Number(universalcoins_XRP_ARS.multiplicadorCompraARS),
        ask: Number(universalcoins_XRP_ARS.cotizacionBaseCompraARS) * Number(universalcoins_XRP_ARS.multiplicadorVentaARS)
      },
      LTC_ARS: {
        bid: Number(universalcoins_LTC_ARS.cotizacionBaseCompraARS) * Number(universalcoins_LTC_ARS.multiplicadorCompraARS),
        ask: Number(universalcoins_LTC_ARS.cotizacionBaseCompraARS) * Number(universalcoins_LTC_ARS.multiplicadorVentaARS)
      },
      BCH_ARS: {
        bid: Number(universalcoins_BCH_ARS.cotizacionBaseCompraARS) * Number(universalcoins_BCH_ARS.multiplicadorCompraARS),
        ask: Number(universalcoins_BCH_ARS.cotizacionBaseCompraARS) * Number(universalcoins_BCH_ARS.multiplicadorVentaARS)
      },
      EOS_ARS: {
        bid: Number(universalcoins_EOS_ARS.cotizacionBaseCompraARS) * Number(universalcoins_EOS_ARS.multiplicadorCompraARS),
        ask: Number(universalcoins_EOS_ARS.cotizacionBaseCompraARS) * Number(universalcoins_EOS_ARS.multiplicadorVentaARS)
      }
    }

    // pro.coinbase.com
    const coinbasepro_BTC_USDC = await trae.get('https://api.pro.coinbase.com/products/btc-usdc/ticker')
    const coinbasepro_DAI_USDC = await trae.get('https://api.pro.coinbase.com/products/dai-usdc/ticker')
    const coinbasepro_ETH_DAI = await trae.get('https://api.pro.coinbase.com/products/eth-dai/ticker')
    const coinbasepro_ETH_BTC = await trae.get('https://api.pro.coinbase.com/products/eth-btc/ticker')
    const coinbaseproPrices = {
      BTC_USDC: {
        bid: Number(coinbasepro_BTC_USDC.data.bid),
        ask: Number(coinbasepro_BTC_USDC.data.ask)
      },
      DAI_USDC: {
        bid: Number(coinbasepro_DAI_USDC.data.bid),
        ask: Number(coinbasepro_DAI_USDC.data.ask)
      },
      ETH_DAI: {
        bid: Number(coinbasepro_ETH_DAI.data.bid),
        ask: Number(coinbasepro_ETH_DAI.data.ask)
      },
      ETH_BTC: {
        bid: Number(coinbasepro_ETH_BTC.data.bid),
        ask: Number(coinbasepro_ETH_BTC.data.ask)
      }
    }

    let prices = {
      BTC_ARS: {
        ripio: {
          bid: ripioPrices.BTC_ARS.bid * 0.99, // 1% fee
          ask: ripioPrices.BTC_ARS.ask * 1.01, // 1% fee
          networkfee: 0.00003492 // https://ripio.com/api/v3/transactions/fees/network-fee/BTC/
        },
        bitso: {
          bid: bitsoPrices.BTC_ARS.bid * 0.998, // 0.2% fee
          ask: bitsoPrices.BTC_ARS.ask * 1.002, // 0.2% fee
          networkfee: 0.00004103 // https://bitso.com/fees
        },
        argenbtc: {
          bid: argenbtcPrices.BTC_ARS.bid, // spread fee
          ask: argenbtcPrices.BTC_ARS.ask, // spread fee
          networkfee: 0.00005 // https://argenbtc.com/SolicitarRetirosBTC
        },
        satoshitango: {
          bid: satoshitangoPrices.BTC_ARS.bid * 0.99, // 1% fee
          ask: satoshitangoPrices.BTC_ARS.ask * 1.01, // 1% fee
          networkfee: 0.0003 // https://www.satoshitango.com/help
        },
        cryptomkt: {
          bid: cryptomktPrices.BTC_ARS.bid * 0.985, // 1.5% fee
          ask: cryptomktPrices.BTC_ARS.ask * 1.015, // 1.5% fee
          networkfee: 0.0005 // https://www.cryptomkt.com/en/fees
        },
        bitex: {
          bid: bitexPrices.BTC_ARS.bid * 0.989 * 0.9975, // 1.1% + 0.25% fee
          ask: bitexPrices.BTC_ARS.ask * 1.011 * 1.0025, // 1.1% + 0.25% fee
          networkfee: 0 // https://bitex.zendesk.com/hc/es/articles/115000357172-Comisiones
        },
        buda: {
          bid: budaPrices.BTC_ARS.bid * 0.994 * 0.996, // 0.6% + 0.4% fee
          ask: budaPrices.BTC_ARS.ask * 1.006 * 1.004, // 0.6% + 0.4% fee
          networkfee: 0.0001 // https://www.buda.com/comisiones
        },
        qubit: {
          bid: qubitPrices.BTC_ARS.bid, // spread fee
          ask: qubitPrices.BTC_ARS.ask, // spread fee
          networkfee: 0 // https://www.qubit.com.ar/faq
        },
        buenbit: {
          bid: buenbitPrices.BTC_ARS.bid * 0.994 * 0.9965, // 0.6% + 0.35% fee
          ask: buenbitPrices.BTC_ARS.ask * 1.006 * 1.0035, // 0.6% + 0.35% fee
          networkfee: 0.00030 // https://exchange.buenbit.com/funds#/withdraws/btc
        },
        universalcoins: {
          bid: universalcoinsPrices.BTC_ARS.bid, // spread fee
          ask: universalcoinsPrices.BTC_ARS.ask * 1.032, // 3.2% fee
          networkfee: 0
        }
      },
      BTC_USD: {},
      DAI_ARS: {
        buenbit: {
          bid: buenbitPrices.DAI_ARS.bid,
          ask: buenbitPrices.DAI_ARS.ask,
          networkfee: 0
        }
      },
      DAI_USD: {
        buenbit: {
          bid: buenbitPrices.DAI_USD.bid,
          ask: buenbitPrices.DAI_USD.ask,
          networkfee: 0
        }
      },
      USD_ARS: {}
    }

    prices.USD_ARS.buenbit = {
      bid: prices.DAI_ARS.buenbit.bid / prices.DAI_USD.buenbit.ask,
      ask: prices.DAI_ARS.buenbit.ask / prices.DAI_USD.buenbit.bid
    }

    prices.BTC_ARS.dai_buenbit_usdc_coinbasepro_btc = {
      bid: coinbaseproPrices.BTC_USDC.bid * 0.995 * coinbaseproPrices.DAI_USDC.ask * 0.995 * prices.DAI_ARS.buenbit.bid, // 0.5% + 0.5% fee
      ask: 1 / (1 / prices.DAI_ARS.buenbit.ask * coinbaseproPrices.DAI_USDC.bid * 0.995 / coinbaseproPrices.BTC_USDC.ask * 0.995), // 0.5% + 0.5% fee
      networkfee: 0
    }

    prices.BTC_ARS.dai_buenbit_eth_coinbasepro_btc = {
      bid: 1 / coinbaseproPrices.ETH_BTC.ask * 0.995 * coinbaseproPrices.ETH_DAI.bid * 0.995 * prices.DAI_ARS.buenbit.bid, // 0.5% + 0.5% fee
      ask: 1 / (1 / prices.DAI_ARS.buenbit.ask / coinbaseproPrices.ETH_DAI.ask * 0.995 * coinbaseproPrices.ETH_BTC.bid * 0.995), // 0.5% + 0.5% fee
      networkfee: 0
    }

    prices.BTC_USD.dai_buenbit_usdc_coinbasepro_btc = {
      bid: coinbaseproPrices.BTC_USDC.bid * 0.995 * coinbaseproPrices.DAI_USDC.ask * 0.995 * prices.DAI_USD.buenbit.bid, // 0.5% + 0.5% fee
      ask: 1 / (1 / prices.DAI_USD.buenbit.ask * coinbaseproPrices.DAI_USDC.bid * 0.995 / coinbaseproPrices.BTC_USDC.ask * 0.995), // 0.5% + 0.5% fee
      networkfee: 0
    }

    prices.BTC_USD.dai_buenbit_eth_coinbasepro_btc = {
      bid: 1 / coinbaseproPrices.ETH_BTC.ask * 0.995 * coinbaseproPrices.ETH_DAI.bid * 0.995 * prices.DAI_USD.buenbit.bid, // 0.5% + 0.5% fee
      ask: 1 / (1 / prices.DAI_USD.buenbit.ask / coinbaseproPrices.ETH_DAI.ask * 0.995 * coinbaseproPrices.ETH_BTC.bid * 0.995), // 0.5% + 0.5% fee
      networkfee: 0
    }

    return prices
  } catch (err) {
    console.error('Error ' + err)
    throw err
  }
}

// export api
module.exports = async (req, res) => {
  try {
    // check last time updated
    const lastUpdateTime = await redisGet('argentina:time')

    const ONE_MINUTE = 1 * 60 * 1000
    const currentTime = Date.now()

    // if argentina:time is empty, just run the prices update
    const keyTime = ((lastUpdateTime == null) ? (currentTime - ONE_MINUTE) : lastUpdateTime)

    // calc diff
    const timeDiff = currentTime - keyTime

    // if last time >= 1 minute, update it now
    if (timeDiff >= ONE_MINUTE) {
      // save time of the update
      const redisReplyArgentinaTimeSet = await redisSet('argentina:time', currentTime)
      console.log(redisReplyArgentinaTimeSet)

      // get last prices
      const prices = JSON.stringify(await getPrices())

      // save prices
      const redisReplyArgentinaSet = await redisSet('argentina', prices)
      console.log(redisReplyArgentinaSet)

      res.end('Updated ' + prices)
    } else {
      const timeRemaining = new Date(ONE_MINUTE - timeDiff)
      res.end(`Wait ${timeRemaining.getUTCMinutes()} minutes and ${timeRemaining.getUTCSeconds()} seconds`)
      return
    }
  } catch (err) {
    console.error('Error ' + err)
    res.end('Error.')
  }
}
