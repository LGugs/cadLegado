const dotenv = require('dotenv'); // faz com que leia o arquivo .env

dotenv.config();

module.exports = {
    hrPool: {
        user: process.env.HR_USER,
        password: process.env.HR_PASSWORD,
        connectString: process.env.HR_CONNECTIONSTRING,
        poolMin: 10,
        poolMax: 10,
        poolIncrement: 0
    }
};