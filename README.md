# alm-template

This is a project template for quickly starting [Alm][alm] apps and the
associated project infrastructure.

Note: this template assumes that you'll be writing TypeScript files in `src`
and that at least one of them will be called `main.ts`.

# Setup

It is assumed that you have gulp installed.

After you have cloned this repository run the following in your command line:

    $> cp -r alm-template mynewapp
    $> cd mynewapp
    $> sh init.sh
    $> npm install # or `yarn`

When you run `sh init.sh` you'll be prompted for a few questions to start your
`package.json` file. `init.sh` and `package.json.sample` will be added to the
included `.gitignore` file for you as well so if you forget to delete them
no worries.

# Usage

The file `src/main.ts` is assumed to be the entrypoint of your application. The
Alm library is in `lib/`.

To build your application, run

    $> npm run build

Two files will be created: `js/main.js` and `js/main.min.js`. The `index.html`
file references `js/main.js` but you might elect to use the minified version in
production.

To clean up:

    $> npm run clean

## JSX support

The webpack configuration provided here uses Babel and the plugin
`babel-plugin-transform-jsx` to transpile JSX.

To use JSX in a file:

1. Ensure the extension is `.tsx`.
2. Include the following code at the top of the module:

```typescript
import * as Alm from 'alm';
const jsx = Alm.jsx;
```

This isn't the most elegant but for now it's what I've managed to make
work. Pull requests are welcome!

## Project layout

The project should be laid out as follows:

    /
    |
    - .gitignore
    |
    + css
    | |
    | - main.css
    | |
    | - reset.css
    |
    + lib
    | |
    | - alm.ts
    | |
    | + vdom.ts
    |
    + src
    | |
    | + actions
    | | |
    | | - index.ts
    | |
    | + components
    | | |
    | | - MainComponent.ts
    | | |
    | | - ...
    | |
    | + reducer
    | | |
    | | - index.ts
    | | |
    | | - ...
    | |
    | + store
    | | |
    | | - index.ts
    | | |
    | | - ...
    | |
    | + views
    | | |
    | | - MainView.ts
    | | |
    | | - ...
    | | |
    | | - main.ts
    | | |
    | | - ...
    |
    - index.html
    |
    - package.json
    |
    - tsconfig.json
    |
    - webpack.config.js
    |
    - yarn.lock

# TODO

- Integrate some way to manage CSS
- Make `init.sh` an npm command.

# Questions / Comments

Feel free to use the GitHub Issues feature or contact me at <gatlin@niltag.net>.

[alm]: http://niltag.net/Alm
