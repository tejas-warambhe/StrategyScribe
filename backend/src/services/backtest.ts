import fs from 'fs';
interface Candle {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }
  
  interface Trade {
    type: 'buy' | 'sell';
    price: number;
    amount: number;
  }
  
  interface BacktestResult {
    totalProfitLoss: number;
    numTrades: number;
    winRate: number;
  }
  
  class BacktestFramework {
    private data: Candle[];
    private trades: Trade[];
  
    constructor(data: string) {
      this.data = this.preprocessData(data);
      this.trades = [];
    }
  
    private preprocessData(data: string): Candle[] {
      return data.trim().split('\n').map(row => {
        const [timestamp, open, high, low, close, volume] = row.split(',');
        return {
          timestamp: parseInt(timestamp),
          open: parseFloat(open),
          high: parseFloat(high),
          low: parseFloat(low),
          close: parseFloat(close),
          volume: parseFloat(volume)
        };
      });
    }
  
    public backtestStrategy(strategyFunc: (candles: Candle[], index: number) => void): BacktestResult {
      this.trades = [];
      for (let i = 0; i < this.data.length; i++) {
        strategyFunc(this.data, i);
      }
      return this.calculatePerformance();
    }
  
    public buy(index: number, amount: number = 1): void {
      const price = this.data[index].open;
      this.trades.push({ type: 'buy', price, amount });
    }
  
    public sell(index: number, amount: number = 1): void {
      const price = this.data[index].close;
      this.trades.push({ type: 'sell', price, amount });
    }
  
    private calculatePerformance(): BacktestResult {
      let totalProfitLoss = 0;
      let winningTrades = 0;
  
      for (let i = 0; i < this.trades.length; i += 2) {
        if (i + 1 < this.trades.length) {
          const buyTrade = this.trades[i];
          const sellTrade = this.trades[i + 1];
          const profitLoss = (sellTrade.price - buyTrade.price) * buyTrade.amount;
          totalProfitLoss += profitLoss;
          if (profitLoss > 0) {
            winningTrades++;
          }
        }
      }
  
      const numTrades = this.trades.length / 2;
      const winRate = numTrades > 0 ? (winningTrades / numTrades) * 100 : 0;
  
      return {
        totalProfitLoss,
        numTrades,
        winRate
      };
    }
  }
  
  const strategies = {
    fourRedCandles: (candles: Candle[], index: number) => {
      if (index < 4) return;
  
      const last4Candles = candles.slice(index - 4, index);
      const allRed = last4Candles.every(candle => candle.close < candle.open);
  
      if (allRed) {
        backtest.buy(index);
        backtest.sell(index);
      }
    },
    smaCrossover: (candles: Candle[], index: number) => {
        if (index < 20) return;
    
        const shortSMA = candles.slice(index - 10, index).reduce((sum, candle) => sum + candle.close, 0) / 10;
        const longSMA = candles.slice(index - 20, index).reduce((sum, candle) => sum + candle.close, 0) / 20;
    
        if (shortSMA > longSMA && candles[index - 1].close <= longSMA) {
        if(backtest.buy)
          backtest.buy(index);
          console.log('I was here to buy');
        } else if (shortSMA < longSMA && candles[index - 1].close >= longSMA) {
            backtest.sell(index);
            console.log('I was here to sell');
        }
      }
  };
  
  let backtest: BacktestFramework;
  
  export function testFlow(strategyName: string) {
    // import from data.csv
    const data = fs.readFileSync('./src/binanceData/BTCUSDT-1m-2024-07-02.csv', 'utf-8');
    backtest = new BacktestFramework(data);
    const strategy = strategies[strategyName as keyof typeof strategies];
  
    if (!strategy) {
      throw new Error('Invalid strategy name');
    }
  
    const result = backtest.backtestStrategy(strategy);
    console.log(result);
  }

//   testFlow('fourRedCandles');
  testFlow('smaCrossover');