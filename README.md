# Static site builder and development server

## How to setup development environment (tested on Debian 10)

```sh
npm i

# run the development server
npm run dev

# run the development server in production mode
npm run dev -- --env=prod


# make a development build
npm run build

# make a production ready build
npm run build -- --env=prod


# build to specific folder
npm run build -- --output /dev/shm

# prettify source files
npm run format


# validates html files with W3C Validator (requires java)
npm run validate


# optimize and overwrite images in /assets/ folder
npm run imagemin
```
