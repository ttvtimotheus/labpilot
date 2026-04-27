module.exports = function (api) {
  const isTest = api.env('test');

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      !isTest && 'nativewind/babel',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './',
          },
          extensions: ['.ios.ts', '.android.ts', '.ts', '.ios.tsx', '.android.tsx', '.tsx', '.jsx', '.js', '.json'],
        },
      ],
      !isTest && 'react-native-reanimated/plugin',
    ].filter(Boolean),
  };
};
