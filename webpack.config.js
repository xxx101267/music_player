module.exports = {
    entry: {
        index: './src/js/musicPlayer.js' //选取入口文件
    },
    output: {
        filename: '[name].js' //输出的文件名称name为index
    },

    //编译es6为es5
    module: {
        loaders: [
            {
                test: /\.js$/, //匹配需要编译的文件 （所有后缀为.js的文件）
                exclude: /(node_modules|bower_components)/,
                loader: "babel",
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};
