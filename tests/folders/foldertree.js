//TODO / IN PROGRESS

const request = require("supertest");

const jwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjE1OTgxODU5LCJleHAiOjE2MTg1NzM4NTl9.06YN9zo3e5sg9zmuuRj-UvmoabMHLClcK1jpb6iKlH4";

// const mockUserData = {
//   username: "tester",
//   email: "tester@strapi.com",
//   provider: "local",
//   password: "1234abc",
//   confirmed: true,
//   blocked: null,
// };

// const getJwt = async () => {
//   const defaultRole = await strapi
//     .query("role", "users-permissions")
//     .findOne({ id: 1 }, []);

//   const role = defaultRole ? defaultRole.id : null;
//   /** Creates a new user an push to database */
//   const user = await strapi.plugins["users-permissions"].services.user.add({
//     ...mockUserData,
//     role,
//   });

//   const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
//     id: user.id,
//   });
//   return jwt;
// };

it("should return a folder tree", async (done) => {
  //   const jwt = await getJwt();
  await request(strapi.server) // app server is an instance of Class: http.Server
    .get("/folders/tree")
    .set("accept", "application/json")
    .set("Content-Type", "application/json")
    .set("Authorization", "Bearer " + jwt)
    //.expect(200) // Expect response http code 200
    .then((data) => {
      expect(data.text).toBe("Hello World!"); // expect the response text
    });
  done();
});
