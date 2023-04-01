/* jshint strict: global, node: true */
"use strict";

const { src, dest, lastRun, series, parallel, watch } = require("gulp");
let gulpEsbuild = require("gulp-esbuild");
const pug = require("gulp-pug");
const sourcemaps = require("gulp-sourcemaps");
const gulpif = require("gulp-if");
const changed = require("gulp-changed");
const touch = require("gulp-touch-fd");
const minifyCss = require("gulp-clean-css");
const progeny = require("gulp-progeny");
const filter = require("gulp-filter");
const stylus = require("gulp-stylus");
const postcss = require("gulp-postcss");
const path = require("path");
const autoprefixer = require("autoprefixer");
// TODO: migrate to es6 module system
// TODO: make the imagemin task to be a fully lossless
// TODO: add the "test" npm script (eslint, html-validator, [csslint])

const argv = require("yargs")
  .option("env", {
    alias: "e",
    type: "string",
    description: "target environment",
    choices: ["dev", "prod"],
    default: "dev",
  })
  .option("output", {
    alias: "o",
    type: "string",
    description: "build folder",
    default: "",
  }).argv;

const distDir = path.join(argv.output, "dist");

const CONFIG = {
  templatesSrc: "src/templates/**/*.pug",
  templatesDist: distDir,
  assetsSrc: "src/assets/**/*.*",
  assetsDist: distDir,
  scriptsSrc: "src/scripts/*.js",
  scriptsDist: path.join(distDir, "js"),
  scriptsToWatch: "src/scripts/**/*.js",
  stylesSrc: "src/styles/**/*.styl",
  stylesMainFilesFilter: ["**/*.styl", "!**/includes/**/*.styl"],
  stylesDist: path.join(distDir, "css"),
  stylesToWatch: "src/styles",
  iconfontsToBuild: `src/iconfont/icons/*.svg`,
  iconfontDirPath: `src/iconfont`,
  iconfontsToWatch: "src/iconfont",
  env: argv.env,
};

Object.freeze(CONFIG);

const IS_DEV_MODE = CONFIG.env === "dev";
const IS_PROD_MODE = CONFIG.env === "prod";

function setEsBuildToIncrementalMode(done) {
  gulpEsbuild = gulpEsbuild.createGulpEsbuild({ incremental: true });
  done();
}

function scripts() {
  return src(CONFIG.scriptsSrc)
    .pipe(
      gulpEsbuild({
        sourcemap: IS_DEV_MODE ? "inline" : false,
        define: { __DEBUG__: IS_DEV_MODE },
        minifyWhitespace: true,
        minifyIdentifiers: IS_PROD_MODE,
        minifySyntax: IS_PROD_MODE,
        target: ["es2019"],
        bundle: true,
        legalComments: "none",
        banner: {
          js: '"use strict";',
        },
      })
    )
    .pipe(changed(CONFIG.scriptsDist, { hasChanged: changed.compareContents }))
    .pipe(dest(CONFIG.scriptsDist));
}

function templates() {
  return src(["src/templates/**/*.pug"], {
    since: lastRun(templates),
  })
    .pipe(progeny())
    .pipe(
      filter([
        "src/templates/**/*.pug",
        "!src/templates/layouts/*.pug",
        "!src/templates/includes/**/*.pug",
      ])
    )
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(changed(CONFIG.templatesDist, { hasChanged: changed.compareContents }))
    .pipe(dest(CONFIG.templatesDist))
    .pipe(gulpif(IS_PROD_MODE, touch()));
}

function styles() {
  return src(CONFIG.stylesSrc, { since: lastRun(styles) })
    .pipe(progeny())
    .pipe(filter(CONFIG.stylesMainFilesFilter))
    .pipe(gulpif(IS_DEV_MODE, sourcemaps.init()))
    .pipe(
      stylus({
        compress: true,
        "include css": true,
      })
    )
    .pipe(postcss([autoprefixer()]))
    .pipe(gulpif(IS_DEV_MODE, sourcemaps.write()))
    .pipe(
      gulpif(
        IS_PROD_MODE,
        minifyCss({
          level: {
            1: {
              all: true,
              specialComments: false,
            },
            2: {
              all: true,
            },
          },
        })
      )
    )
    .pipe(changed(CONFIG.stylesDist, { hasChanged: changed.compareContents }))
    .pipe(dest(CONFIG.stylesDist))
    .pipe(gulpif(IS_PROD_MODE, touch()));
}

function assets() {
  return src(CONFIG.assetsSrc, { since: lastRun(assets) })
    .pipe(changed(CONFIG.assetsDist, { hasChanged: changed.compareContents }))
    .pipe(dest(distDir))
    .pipe(gulpif(IS_PROD_MODE, touch()));
}

function validateHtml() {
  const validator = require("gulp-html");
  return src(`${CONFIG.templatesDist}/*.html`).pipe(validator());
}

let browserSync;

function livereload(done) {
  browserSync.reload();
  done();
}

function serve() {
  browserSync = require("browser-sync").create();
  browserSync.init({
    open: false,
    ghostMode: false,
    online: false,
    ui: false,
    logSnippet: false,
    reloadDebounce: 100,
    server: {
      baseDir: distDir,
      serveStaticOptions: {
        etag: false,
        cacheControl: false,
      },
    },
    middleware: function (req, res, next) {
      res.setHeader("Cache-Control", "no-store, must-revalidate");
      next();
    },
  });
}

function watchForChanges() {
  browserSync.watch(`${distDir}/**/*.css`).on("change", browserSync.reload);
  watch("./src/templates", series(templates, livereload));
  watch([CONFIG.stylesSrc], styles);
  watch(CONFIG.scriptsToWatch, series(scripts, livereload));
  watch(CONFIG.assetsSrc, series(assets, livereload));
}

function imagemin() {
  const imagemin = require("gulp-imagemin");
  return src(CONFIG.assetsSrc).pipe(imagemin()).pipe(dest("src/assets"));
}

function prettifyScripts() {
  const prettier = require("gulp-prettier");
  const scriptsSourceRootFolder = CONFIG.scriptsSrc.split("scripts")[0] + "scripts";

  return src(scriptsSourceRootFolder + "/**/*.js")
    .pipe(prettier())
    .pipe(changed(scriptsSourceRootFolder, { hasChanged: changed.compareContents }))
    .pipe(dest(scriptsSourceRootFolder))
    .pipe(touch());
}

function prettifyTemplates() {
  const prettier = require("gulp-prettier");
  const templatesRootFolder = CONFIG.templatesSrc.split("templates")[0] + "templates";

  return src(CONFIG.templatesSrc)
    .pipe(prettier())
    .pipe(changed(templatesRootFolder, { hasChanged: changed.compareContents }))
    .pipe(dest(templatesRootFolder))
    .pipe(touch());
}

function prettifyStyles() {
  const run = require("gulp-run-command").default;
  const stylesRootFolder = CONFIG.stylesSrc.split("styles")[0] + "styles";
  let command = `npx stylus-supremacy format ${stylesRootFolder}/**/*.styl --replace --options package.json`;
  return run(command, { quiet: true })();
}

exports.build = parallel(templates, styles, scripts, assets);
exports.dev = series(setEsBuildToIncrementalMode, exports.build, parallel(serve, watchForChanges));
exports.validate = series(templates, validateHtml);
exports.imagemin = imagemin;
exports.format = parallel(prettifyScripts, prettifyTemplates, prettifyStyles);
