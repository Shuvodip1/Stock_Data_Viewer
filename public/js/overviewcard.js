let refreshInterval;

async function fetchStockDataFromServer() {
    // Get all the stock symbols from elements with class 'symbol'
    const symbolElements = document.querySelectorAll('.stock-box .symbol');
    const priceElements = document.querySelectorAll('.stock-box .price');

    const symbols = Array.from(symbolElements).map(element => element.getAttribute('data-symbol'));

    try {
        // Fetch data for all symbols
        const responses = await Promise.all(symbols.map(symbol => fetch(`/stock/${symbol}`)));
        const dataPromises = responses.map(response => response.json());
        const stockDataArray = await Promise.all(dataPromises);

        // Update price elements with fetched data
        stockDataArray.forEach((data, index) => {
            if (data.chart && data.chart.result && data.chart.result.length > 0) {
                const result = data.chart.result[0];
                const price = result.meta.regularMarketPrice;
                priceElements[index].textContent = `${price} ${result.meta.currency}`;
            } else {
                priceElements[index].textContent = 'Data not available';
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        priceElements.forEach(priceElement => {
            priceElement.textContent = 'Error fetching data';
        });
    }
}

function initiateDataFetch() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
    fetchStockDataFromServer(); // Fetch the data immediately
    refreshInterval = setInterval(fetchStockDataFromServer, 30000); // Refresh every 30 seconds
}

// Start fetching data when the page loads
document.addEventListener('DOMContentLoaded', initiateDataFetch);
