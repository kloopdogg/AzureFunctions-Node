# AzureFunctions-Node
Sample Azure Functions project with Node and TypeScript

## Project Structure
The recommended folder structure for a TypeScript Azure Functions application looks like the following example:
```text
<project_root>/
├── .vscode/
├── docs/
├── src/
│   ├── functions/
│   │   ├── myFirstFunction.ts
│   │   └── mySecondFunction.ts
│   ├── models/
│   │   └── model1.ts
│   ├── utils/
│   │   └── util1.ts
│   └── index.ts
├── test/
│   ├── fakes/
│   │   └── fake11.ts
│   ├── functions/
│   │   ├── myFirstFunction.test.ts
│   │   └── mySecondFunction.test.ts
│   ├── mocks/
│   │   └── mock1.ts
│   └── rest/
│       ├── myFirstFunction.http
│       └── mySecondFunction.http
├── .funcignore
├── host.json
├── jest.config.js
├── local.settings.json
├── package.json
└── tsconfig.json
```

## Running the Project

To run the project locally, follow these steps:

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the project:
   ```bash
   npm start
   ```

This will build and run the Azure Functions project using Node.js and TypeScript.

**⚠️Note:** Do not use `func start` directly, as it will not clean and build the project to the `dist` folder. Always use `npm start` to ensure the project is properly built before running.

## Running Tests

The project uses Jest for unit testing. You can run tests in several ways:

1. Run all tests:
   ```bash
   npm test
   ```

2. Run tests in watch mode (tests re-run when files change):
   ```bash
   npm test -- --watch
   ```

3. Run tests with coverage report:
   ```bash
   npm test -- --coverage
   ```

The double dash (`--`) is used to separate npm's own command line arguments from those that should be passed to the underlying script. Without it, npm would try to interpret `--watch` or `--coverage` as arguments for npm itself rather than passing them to Jest.

### VS Code Integration

For a better testing experience in VS Code, install these recommended extensions:
- Jest Runner (firsttris.vscode-jest-runner)
- Jest (Orta.vscode-jest)

These extensions provide:
- In-editor test running and debugging
- Test Explorer integration
- Real-time test results
- Coverage highlighting
