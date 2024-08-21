require('dotenv').config();
const app = require('./server');
const { host, port } = require('./config/serverConfig');

app.listen(port, () => {
  console.log(`Server is running on ${host}:${port}`);
});
