const path = require('path');

module.exports = {
  entry: './src/main.js', // ponto de entrada da sua lib
  output: {
    filename: 'err-alytics.umd.js', // nome do bundle gerado
    path: path.resolve(__dirname, 'dist'),
    library: 'HttpErrorTracker', // nome da variável global quando usado via CDN
    libraryTarget: 'umd', // formato UMD para compatibilidade universal
    globalObject: 'this' // necessário para ambientes que não possuem window
  },
  mode: 'production',
};
