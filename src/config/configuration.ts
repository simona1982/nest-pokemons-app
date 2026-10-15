export default () => ({
    enviroment: process.env.NODE_ENV || 'dev',
    mongoDb: process.env.MONGO_DB,
    port: parseInt(process.env.PORT ?? '', 10) || 3002,
    defaultLimit: process.env.DEFAULT_LIMIT || 7,
});