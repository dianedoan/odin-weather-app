# Template Repository

## Project Configuration Instructions
1. Create a `package.json` file by running the following command in the terminal:

    `npm init -y --init-type=module`

2. Run the following commands in the terminal to install webpack related plugins:

    `npm install --save-dev webpack webpack-cli`

    `npm install --save-dev html-webpack-plugin`

    `npm install --save-dev style-loader css-loader`

    `npm install --save-dev html-loader`

    `npm install --save-dev webpack-dev-server`

    `npm install --save-dev webpack-merge`

3. Replace the current `"scripts"` property in `package.json` with: 
    ```json
    "scripts": {
      "start": "webpack serve --open --config webpack.dev.js",
      "build": "webpack --config webpack.prod.js",
      "deploy": "git subtree push --prefix dist origin gh-pages"
    }
    ```

4. In the terminal, use `npm run start` to start the project.

5. To deploy the project:
    
    1. Create a new branch called `gh-pages` using `git branch gh-pages`.
    2. Switch to the new branch `gh-pages` using `git checkout gh-pages` and merge `main` into the current branch `gh-pages` using `git merge main --no-edit`.
    3. Bundle the app using `npm run build`.
    4. Run `git add dist -f` and `git commit -m "Deployment commit`.
    5. Deploy the project using `npm run deploy`.
    6. Switch back to the `main` branch using `git checkout main`.
