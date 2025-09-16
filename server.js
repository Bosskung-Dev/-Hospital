const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// ให้ Express ใช้ public folder
app.use(express.static('public'));

app.listen(port, () => console.log(`Server listening on port ${port}`));
