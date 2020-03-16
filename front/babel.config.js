module.exports = function (api) {
  api.cache(true);

  const presets = [
    'react-app',
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ];

  return {
    presets,
  };
};
