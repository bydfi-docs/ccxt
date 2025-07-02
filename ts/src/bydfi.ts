//  ---------------------------------------------------------------------------
import Exchange from './abstract/bydfi.js';
import { TICK_SIZE } from './base/functions/number.js';
import { sha256 } from './static_dependencies/noble-hashes/sha256.js';
import { MarketInterface, Dict, Market, Ticker, int, Str, FundingRate, Int, LastPrice, Trade, OHLCV, TransferEntry, Currency } from './base/types.js';
import { BadRequest, ExchangeError, InvalidOrder, RateLimitExceeded } from './base/errors.js';

//  ---------------------------------------------------------------------------

/**
 * @class bydfi
 * @augments Exchange
 */
export default class bydfi extends Exchange {
    describe (): any {
        return this.deepExtend (super.describe (), {
            'id': 'bydfi',
            'name': 'Bydfi',
            'countries': [],
            'version': 'v1',
            'rateLimit': 20, // 600 requests per minute, 10 request per second
            'certified': false,
            'pro': true,
            'dex': true,
            'has': {
                'CORS': undefined,
                'spot': false,
                'margin': false,
                'swap': true,
                'future': false,
                'option': false,
                'addMargin': false,
                'borrowCrossMargin': false,
                'borrowIsolatedMargin': false,
                'cancelAllOrders': true,
                'cancelAllOrdersAfter': false,
                'cancelOrder': true,
                'cancelOrders': false,
                'cancelOrdersForSymbols': false,
                'closeAllPositions': false,
                'closePosition': false,
                'createMarketBuyOrderWithCost': false,
                'createMarketOrderWithCost': false,
                'createMarketSellOrderWithCost': false,
                'createOrder': true,
                'createOrders': false,
                'createPostOnlyOrder': true,
                'createReduceOnlyOrder': true,
                'createStopOrder': true,
                'createTriggerOrder': true,
                'editOrder': false,
                'fetchAccounts': true,
                'fetchBalance': true,
                'fetchBorrowInterest': false,
                'fetchBorrowRateHistories': false,
                'fetchBorrowRateHistory': false,
                'fetchCanceledAndClosedOrders': false,
                'fetchCanceledOrders': false,
                'fetchClosedOrders': false,
                'fetchCrossBorrowRate': false,
                'fetchCrossBorrowRates': false,
                'fetchCurrencies': true,
                'fetchDepositAddress': false,
                'fetchDepositAddresses': false,
                'fetchDeposits': false,
                'fetchDepositWithdrawFee': false,
                'fetchDepositWithdrawFees': false,
                'fetchFundingHistory': true,
                'fetchFundingRate': true,
                'fetchFundingRateHistory': true,
                'fetchFundingRates': false,
                'fetchIndexOHLCV': false,
                'fetchIsolatedBorrowRate': false,
                'fetchIsolatedBorrowRates': false,
                'fetchLedger': false,
                'fetchLeverage': false,
                'fetchLeverageTiers': false,
                'fetchLiquidations': false,
                'fetchMarginMode': false,
                'fetchMarketLeverageTiers': false,
                'fetchMarkets': true,
                'fetchMarkOHLCV': false,
                'fetchMyLiquidations': false,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenInterest': true,
                'fetchOpenInterestHistory': false,
                'fetchOpenInterests': false,
                'fetchOpenOrders': true,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchOrders': true,
                'fetchOrderTrades': true,
                'fetchPosition': false,
                'fetchPositionMode': false,
                'fetchPositions': true,
                'fetchPositionsRisk': false,
                'fetchPremiumIndexOHLCV': false,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTime': true,
                'fetchTrades': true,
                'fetchTradingFee': false,
                'fetchTradingFees': false,
                'fetchTransfer': true,
                'fetchTransfers': true,
                'fetchWithdrawal': false,
                'fetchWithdrawals': false,
                'reduceMargin': false,
                'repayCrossMargin': false,
                'repayIsolatedMargin': false,
                'setLeverage': true,
                'setMarginMode': false,
                'setPositionMode': false,
                'transfer': true,
                'withdraw': false,
            },
            'timeframes': {
                '1m': '1',
                '5m': '5',
                '15m': '15',
                '30m': '30',
                '1h': '60',
                '2h': '120',
                '4h': '240',
                '6h': '360',
                '12h': '720',
                '1d': 'D',
                '1w': 'W',
                '1M': 'M',
            },
            'apiKey': '8Rfw25q1uta4P8x0823KOrAQIXfWhYEh',
            'secret': '0XUrovUtTQxfdjC6XSZeTXKU6q18UgI6dnvKf69hOru5wsmXUhWE6HXAnA7Phdck',
            'hostname': 'api.bydtms.com',
            'urls': {
                'logo': 'https://github.com/user-attachments/assets/fef8f2f7-4265-46aa-965e-33a91881cb00',
                'api': {
                    'public': 'https://{hostname}/api',
                    'private': 'https://{hostname}/api',
                },
                'test': {
                    'public': 'https://testnet.omni.bydfi.exchange/api',
                    'private': 'https://testnet.omni.bydfi.exchange/api',
                },
                'www': 'https://bydfi.exchange/',
                'doc': 'https://api-docs.pro.bydfi.exchange',
                'fees': 'https://bydfi-pro.gitbook.io/bydfi-pro/bydfi-omni-live-now/trading-perpetual-contracts/trading-fees',
                'referral': 'https://omni.bydfi.exchange/trade',
            },
            'api': {
                'public': {
                    'get': {
                        'v1/swap/market/exchange_info': 1,
                        'v1/swap/market/ticker/24hr': 1,
                        'v1/swap/market/depth': 1,
                        'v1/swap/market/trades': 1,
                        'v1/swap/market/klines': 1,
                        'v1/swap/market/ticker/price': 1,
                        'v1/swap/market/mark_price': 1,
                        'v1/swap/market/funding_rate': 1,
                        'v1/swap/market/funding_rate_history': 1,
                    },
                },
                'private': {
                    'get': {
                        'v1/account/assets': 1,
                        'v1/account/transfer_records': 1,
                        'v1/spot/deposit_records': 1,
                        'v1/spot/withdraw_records': 1,
                        'v1/swap/account/balance': 1,
                        'v1/swap/user_data/assets_margin': 1,
                        'v1/swap/user_data/position_side/dual': 1,
                    },
                    'post': {
                        'v1/account/transfer': 1,
                        'v1/swap/user_data/margin_type': 1,
                        'v1/swap/user_data/position_side/dual': 1,
                    },
                },
            },
            'httpExceptions': {
                '403': RateLimitExceeded, // Forbidden -- You request too many times
            },
            'exceptions': {
                // Uncodumented explanation of error strings:
                // - oc_diff: order cost needed to place this order
                // - new_oc: total order cost of open orders including the order you are trying to open
                // - ob: order balance - the total cost of current open orders
                // - ab: available balance
                'exact': {
                    '20006': 'apikey sign error', // apikey sign error
                    '20016': 'request para error', // apikey sign error
                    '10001': BadRequest,
                },
                'broad': {
                    'ORDER_PRICE_MUST_GREETER_ZERO': InvalidOrder,
                    'ORDER_POSSIBLE_LEAD_TO_ACCOUNT_LIQUIDATED': InvalidOrder,
                    'ORDER_WITH_THIS_PRICE_CANNOT_REDUCE_POSITION_ONLY': InvalidOrder,
                },
            },
            'fees': {
                'swap': {
                    'taker': this.parseNumber ('0.0005'),
                    'maker': this.parseNumber ('0.0002'),
                },
            },
            'requiredCredentials': {
                'apiKey': true,
                'secret': true,
            },
            'precisionMode': TICK_SIZE,
            'commonCurrencies': {},
            'options': {
                'defaultType': 'swap',
                'defaultSlippage': 0.05,
                'brokerId': '6956',
            },
            'features': {
                'default': {
                    'sandbox': true,
                    'createOrder': {
                        'marginMode': false,
                        'triggerPrice': true,
                        'triggerPriceType': undefined,
                        'triggerDirection': false,
                        'stopLossPrice': false, // todo
                        'takeProfitPrice': false, // todo
                        'attachedStopLossTakeProfit': undefined,
                        'timeInForce': {
                            'IOC': true,
                            'FOK': true,
                            'PO': true,
                            'GTD': true,
                        },
                        'hedged': false,
                        'selfTradePrevention': false,
                        'trailing': true, // todo unify
                        'leverage': false,
                        'marketBuyByCost': false,
                        'marketBuyRequiresPrice': false,
                        'iceberg': false,
                    },
                    'createOrders': undefined,
                    'fetchMyTrades': {
                        'marginMode': false,
                        'limit': 500,
                        'daysBack': 100000,
                        'untilDays': 100000,
                        'symbolRequired': false,
                    },
                    'fetchOrder': {
                        'marginMode': false,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': false,
                    },
                    'fetchOpenOrders': {
                        'marginMode': false,
                        'limit': undefined,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': false,
                    },
                    'fetchOrders': {
                        'marginMode': false,
                        'limit': 100,
                        'daysBack': 100000,
                        'untilDays': 100000,
                        'trigger': false,
                        'trailing': false,
                        'symbolRequired': false,
                    },
                    'fetchClosedOrders': undefined,
                    'fetchOHLCV': {
                        'limit': 200,
                    },
                },
                'swap': {
                    'linear': {
                        'extends': 'default',
                    },
                    'inverse': undefined,
                },
            },
        });
    }

    /**
     * @method
     * @name bydfi#fetchMarkets
     * @description retrieves data on all markets for bydfi
     * @see https://api-docs.pro.bydfi.exchange/#publicapi-v3-for-omni-get-all-config-data-v3
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} an array of objects representing market data
     */
    async fetchMarkets (params = {}): Promise<Market[]> {
        const response = await this.publicGetV1SwapMarketExchangeInfo (params);
        const data = this.safeList (response, 'data', []);
        return this.parseMarkets (data);
    }

    parseMarket (market: Dict): Market {
        const id = this.safeString (market, 'symbol');
        const quoteId = this.safeString (market, 'marginAsset');
        const baseId = this.safeString (market, 'baseAsset');
        const quote = this.safeString (market, 'marginAsset');
        const base = this.safeCurrencyCode (baseId);
        const settleId = this.safeString (market, 'marginAsset');
        const settle = this.safeCurrencyCode (settleId);
        const symbol = baseId + '/' + quote + ':' + settle;
        const takerFee = this.safeNumber (market, 'feeRateTaker');
        const makerFee = this.safeNumber (market, 'feeRateMaker');
        return this.safeMarketStructure ({
            'id': id,
            'symbol': symbol,
            'base': base,
            'quote': quote,
            'settle': settle,
            'baseId': baseId,
            'quoteId': quoteId,
            'settleId': settleId,
            'type': 'swap',
            'spot': false,
            'margin': undefined,
            'swap': true,
            'future': false,
            'option': false,
            'active': this.safeString (market, 'status') === 'NORMAL',
            'contract': true,
            'linear': true,
            'inverse': false,
            'taker': takerFee,
            'maker': makerFee,
            'contractSize': this.safeNumber (market, 'minOrderSize'),
            'expiry': undefined,
            'expiryDatetime': undefined,
            'strike': undefined,
            'optionType': undefined,
            'precision': {
                'amount': this.safeNumber (market, 'volumePrecision'),
                'price': this.safeNumber (market, 'pricePrecision'),
            },
            'limits': {
                'leverage': {
                    'min': 1,
                    'max': this.safeNumber (market, 'maxLeverageLevel'),
                },
                'amount': {
                    'min': undefined,
                    'max': undefined,
                },
                'price': {
                    'min': undefined,
                    'max': undefined,
                },
                'cost': {
                    'min': undefined,
                    'max': undefined,
                },
            },
            'created': undefined,
            'info': market,
        });
    }

    /**
     * @method
     * @name bydfi#fetchSwapTicker
     * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
     * @see https://api-docs.pro.bydfi.exchange/#publicapi-v3-for-omni-get-ticker-data-v3
     * @param {string} symbol unified symbol of the market to fetch the ticker for
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchSwapTicker (symbol: string, params = {}) {
        await this.loadMarkets ();
        const request: Dict = {};
        if (symbol) {
            const market = this.market (symbol);
            request['symbol'] = market['id'];
        }
        const response = await this.publicGetV1SwapMarketTicker24hr (this.extend (request, params));
        if (symbol) {
            const tickers = this.safeList (response, 'data', []);
            const rawTicker = this.safeDict (tickers, 0, {});
            return this.parseSwapTicker (rawTicker);
        } else {
            const tickers = this.safeList (response, 'data', []);
            const result = [];
            for (let i = 0; i < tickers.length; i++) {
                result.push (this.parseSwapTicker (tickers[i]));
            }
            return result;
        }
    }

    parseSwapTicker (ticker: Dict): Ticker {
        const timestamp = this.milliseconds ();
        const symbol = this.safeString (ticker, 'symbol');
        const market = this.market (symbol);
        const baseVolume = this.safeString (ticker, 'vol');
        const open = this.safeString (ticker, 'open');
        const close = this.safeString (ticker, 'close');
        const last = this.safeString (ticker, 'last');
        const high = this.safeString (ticker, 'high');
        const low = this.safeString (ticker, 'low');
        const bid = this.safeString (ticker, 'buy');
        const ask = this.safeString (ticker, 'sell');
        const markPrice = this.safeString (ticker, 'markPrice');
        const indexPrice = this.safeString (ticker, 'indexPrice');
        return this.safeTicker ({
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': high,
            'low': low,
            'bid': bid,
            'bidVolume': undefined,
            'ask': ask,
            'askVolume': undefined,
            'vwap': undefined,
            'open': open,
            'close': close,
            'last': last,
            'previousClose': undefined,
            'change': undefined,
            'percentage': undefined,
            'average': undefined,
            'baseVolume': baseVolume,
            'quoteVolume': undefined,
            'markPrice': markPrice,
            'indexPrice': indexPrice,
            'info': ticker,
        }, market);
    }

    /**
     * @method
     * @name bydfi#fetchSwapFundingRate
     * @description fetch the current funding rate
     * @see https://developers.bydfi.com/swap/market
     * @param {string} symbol unified symbol of the market to fetch the funding rate for
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [funding rate structure]{@link https://docs.ccxt.com/#/?id=funding-rate-structure}
     */
    async fetchSwapFundingRate (symbol: string, params = {}) {
        await this.loadMarkets ();
        const request: Dict = {};
        if (symbol) {
            const market = this.market (symbol);
            request['symbol'] = market['id'];
        }
        const response = await this.publicGetV1SwapMarketFundingRate (this.extend (request, params));
        if (symbol) {
            const data = this.safeList (response, 'data', []);
            const rawFundingRate = this.safeDict (data, 0, {});
            return this.parseSwapFundingRate (rawFundingRate);
        } else {
            const data = this.safeList (response, 'data', []);
            const result = [];
            for (let i = 0; i < data.length; i++) {
                result.push (this.parseSwapFundingRate (data[i]));
            }
            return result;
        }
    }

    /**
     * @method
     * @name bydfi#parseSwapFundingRate
     * @description parse funding rate structure
     * @param {object} funding funding rate data from exchange
     * @returns {object} a [funding rate structure]{@link https://docs.ccxt.com/#/?id=funding-rate-structure}
     */
    parseSwapFundingRate (funding: any): FundingRate {
        const fundingRate = this.safeNumber (funding, 'lastFundingRate');
        const nextFundingTime = this.safeInteger (funding, 'nextFundingTime');
        const timestamp = this.safeInteger (funding, 'time');
        return {
            'info': funding,
            'symbol': funding.symbol,
            'markPrice': undefined,
            'indexPrice': undefined,
            'interestRate': undefined,
            'estimatedSettlePrice': undefined,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'fundingRate': fundingRate,
            'fundingTimestamp': nextFundingTime,
            'fundingDatetime': this.iso8601 (nextFundingTime),
            'nextFundingRate': undefined,
            'nextFundingTimestamp': nextFundingTime,
            'nextFundingDatetime': this.iso8601 (nextFundingTime),
            'previousFundingRate': undefined,
            'previousFundingTimestamp': undefined,
            'previousFundingDatetime': undefined,
            'interval': '8h',
        };
    }

    /**
     * @method
     * @name bydfi#fetchSwapFundingHistory
     * @description fetches information on multiple orders made by the user *classic accounts only*
     * @see https://api-docs.pro.bydfi.exchange/#publicapi-v3-for-omni-get-funding-rate-history-v3
     * @param {string} symbol unified market symbol of the market orders were made in
     * @param {int} [since] the earliest time in ms to fetch orders for
     * @param {int} [limit] the maximum number is 1000, default 100
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {object} [params.endTime] end time, ms
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=funding-history-structure}
     */
    async fetchSwapFundingHistory (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        await this.loadMarkets ();
        const request: Dict = {};
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['symbol'] = market['id'];
        }
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const endTime = this.safeIntegerN (params, [ 'endTime' ]);
        if (endTime !== undefined) {
            params = this.omit (params, [ 'endTime' ]);
            request['endTime'] = endTime;
        }
        const response = await this.publicGetV1SwapMarketFundingRateHistory (this.extend (request, params));
        const data = this.safeList (response, 'data', []);
        return this.parseSwapFundingHistory (data);
    }

    parseSwapFundingHistory (list) {
        const code = 'USDT';
        const result = [];
        for (let i = 0; i < list.length; i++) {
            const income = list[i];
            const timestamp = this.safeInteger (income, 'fundingTime');
            result.push ({
                'info': income,
                'symbol': this.safeString (income, 'symbol'),
                'code': code,
                'timestamp': timestamp,
                'datetime': this.iso8601 (timestamp),
                'id': this.safeString (income, 'symbol'),
                'amount': 0,
                'rate': this.safeNumber (income, 'fundingRate'),
            });
        }
        return result;
    }

    /**
     * @method
     * @name bydfi#fetchSwapMarketDepth
     * @description fetches the market depth
     * @param {string} symbol unified symbol of the market to fetch the market depth for
     * @param {int} [limit] the maximum number of market depth entries to fetch, default 500, available values:[5, 10, 20, 50, 100, 500, 1000]
     * @returns {object[]} a list of market depth structures,
     */
    async fetchSwapMarketDepth (symbol = undefined, limit = 500) {
        // {
        //     "lastUpdateId": 1027024,
        //     "E": 1589436922972,
        //     "bids": [
        //       [
        //         {
        //             "price": "4.00000000",
        //             "amount": "431.00000000"
        //         }
        //       ]
        //     ],
        //     "asks": [
        //       [
        //         {
        //             "price": "4.00000000",
        //             "amount": "431.00000000"
        //         }
        //       ]
        //     ]
        //   }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'limit': limit,
        };
        if (symbol !== undefined) {
            request['symbol'] = market['id'];
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await this.publicGetV1SwapMarketDepth (request);
        return this.safeDict (response, 'data', {});
    }

    /**
     * @method
     * @name bydfi#fetchTrades
     * @description fetches the market trades
     * @param {string} symbol unified symbol of the market to fetch the trades for
     * @param {int} [since] the earliest time in ms to fetch trades for
     * @param {int} [limit] the maximum number of trades to fetch, default 500
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {object} [params.fromId] start returning trades from this trade ID. By default returns most recent trades
     * @returns {object[]} a list of trade structures
     */
    async fetchTrades (symbol: string, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'limit': limit,
        };
        if (symbol !== undefined) {
            request['symbol'] = market['id'];
        }
        if (since !== undefined) {
            request['since'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await this.publicGetV1SwapMarketTrades (request);
        const trades = this.safeList (response, 'data', []);
        return this.parseTrades (trades, market, since, limit);
    }

    parseTrade (trade: Dict, market: Market = undefined): Trade {
        // [
        //     {
        //       "id": 28457,
        //       "symbol": "BTC-USDT",
        //       "price": "4.00000100",
        //       "qty": "12.00000000",
        //       "side": "BUY",
        //       "time": 1499865549590
        //     }
        //   ]
        const marketId = this.safeStringN (trade, [ 'symbol' ]);
        market = this.safeMarket (marketId, market);
        const id = this.safeStringN (trade, [ 'id' ]);
        const timestamp = this.safeIntegerN (trade, [ 'time' ]);
        const priceString = this.safeStringN (trade, [ 'price' ]);
        const amountString = this.safeStringN (trade, [ 'qty' ]);
        const side = this.safeStringLowerN (trade, [ 'side' ]);
        return this.safeTrade ({
            'info': trade,
            'id': id,
            'order': id,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': market['symbol'],
            'type': undefined,
            'takerOrMaker': undefined,
            'side': side,
            'price': priceString,
            'amount': amountString,
            'cost': undefined,
            'fee': undefined,
        }, market);
    }

    /**
     * @method
     * @name bydfi#fetchOHLCV
     * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
     * @see https://api-docs.pro.apex.exchange/#publicapi-v3-for-omni-get-candlestick-chart-data-v3
     * @param {string} symbol unified symbol of the market to fetch OHLCV data for
     * @param {string} timeframe the length of time each candle represents
     * @param {int} [since] timestamp in ms of the earliest candle to fetch
     * @param {int} [limit] the maximum amount of candles to fetch
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.endTime] timestamp in ms of the latest candle to fetch
     * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
     */
    async fetchOHLCV (symbol: string, timeframe = '1m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        let request: Dict = {
            'interval': timeframe,
            'symbol': market['id'],
        };
        if (limit === undefined) {
            limit = 500; // default is 500 when requested with `since`
        }
        request['limit'] = limit; // max 1500, default 500
        [ request, params ] = this.handleUntilOption ('end', request, params);
        if (since !== undefined) {
            request['startTime'] = since;
        }
        const response = await this.publicGetV1SwapMarketKlines (this.extend (request, params));
        const OHLCVs = this.safeList (response, 'data', []);
        return this.parseOHLCVs (OHLCVs, market, timeframe, since, limit);
    }

    parseOHLCV (ohlcv, market: Market = undefined): OHLCV {
        //
        //  {
        //     "start": 1647511440000,
        //     "symbol": "BTC-USD",
        //     "interval": "1",
        //     "low": "40000",
        //     "high": "45000",
        //     "open": "45000",
        //     "close": "40000",
        //     "volume": "1.002",
        //     "turnover": "3"
        //  } {"s":"BTCUSDT","i":"1","t":1741265880000,"c":"90235","h":"90235","l":"90156","o":"90156","v":"0.052","tr":"4690.4466"}
        //
        return [
            this.safeIntegerN (ohlcv, [ 'timestamp', 't' ]),
            this.safeNumberN (ohlcv, [ 'open', 'o' ]),
            this.safeNumberN (ohlcv, [ 'high', 'h' ]),
            this.safeNumberN (ohlcv, [ 'low', 'l' ]),
            this.safeNumberN (ohlcv, [ 'close', 'c' ]),
            this.safeNumberN (ohlcv, [ 'volume', 'v' ]),
        ];
    }

    /**
     * @method
     * @name bydfi#fetchLastPrice
     * @description fetches mark price for the market
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/rest-api/Index-Price-and-Mark-Price
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Mark-Price
     * @param {string|undefined} symbol unified symbol of the market to fetch the last price
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of lastprice structures
     */
    async fetchSwapLastPrice (symbol = undefined, params = {}): Promise<LastPrice[]> {
        await this.loadMarkets ();
        const request: Dict = {};
        if (symbol !== undefined) {
            const market = this.market (symbol);
            request['symbol'] = market['id'];
        }
        const response = await this.publicGetV1SwapMarketTickerPrice (this.extend (request, params));
        const data = this.safeList (response, 'data', []);
        return this.parsePrice (data);
    }

    parsePrice (entry) {
        const timestamp = this.milliseconds ();
        const result = [];
        for (let i = 0; i < entry.length; i++) {
            const data = entry[i];
            const symbol = this.safeString (data, 'symbol');
            result.push ({
                'symbol': symbol,
                'timestamp': timestamp,
                'datetime': this.iso8601 (timestamp),
                'price': this.safeNumberOmitZero (data, 'price'),
                'side': undefined,
                'info': entry,
            });
        }
        return result;
    }

    /**
     * @method
     * @name bydfi#fetchMarkPrice
     * @description fetches mark price for the market
     * @see https://developers.bydfi.com/swap/market
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Mark-Price
     * @param {string} symbol unified symbol of the market to fetch the ticker for
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a dictionary of mark price structures
     */
    async fetchMarkPrice (symbol: string, params = {}): Promise<Ticker> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        const response = await this.publicGetV1SwapMarketMarkPrice (this.extend (request, params));
        const data = this.safeDict (response, 'data', {});
        return this.parseSwapTicker (data);
    }

    safeMarket (marketId: Str = undefined, market: Market = undefined, delimiter: Str = undefined, marketType: Str = undefined): MarketInterface {
        if (market === undefined && marketId !== undefined) {
            if (marketId in this.markets) {
                market = this.markets[marketId];
            } else if (marketId in this.markets_by_id) {
                market = this.markets_by_id[marketId];
            } else {
                const newMarketId = this.addHyphenBeforeUsdt (marketId);
                if (newMarketId in this.markets_by_id) {
                    const markets = this.markets_by_id[newMarketId];
                    const numMarkets = markets.length;
                    if (numMarkets > 0) {
                        if (this.markets_by_id[newMarketId][0]['id2'] === marketId) {
                            market = this.markets_by_id[newMarketId][0];
                        }
                    }
                }
            }
        }
        return super.safeMarket (marketId, market, delimiter, marketType);
    }

    addHyphenBeforeUsdt (symbol: string) {
        const uppercaseSymbol = symbol.toUpperCase ();
        const index = uppercaseSymbol.indexOf ('USDT');
        const symbolChar = this.safeString (symbol, index - 1);
        if (index > 0 && symbolChar !== '-') {
            return symbol.slice (0, index) + '-' + symbol.slice (index);
        }
        return symbol;
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.implodeHostname (this.urls['api'][api]) + '/' + path;
        headers = {
            'Content-Type': 'application/json',
        };
        let signBody = body;
        if (method.toUpperCase () !== 'POST') {
            if (Object.keys (params).length) {
                url += '?' + this.rawencode (params);
            }
        } else {
            signBody = JSON.stringify (params);
        }
        if (api === 'private') {
            this.checkRequiredCredentials ();
            const timestamp = this.milliseconds ().toString ();
            const parts = this.rawencode (params).split ('&');
            parts.sort ();
            const parseParams = parts.join ('&');
            let messageString = this.apiKey + timestamp;
            if (method === 'GET') {
                messageString = messageString + parseParams;
            }
            if (signBody !== undefined) {
                messageString = messageString + signBody;
            }
            const signature = this.hmac (messageString, this.secret, sha256);
            headers['X-API-KEY'] = this.apiKey;
            headers['X-API-TIMESTAMP'] = timestamp;
            headers['X-API-SIGNATURE'] = signature;
        }
        return { 'url': url, 'method': method, 'body': signBody, 'headers': headers };
    }

    /**
     * @method
     * @name bydfi#fetchAccountAssets
     * @description Get account asset information
     * @see https://developers.bydfi.com/account
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.walletType] wallet type: spot / fund
     * @param {string} [params.asset] asset currency, such as BTC, USDT
     * @returns {object} a [balance structure]{@link https://docs.ccxt.com/#/?id=balance-structure}
     */
    async fetchAccountAssets (params = {}) {
        const request = {};
        const walletType = this.safeString (params, 'walletType');
        const asset = this.safeString (params, 'asset');
        if (walletType !== undefined) {
            request['walletType'] = walletType;
        }
        if (asset !== undefined) {
            request['asset'] = asset;
        }
        const response = await this.privateGetV1AccountAssets (this.extend (request, params));
        return this.safeList (response, 'data', []);
    }

    /**
     * @method
     * @name bydfi#parseAccountAssets
     * @description Parse account balance response
     * @param {object} response API response data
     * @returns {object} standardized balance structure
     */
    parseAccountAssets (response) {
        const data = this.safeList (response, 'data', []);
        const result = {
            'info': data,
            'timestamp': this.milliseconds (),
            'datetime': this.iso8601 (this.milliseconds ()),
        };
        for (let i = 0; i < data.length; i++) {
            const asset = data[i];
            const walletType = this.safeString (asset, 'walletType'); // spot / fund
            const currencyId = this.safeString (asset, 'asset');
            const code = this.safeCurrencyCode (currencyId);
            // Create different accounts for different wallet types
            const accountKey = walletType === 'spot' ? code : code + '_' + walletType;
            const account = this.account ();
            account['free'] = this.safeString (asset, 'available');    // Available balance
            account['used'] = this.safeString (asset, 'frozen');       // Frozen balance
            account['total'] = this.safeString (asset, 'total');       // Total balance
            result[accountKey] = account;
        }
        return this.safeBalance (result);
    }

    /**
     * @method
     * @name bydfi#transfer
     * @description transfer currency internally between wallets on the same account
     * @param {string} code unified currency code
     * @param {float} amount amount to transfer
     * @param {string} fromAccount account to transfer from, 來源錢包類型 SPOT / SWAP / FUND
     * @param {string} toAccount account to transfer to, 目標錢包類型 SPOT / SWAP / FUND
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [transfer structure]{@link https://docs.ccxt.com/#/?id=transfer-structure}
     */
    async transfer (code: string, amount: number, fromAccount: string, toAccount: string, params = {}): Promise<TransferEntry> {
        await this.loadMarkets ();
        const request: Dict = {
            'asset': code,
            'fromType': fromAccount,
            'toType': toAccount,
            'amount': amount,
        };
        const response = await this.privatePostV1AccountTransfer (this.extend (request, params));
        const currentTime = this.milliseconds ();
        return this.parseTransfer (this.extend (response, {
            'timestamp': currentTime,
            'datetime': this.iso8601 (currentTime),
            'amount': this.parseNumber (amount),
            'fromAccount': fromAccount,
            'toAccount': toAccount,
            'code': code,
        }));
    }

    parseTransfer (transfer: Dict, currency: Currency = undefined): TransferEntry {
        const timestamp = this.safeInteger (transfer, 'timestamp');
        const fromAccount = this.safeString (transfer, 'fromAccount');
        const toAccount = this.safeString (transfer, 'toAccount');
        const code = this.safeString (transfer, 'code');
        return {
            'info': transfer,
            'id': this.safeStringN (transfer, [ 'transferId', 'id' ]),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'currency': code,
            'amount': this.safeNumber (transfer, 'amount'),
            'fromAccount': fromAccount,
            'toAccount': toAccount,
            'status': this.safeBool (transfer, 'success') ? 'success' : 'error',
        };
    }

    /**
     * @method
     * @name bydfi#fetchTransferRecords
     * @description fetch transfer records
     * @param {string} asset asset currency, e.g. BTC, USDT
     * @param {number} startTime start timestamp (milliseconds)
     * @param {number} endTime end timestamp (milliseconds)
     * @param {number} [page] page number, starting from 1, default is 1
     * @param {number} [rows] number of records per page, default is 10
     * @returns {object[]} list of transfer records
     */
    async fetchTransferRecords (asset: string, startTime: number, endTime: number, page = undefined, rows = undefined) {
        const request = {
            'asset': asset,
            'startTime': startTime,
            'endTime': endTime,
        };
        if (page !== undefined) {
            request['page'] = page;
        }
        if (rows !== undefined) {
            request['rows'] = rows;
        }
        const response = await this.privateGetV1AccountTransferRecords (request);
        return this.safeList (response, 'data', []);
    }

    /**
     * @method
     * @name bydfi#fetchSpotDepositRecords
     * @description fetch spot deposit records
     * @param {string} asset asset currency, e.g. BTC, USDT
     * @param {number} startTime start timestamp (milliseconds)
     * @param {number} endTime end timestamp (milliseconds)
     * @param {number} [limit] number of records to return, default is 500, maximum is 1000
     * @returns {object[]} list of deposit records
     */
    async fetchSpotDepositRecords (asset: string, startTime: number, endTime: number, limit = 500) {
        const request = {
            'asset': asset,
            'startTime': startTime,
            'endTime': endTime,
            'limit': limit,
        };
        // Check if time range exceeds 7 days
        const sevenDays = 7 * 24 * 60 * 60 * 1000; // milliseconds in 7 days
        if ((endTime - startTime) > sevenDays) {
            throw new BadRequest (this.id + ' fetchSpotDepositRecords() time range cannot exceed 7 days');
        }
        // Check if time range exceeds 6 months
        const sixMonths = 6 * 30 * 24 * 60 * 60 * 1000; // milliseconds in 6 months
        if ((endTime - startTime) > sixMonths) {
            throw new BadRequest (this.id + ' fetchSpotDepositRecords() time range cannot exceed 6 months');
        }
        const response = await this.privateGetV1SpotDepositRecords (request);
        return this.safeList (response, 'data', []);
    }

    /**
     * @method
     * @name bydfi#fetchSpotWithdrawRecords
     * @description fetch spot withdraw records
     * @param {string} asset asset currency, e.g. BTC, USDT
     * @param {number} startTime start timestamp (milliseconds)
     * @param {number} endTime end timestamp (milliseconds)
     * @param {number} [limit] number of records to return, default is 500, maximum is 1000
     * @returns {object[]} list of deposit records
     */
    async fetchSpotWithdrawRecords (asset: string, startTime: number, endTime: number, limit = 500) {
        const request = {
            'asset': asset,
            'startTime': startTime,
            'endTime': endTime,
            'limit': limit,
        };
        // Check if time range exceeds 7 days
        const sevenDays = 7 * 24 * 60 * 60 * 1000; // milliseconds in 7 days
        if ((endTime - startTime) > sevenDays) {
            throw new BadRequest (this.id + ' fetchSpotWithdrawRecords() time range cannot exceed 7 days');
        }
        // Check if time range exceeds 6 months
        const sixMonths = 6 * 30 * 24 * 60 * 60 * 1000; // milliseconds in 6 months
        if ((endTime - startTime) > sixMonths) {
            throw new BadRequest (this.id + ' fetchSpotWithdrawRecords() time range cannot exceed 6 months');
        }
        const response = await this.privateGetV1SpotWithdrawRecords (request);
        return this.safeList (response, 'data', []);
    }

    /**
     * @method
     * @name bydfi#fetchSwapBalance
     * @description fetch swap account balance information
     * @param {string} wallet wallet identifier, e.g. 'W001'
     * @param {string} [asset] asset currency, e.g. BTC, USDT - if not specified, returns all assets
     * @returns {object[]} list of balance information for the specified wallet
     */
    async fetchSwapBalance (wallet: string, asset = undefined) {
        const request = {
            'wallet': wallet,
        };
        if (asset !== undefined) {
            request['asset'] = asset;
        }
        const response = await this.privateGetV1SwapAccountBalance (request);
        return this.safeList (response, 'data', []);
    }

    /**
     * @method
     * @name bydfi#fetchSwapMarginType
     * @description fetch swap margin type
     * @param {string} contractType contract type, value can be FUTURE or DELIVERY
     * @param {string} wallet wallet identifier, e.g. 'W001'
     * @param {string} symbol symbol, e.g. 'BTC-USDT'
     * @returns {object[]} list of margin type information
     */
    async fetchSwapMarginType (contractType: string, wallet: string, symbol: string) {
        const request = {
            'contractType': contractType,
            'wallet': wallet,
            'symbol': symbol,
        };
        const response = await this.privateGetV1SwapUserDataAssetsMargin (request);
        return this.safeDict (response, 'data', {});
    }

    /**
     * @method
     * @name bydfi#fetchSwapPositionSideDual
     * @description fetch swap position side dual
     * @param {string} contractType contract type, value can be FUTURE or DELIVERY
     * @param {string} wallet wallet identifier, e.g. 'W001'
     * @returns {object[]} list of position side dual information
     */
    async fetchSwapPositionSideDual (contractType: string, wallet: string) {
        const request = {
            'contractType': contractType,
            'wallet': wallet,
        };
        const response = await this.privateGetV1SwapUserDataPositionSideDual (request);
        return this.safeDict (response, 'data', {});
    }

    /**
     * @method
     * @name bydfi#convertMarginType
     * @description convert margin type
     * @param {string} contractType contract type, value can be FUTURE or DELIVERY
     * @param {string} symbol symbol, e.g. 'BTC-USDT'
     * @param {string} wallet wallet identifier, e.g. 'W001'
     * @param {string} marginType margin type, value can be ISOLATED or CROSS
     * @returns {boolean} true if success, false if failed
     */
    async convertMarginType (contractType: string, symbol: string, wallet: string, marginType: string) {
        const request = {
            'contractType': contractType,
            'symbol': symbol,
            'wallet': wallet,
            'marginType': marginType,
        };
        const response = await this.privatePostV1SwapUserDataMarginType (request);
        return this.safeBool (response, 'success');
    }

    /**
     * @method
     * @name bydfi#convertPositionSideDual
     * @description convert position side dual
     * @param {string} contractType contract type, value can be FUTURE or DELIVERY
     * @param {string} wallet wallet identifier, e.g. 'W001'
     * @param {string} positionType position type, value can be HEDGE or ONEWAY
     * @returns {boolean} true if success, false if failed
     */
    async convertPositionSide (contractType: string, wallet: string, positionType: string) {
        const request = {
            'contractType': contractType,
            'wallet': wallet,
            'positionType': positionType,
        };
        const response = await this.privatePostV1SwapUserDataPositionSideDual (request);
        return this.safeBool (response, 'success');
    }

    handleErrors (code: int, reason: string, url: string, method: string, headers: Dict, body: string, response, requestHeaders, requestBody) {
        if (response === undefined) {
            return undefined;
        }
        const errorCode = this.safeInteger (response, 'code');
        if (errorCode !== 200) {
            const feedback = this.id + ' ' + body;
            const message = this.safeString2 (response, 'key', 'msg');
            this.throwBroadlyMatchedException (this.exceptions['broad'], message, feedback);
            const status = code.toString ();
            this.throwExactlyMatchedException (this.exceptions['exact'], status, feedback);
            throw new ExchangeError (feedback);
        }
        return undefined;
    }
}

