let stockDataInterval;

async function loadStockData(stockSymbol) {
    document.querySelector('.stock-symbol').textContent = stockSymbol;

    try {
        const response = await fetch(`/stock/${stockSymbol}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Data fetched:', data);

        const chartData = data.chart.result[0];
        const metaData = chartData.meta;

        const timestamps = chartData.timestamp.map(ts => new Date(ts * 1000));
        const prices = chartData.indicators.quote[0].close;

        // Update detailed stock info
        const currentPrice = prices[prices.length - 1];
        const previousClose = metaData.previousClose;
        const priceChange = currentPrice - previousClose;
        const priceChangePercent = (priceChange / previousClose) * 100;

        const currentPriceElements = Array.from(document.getElementsByClassName('current-price'));
        const volumeElements = Array.from(document.getElementsByClassName('volume'));
        const priceChangeElements = Array.from(document.getElementsByClassName('price-change'));
        const priceChangePercentElements = Array.from(document.getElementsByClassName('price-change-percent'));
        const high24hElements = Array.from(document.getElementsByClassName('high-24h'));
        const low24hElements = Array.from(document.getElementsByClassName('low-24h'));
        const previousCloseElements = Array.from(document.getElementsByClassName('previous-close'));

        currentPriceElements.forEach((ele) => {
            ele.textContent = `${currentPrice.toFixed(2)} ${metaData.currency}`;
        });
        
        volumeElements.forEach((ele) => {
            ele.textContent = metaData.regularMarketVolume ? metaData.regularMarketVolume.toLocaleString() : 'N/A';
        });
        
        priceChangeElements.forEach((ele) => {
            ele.textContent = `${priceChange.toFixed(2)} ${metaData.currency}`;
        });
        
        priceChangePercentElements.forEach((ele) => {
            ele.textContent = `${priceChangePercent.toFixed(2)}%`;
        });
        
        high24hElements.forEach((ele) => {
            ele.textContent = `${metaData.regularMarketDayHigh ? metaData.regularMarketDayHigh.toFixed(2): 'N/A'} ${metaData.currency}`;
        });
        
        low24hElements.forEach((ele) => {
            ele.textContent = `${metaData.regularMarketDayLow ? metaData.regularMarketDayLow.toFixed(2) : 'N/A'} ${metaData.currency}`;
        });
         
        previousCloseElements.forEach((ele) => {
            ele.textContent =`${metaData.previousClose ? metaData.previousClose.toFixed(2) : 'N/A'} ${metaData.currency}`;
        });

        // Create Plotly chart
        const trace = {
            x: timestamps,
            y: prices,
            mode: 'lines',
            type: 'scatter',
        };

        const layout = {
            xaxis: {
                title: 'Date'
            },
            yaxis: {
                title: 'Price'
            }
        };
        const config = {
            modeBarButtonsToRemove: [
                'toImage', 'zoomIn2d', 'zoomOut2d', 'resetScale2d',
                'hoverClosestCartesian', 'hoverCompareCartesian', 'pan2d'
            ],
            displaylogo: false
        };
        Plotly.newPlot('stock-chart', [trace], layout,config);
    } catch (error) {
        console.error('Error fetching data:', error);
        document.querySelector('.stock-details').textContent = 'Error fetching stock data. Please try again later.';
    }
}

function initiateStockDataLoading() {
    const urlParams = new URLSearchParams(window.location.search);
    const stockSymbol = urlParams.get('symbol');

    if (!stockSymbol) {
        alert('No stock symbol provided.');
        return;
    }

    if (stockDataInterval) {
        clearInterval(stockDataInterval);
    }
    loadStockData(stockSymbol); // Fetch the data immediately
    stockDataInterval = setInterval(() => loadStockData(stockSymbol), 30000); // Refresh every 30 seconds
}

// Start fetching data when the page loads
document.addEventListener('DOMContentLoaded', initiateStockDataLoading);
