if (process.env.REACT_APP_VERSION === undefined) {
  const now = new Date();
  process.env.REACT_APP_VERSION = `${now.getUTCFullYear() - 2000}.${
    now.getUTCMonth() + 1
  }.${now.getUTCDate()}-${now.getUTCHours() * 60 + now.getUTCMinutes()}`;
}

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  directories: {
    output: "dist",
    buildResources: "buildResources",
  },
  files: ["packages/**/dist/**"],
  extraMetadata: {
    version: process.env.REACT_APP_VERSION,
  },
  target: "AppImage",
  win: {
    target: [
      {
        target: "nsis",
        arch: ["x64", "ia32"],
      },
    ],
  },
  linux: {
    category: "Utility",
    target: "deb",
  },
};

module.exports = config;
