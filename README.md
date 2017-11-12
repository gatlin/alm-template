# alm-template

This is a project template for quickly starting [Alm][alm] apps and the
associated project infrastructure.

Note: this template assumes that you'll be writing TypeScript files in `src`
and that at least one of them will be called `app.ts`.

# Usage

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
