const fs = require("fs");
const { setupStrapi } = require("./helpers/strapi");

jest.setTimeout(30000);

beforeAll(async (done) => {
  await setupStrapi();
  done();
});

afterAll(async (done) => {
  const dbSettings = strapi.config.get("database.connections.default.settings");

  if (dbSettings && dbSettings.filename) {
    const tmpDbFile = `${__dirname}/../${dbSettings.filename}`;
    if (fs.existsSync(tmpDbFile)) {
      fs.unlinkSync(tmpDbFile);
    }
  }
  done();
});

it("strapi is defined", () => {
  expect(strapi).toBeDefined();
});

require("./folders/foldertree");
