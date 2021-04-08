const Strapi = require("strapi");
const http = require("http");

let instance;

async function setupStrapi() {
  if (!instance) {
    await Strapi().load();
    instance = strapi;
    await instance.app
      .use(instance.router.routes())
      .use(instance.router.allowedMethods());

    instance.server = http.createServer(instance.app.callback());
  }
  return instance;
}
module.exports = { setupStrapi };
