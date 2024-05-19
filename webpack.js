var webpack = require('webpack');
webpack({
    mode: "development",
    entry: './index.js',
    output: {
        filename: 'hjhapi.js',
        path: __dirname
    },
    target: 'node' // 这是最关键的
}, (err, stats) => {
    if (err) {
        console.log('err:', err)
    }
})