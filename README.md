# eodiro-next ![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/paywteam/eodiro-next?include_prereleases)

The futuristically next major version of **eodiro.com** using React and Next.

## Documentation

- [Design Guidelines](docs/wiki/Design-Guidelines.md)
- [UI Components](docs/wiki/UI-Components.md)
- [Changelog](docs/Changelog.md)
- [ToDo](docs/ToDo.md)

## Development

### Using dev API locally

You must clone and run [`eodiro-api2`](https://github.com/paywteam/eodiro-api2) on your local machine in dev mode.

```zsh
npm run dev
```

### Using server API (https://eodiro.com)

Also you can develop only the client application without cloning server repository `eodiro-api2`.

```zsh
npm run dev --useProdApi
```

> Recent client application in the master branch may not match to the API distributed on https://eodiro.com. To develop using the recent APIs, download and run API repository locally.

### Using dev API (localhost)

By default, `npm run dev` connects to local dev API server and `npm start` tries to connect to the real server(https://eodiro.com). However, sometimes you need to test the production-ready, built version of client application with the dev API. To achieve this, simply pass an argument similar to the one above

```zsh
npm start --useDevApi
```

> `--useProdApi` and `--useDevApi` are only for the purpose of tests. Do not use them in production. For more information about API hosts, checkout the [source code](https://github.com/paywteam/eodiro-next/blob/master/src/modules/api-host.ts).
