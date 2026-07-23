The .woff2 files that fonts.css references are downloaded by:

    npm run fonts:vendor

Until you run that, the @font-face rules here don't resolve and the site falls
back to system fonts (San Francisco / Segoe UI / Roboto for body, Georgia for
headings). That looks clean on its own — the site is never broken without the
webfonts. Running fonts:vendor is a polish step, not a requirement.
