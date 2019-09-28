import { app, chai, db, expect } from "../../test-utils";
import { UserInstance } from "../../../src/models/UserModel";

describe("User", () => {

  let userId: number;

  beforeEach(async () => {
    await db.Comment.destroy({ where: {} });
    await db.Post.destroy({ where: {} });
    await db.User.destroy({ where: {} });
    return db.User.bulkCreate([
      {
        name: "Test User",
        email: "test@user.com",
        password: "1234"
      },
      {
        name: "Matheus",
        email: "matheus@user.com",
        password: "1234"
      },
      {
        name: "Araujo",
        email: "araujo@user.com",
        password: "1234"
      }
    ]).then((users: UserInstance[]) => {
      userId = users[0].get('id');
    });
  });
  describe("Queries", () => {
    describe("application/json", () => {
      describe("users",
      () => {
        it("should return a list of User", () => {
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
                .to.be.an("array");
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

        it("should paginate a list of User", () => {
          let body = {
            query: `
                    query getUserList($first: Int, $offset: Int) {
                        users (first: $first, offset: $offset) {
                            name
                            email
                            createdAt
                        }
                    }
                  `,
                  variables: {
                    first: 2,
                    offset: 1
                  }
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
                .to.be.an("array").of.length(2);
              expect(userList[0]).to.not.have.keys([
                "id",
                "photo",
                "updateAt",
                "posts"
              ]);
              expect(userList[0]).to.have.keys(["name", "email", "createdAt"]);
            });
        });
      });

      describe("user", () => {
        it("should return a single user", () => {
          let body = {
            query: `
                    query getSingleUser($id: ID!) {
                        user(id: $id) {
                          id  
                          name
                          email
                          posts {
                            title
                          }
                        }
                    }
                  `,
                  variables: {
                    id: userId
                  }
          };

          return chai
            .request(app)
            .post("/graphql")
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(body))
            .then(res => {
              const user = res.body.data.user;
              expect(res.body.data).to.be.an("object");
              expect(user).to.be.an('object')
              expect(user).to.has.keys(['id', 'name', 'email', 'posts'])
              expect(user.name).to.be.equal("Test User")
              expect(user.email).to.be.equal("test@user.com")
            });
        });

        it("should return only 'name' atribute", () => {
          let body = {
            query: `
                    query getSingleUser($id: ID!) {
                        user(id: $id) {
                          name
                        }
                    }
                  `,
                  variables: {
                    id: userId
                  }
          };

          return chai
            .request(app)
            .post("/graphql")
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(body))
            .then(res => {
              const user = res.body.data.user;
              expect(res.body.data).to.be.an("object");
              expect(user).to.be.an('object')
              expect(user).to.has.key('name')
              expect(user.name).to.be.equal("Test User")
              expect(user.email).to.be.undefined;
            });
        });

        it("should return an error if user do not exists", () => {
          let body = {
            query: `
                    query getSingleUser($id: ID!) {
                        user(id: $id) {
                          name
                        }
                    }
                  `,
                  variables: {
                    id: -1
                  }
          };

          return chai
            .request(app)
            .post("/graphql")
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(body))
            .then(res => {
              expect(res.body.data.user).to.be.null;
              expect(res.body).to.have.keys(['data', 'errors'])
              expect(res.body.errors).to.be.an('array')
              expect(res.body.errors[0].message).to.be.equal('Error: User with id -1 not found')
            });
        });
      })
    });
  });
});
