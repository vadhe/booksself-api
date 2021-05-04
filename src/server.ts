const Hapi = require("@hapi/hapi");
const routess = require("./routes");
const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: "localhost",
  });
  server.route(routess);
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

module.exports = init;
