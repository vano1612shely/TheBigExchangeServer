export default () => ({
  port: parseInt(process.env.PORT, 10) || 5000,
  jwtSecret: process.env.JWTSECRET,
  exchangeApi: process.env.EXCHANGEAPI,
});
