const express = require('express');
const axios = require('axios');
const app = express();
const port = 8000;

// Serve static files from the "public" directory
app.use(express.static('public'));

// Endpoint to fetch stock data
app.get('/stock/:symbol', async (req, res) => {
    const symbol = req.params.symbol;

    // Calculate timestamps
    const currentDate = new Date();
    const pastDateTimeStamp = new Date(currentDate.getTime() - (7 * 24 * 60 * 60 * 1000 - 5.5 * 60 * 60 * 1000)).getTime();
    const period2 = Math.floor(currentDate.setHours(5, 30, 0) / 1000);
    const period1 = Math.floor(pastDateTimeStamp / 1000);

    // Construct URLs
    const url = `Your API end point`;
    const urlMarketCap = `Your API end point ?merge=false&padTimeSeries=true&period1=${period1}&period2=${period2}&type=quarterlyMarketCap%2CtrailingMarketCap`;

    try {
        const [response, responseMarketCap] = await Promise.all([
            axios.get(url),
            axios.get(urlMarketCap)
        ]);

        // Attach timeseries data to the response
        response.data.timeseries = responseMarketCap.data.timeseries;
        
        // Send response
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).send('Error fetching stock data');
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
