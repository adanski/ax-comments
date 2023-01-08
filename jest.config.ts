import {JestConfigWithTsJest} from 'ts-jest';

/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
const jestConfig: JestConfigWithTsJest = {
    // The directory where Jest should store its cached dependency information
    cacheDirectory: './dist/test/jest',
    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,
    // The directory where Jest should output its coverage files
    coverageDirectory: './dist/test/coverage',
    // An array of regexp pattern strings used to skip coverage collection
    coveragePathIgnorePatterns: [
        '\\.idea\\',
        '\\dist\\',
        '\\node_modules\\',
        '\\test\\',
    ],
    // Indicates which provider should be used to instrument code for coverage
    coverageProvider: 'v8',
    // An object that configures minimum threshold enforcement for coverage results
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80
        },
    },
    // The default configuration for fake timers
    fakeTimers: {
        enableGlobally: true
    },
    // A preset that is used as a base for Jest's configuration
    preset: 'ts-jest/presets/js-with-ts-esm-legacy',
    // A list of paths to modules that run some code to configure or set up the testing framework before each test
    setupFilesAfterEnv: ['./test/fake/polyfill-fake.js'],
    // The test environment that will be used for testing
    testEnvironment: 'jsdom',
    // A map from regular expressions to paths to transformers
    transform: {
        '^.+\\.[tj]sx?$': [
            'ts-jest',
            {
                useESM: true,
                tsconfig: './test/tsconfig.json'
            },
        ],
    },
    // A list of additional extensions to treat as native ESM (besides .js)
    extensionsToTreatAsEsm: ['.ts'],
    // A map from regular expressions to module names or to arrays of module names that allow to stub out resources, like images or styles with a single module.
    moduleNameMapper: {
        '^(\\.{1,2}/.+)\\.js$': '$1',
    },
};

export default jestConfig;
