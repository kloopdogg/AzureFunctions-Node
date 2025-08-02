# AzureFunctions-Node
Sample Azure Functions project with Node and TypeScript

## Project Structure
The recommended folder structure for a TypeScript project looks like the following example:
```text
<project_root>/
 | - .vscode/
 | - dist/
 | - node_modules/
 | - src/
 | | - functions/
 | | | - myFirstFunction.ts
 | | | - mySecondFunction.ts
 | - test/
 | | - functions/
 | | | - myFirstFunction.test.ts
 | | | - mySecondFunction.test.ts
 | - .funcignore
 | - host.json
 | - local.settings.json
 | - package.json
 | - tsconfig.json
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
