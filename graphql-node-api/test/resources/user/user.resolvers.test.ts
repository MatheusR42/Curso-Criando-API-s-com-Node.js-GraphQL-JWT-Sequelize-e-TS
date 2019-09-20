import { app, chai, db, expect } from "../../test-utils";

describe("User", () => {
  beforeEach(async () => {
    await db.Comment.destroy({ where: {} });
    await db.Post.destroy({ where: {} });
    await db.User.destroy({ where: {} });
    return db.User.create({
      name: "Test User",
      email: "test@user.com",
      password: "1234"
    });
  });
  describe("Queries", () => {
    describe("application/json", () => {
      describe("users", () => {
        it("shoud return a list of User", () => {
          let body = {
            query: `
                    query {
                        users {
                            name
                            email
                        }
                    }
                  `
          };

          return chai
            .request(app)
            .post("/graphql")
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(body))
            .then(res => {
              const userList = res.body.data.users;
              expect(res.body.data).to.be.an("object");
              expect(userList)
                .to.be.an("array")
                .of.length(1);
              expect(userList[0]).to.not.have.keys([
                "id",
                "photo",
                "creatAt",
                "updateAt",
                "posts"
              ]);
              expect(userList[0]).to.have.keys(["name", "email"]);
            });
        });
      });
    });
  });
});
