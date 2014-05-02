Page Demo
=========

Toby Ho's [Page demo][Page] ported to [React][].

## To Run

First `npm install` the dependencies, then:

    npm start

This will start a [Connect][] server (defaulting to `http://localhost:3000`)
to serve the main `index.html`, with [Watchify][] running in the background
to recompile the source.

## TODO

- Use `React.renderComponentToString` on the server for initial page rendering
- Minify for production using [Uglifyify][]

[Page]: http://smalljs.org/client-side-routing/page/
[React]: http://reactjs.com
[Connect]: http://www.senchalabs.org/connect/
[Watchify]: https://github.com/substack/watchify
[Uglifyify]: https://github.com/hughsk/uglifyify
