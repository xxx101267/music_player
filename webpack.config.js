module.exports = {
    entry: {
        index: './src/js/musicPlayer.js' //ѡȡ����ļ�
    },
    output: {
        filename: '[name].js' //������ļ�����nameΪindex
    },

    //����es6Ϊes5
    module: {
        loaders: [
            {
                test: /\.js$/, //ƥ����Ҫ������ļ� �����к�׺Ϊ.js���ļ���
                exclude: /(node_modules|bower_components)/,
                loader: "babel",
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};
