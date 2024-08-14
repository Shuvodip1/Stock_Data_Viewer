let fetchInterval;

async function fetchStockData() {
    const symbol = document.getElementById('symbol').value;
    if (!symbol) {
        alert('Please enter a stock symbol.');
        return;
    }
    try {
        const response = await fetch(`/stock/${symbol}-USD`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Data fetched:', data);

        const chartData = data.chart.result[0];
        const metaData = chartData.meta;

        // Extract data for the chart
        const timestamps = chartData.timestamp.map(ts => new Date(ts * 1000));
        const prices = chartData.indicators.quote[0].close;

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
        Plotly.newPlot('stockChart', [trace], layout, config);

        // Calculate price change and percentage change
        const currentPrice = prices[prices.length - 1];
        const previousClose = metaData.previousClose;
        const priceChange = currentPrice - previousClose;
        const priceChangePercent = (priceChange / previousClose) * 100;
        // const marketCapData = data.timeseries.result[0].trailingMarketCap[0].reportedValue.fmt;

        const stockName = metaData.symbol;

        // Update elements
        const currentPriceElements = Array.from(document.getElementsByClassName('currentPrice'));
        // const marketCapElements = Array.from(document.getElementsByClassName('marketCap'));
        const volumeElements = Array.from(document.getElementsByClassName('volume'));
        const priceChangeElements = Array.from(document.getElementsByClassName('priceChange'));
        const priceChangePercentElements = Array.from(document.getElementsByClassName('priceChangePercent'));
        const high24hElements = Array.from(document.getElementsByClassName('high24h'));
        const low24hElements = Array.from(document.getElementsByClassName('low24h'));
        const stockNameElements = Array.from(document.getElementsByClassName('stockName'));

        currentPriceElements.forEach((ele) => {
            ele.textContent = `$${currentPrice.toFixed(2)}`;
        });

        /* marketCapElements.forEach((ele) => {
            ele.textContent = `${marketCapData ? marketCapData : 'N/A'}`;
        }); */

        volumeElements.forEach((ele) => {
            ele.textContent = `${metaData.regularMarketVolume ? metaData.regularMarketVolume.toLocaleString() : 'N/A'}`;
        });

        priceChangeElements.forEach((ele) => {
            ele.textContent = `${priceChange.toFixed(2)}`;
        });

        priceChangePercentElements.forEach((ele) => {
            ele.textContent = `${priceChangePercent.toFixed(2)}%`;
        });

        high24hElements.forEach((ele) => {
            ele.textContent = `$${metaData.regularMarketDayHigh ? metaData.regularMarketDayHigh.toFixed(2) : 'N/A'}`;
        });

        low24hElements.forEach((ele) => {
            ele.textContent = `$${metaData.regularMarketDayLow ? metaData.regularMarketDayLow.toFixed(2) : 'N/A'}`;
        });

        stockNameElements.forEach((ele) => {
            ele.textContent = stockName;  // Use the modified stockName without .NS
        });
        console.log(low24);
        console.log(stockName);


        const smallElement = document.querySelector('small.priceChangePercent');
        const iconElement = document.querySelector('i.priceChangePercent');
      
        // Check the value of priceChangePercent and update classes and icon
        if (priceChangePercent < 0) {
          smallElement.classList.remove('text-success');
          smallElement.classList.add('text-danger');
          iconElement.classList.remove('fa-caret-up', 'text-success');
          iconElement.classList.add('fa-caret-down', 'text-danger');
        } else {
          smallElement.classList.remove('text-danger');
          smallElement.classList.add('text-success');
          iconElement.classList.remove('fa-caret-down', 'text-danger');
          iconElement.classList.add('fa-caret-up', 'text-success');
        }
    



    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

document.getElementById('symbol').addEventListener('input', function() {
    this.value = this.value.toUpperCase();
});

function startFetching() {
    if (fetchInterval) {
        clearInterval(fetchInterval);
    }
    fetchStockData(); // Fetch the data immediately
    fetchInterval = setInterval(fetchStockData, 30000); // Refresh every 30 seconds
}

// Optionally, trigger an initial call when the page loads
// window.onload = startFetching;
