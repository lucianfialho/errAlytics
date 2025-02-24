const path = require('path');

module.exports = {
  entry: './src/main.js', // ponto de entrada da sua lib
  output: {
    filename: 'err-alytics.min.js', // nome do bundle gerado
    path: path.resolve(__dirname, 'dist'),
    library: 'ErrAlytics', // Nome global no window
    libraryTarget: 'window', // Expor diretamente no objeto global
  },
  mode: 'production',
};
