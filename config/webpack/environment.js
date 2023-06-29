const path = require('path');
const { environment } = require('@rails/webpacker')

const customConfig = {
    resolve: {
        alias: {
            '@src': path.resolve(__dirname, '..', '..', 'app/javascript/src'),
        }
    }
}

environment.config.merge(customConfig);

module.exports = environment;
