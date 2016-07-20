import 'babel-core/register'
import 'babel-polyfill'

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./root.prod.js');
} else {
    module.exports = require('./root.dev.js');
}