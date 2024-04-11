const dotenv = require('dotenv');
dotenv.config()


module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
  },
  test: {
    // 테스트 환경 설정
    username: 'root',
    password: '1234',
    database: 'ezteam2',
    host: '127.0.0.1',
  },
  production: {
    // 프로덕션 환경 설정
    username: 'root',
    password: '1234',
    database: 'ezteam2',
    host: '127.0.0.1',
  }
};