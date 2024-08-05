import { Interval, WebsocketAPI } from '@binance/connector-typescript';

const API_KEY = process.env.BINANCE_API_KEY || '';
const API_SECRET = process.env.BINANCE_API_SECRET || '';

// const callbacks = {
//     open: (client: WebsocketAPI) => client.exchangeInfo(),
//     close: () => console.debug('Disconnected from WebSocket server'),
//     message: (data: string) => console.info(JSON.parse(data)),
// }
// const websocketAPIClient = new WebsocketAPI(API_KEY, API_SECRET, { callbacks });
// setTimeout(() => websocketAPIClient.disconnect(), 20000);
import { WebsocketStream } from '@binance/connector-typescript';

const callbacks = {
  open: () => console.debug('Connected to WebSocket server'),
  close: () => console.debug('Disconnected from WebSocket server'),
  message: (data: string) => console.info(data)
}

const websocketStreamClient = new WebsocketStream({ callbacks });
// websocketStreamClient.aggTrade('bnbusdt');
websocketStreamClient.kline('bnbusdt', Interval['1m']);
// setTimeout(() => websocketStreamClient.disconnect(), 6000);

export default websocketStreamClient;