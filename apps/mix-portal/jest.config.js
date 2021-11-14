module.exports = {
  displayName: 'mix-portal',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^(.+\\.svelte$)': [
      'svelte-jester',
      {
        preprocess: 'apps/mix-portal/jest.config.js/svelte.config.js',
      },
    ],
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['svelte', 'ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/mix-portal',
};
