const express = require('express');
const app = express();

const port = 3010;

app.use(express.static('./'))

app.listen(port, ()=> {
	console.log(`The app is running on port ${port} `);
});
