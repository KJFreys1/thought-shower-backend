const should = require("chai").should();
const expect = require("chai").expect;
const supertest = require("supertest");
const api = supertest("http://localhost:4000");

//testing the ideas routs
describe("GET /ideas", function() {
  it("should return a 200 response", function(done) {
    api
      .get("/ideas")
      .set("Accept", "application/json")
      .expect(200, done);
  });
});

describe("GET /ideas", function() {
  it("should return an array", function(done) {
    api
      .get("/ideas")
      .set("Accept", "application/json")
      .end(function(error, response) {
        expect(response.body).to.be.an("array");
        done();
      });
  });
});

describe("GET ideas by ID", () => {
  let id;
  before(done => {
    api
      .get("/ideas")
      .set("Accept", "application/json")
      .end((error, response) => {
        id = response.body[0]._id;
        done();
      });
  });

  it("one object by ID", done => {
    api
      .get(`/ideas/id/${id}`)
      .set("Accept", "application/json")
      .end((error, response) => {
        expect(response.body).to.be.an("object");
        done();
      });
  });
});

describe("POST, PUT, DELETE /ideas", () => {
  let previousLength;
  let ideaToDelete;
  let ideaToupdate;
  let n;
  let id;

  before(done => {
    api
      .get("/ideas")
      .set("Accept", "application/json")
      .end((error, response) => {
        previousLength = response.body.length;
        done();
      });
  });
  it("POST add and idea to the ideas", done => {
    api
      .post("/ideas")
      .set("Accept", "application/json")
      .send({
        title: "testtitle",
        category: "testcategory",
        post: "testpost",
        id: previousLength + 1
      })
      .end(done);
  });
  it("Verify it added the new idea", done => {
    api
      .get("/ideas")
      .set("Accept", "application/json")
      .end((error, response) => {
        expect(response.body.length).to.equal(previousLength + 1);
        n = response.body.length - 1;
        ideaToUpdate = response.body[n];
        id = ideaToUpdate._id;
        previousLength = response.body.length;
        done();
      });
  });
  it("PUT should update the new idea", done => {
    api
      .put(`/ideas/id/${id}`)
      .set("Accept", "application/json")
      .send({
        title: "testtitle",
        category: "testcategory updated",
        post: "testpost updated"
      })
      .end((error, response) => {
        done();
      });
  });
  it("Verify it updated the new idea", done => {
    api
      .get(`/ideas/id/${id}`)
      .set("Accept", "application/json")
      .end((error, response) => {
        expect(response.body.category).to.equal("testcategory updated");
        done();
      });
  });

  it("should detelte the object added to the collection", done => {
    api
      .delete(`/ideas/id/${id}`)
      .set("Accept", "application/json")
      .end((error, response) => {
        expect(response.body.length).to.equal(previousLength - 1);
        expect(response.body.find(idea => idea.id == id)).to.equal(undefined);
        done();
      });
  });
});

//testing GET, POST and Delete ideas/comments routs
describe("GET comments by by ID", () => {
  let id;
  before(done => {
    api
      .get("/ideas")
      .set("Accept", "application/json")
      .end((error, response) => {
        id = response.body[0]._id;
        done();
      });
  });

  it("one object by ID", done => {
    api
      .get(`/ideas/comments/${id}`)
      .set("Accept", "application/json")
      .end((error, response) => {
        expect(response.body).to.be.an("array");
        done();
      });
  });
});

describe("POST, DELETE to comments", () => {
  let previousLength;
  let ideaToDelete;
  let ideaToupdate;
  let n;
  let id;
  let commID;

  before(done => {
    api
      .post("/ideas")
      .set("Accept", "application/json")
      .send({
        title: "comment test",
        category: "comment",
        post: "comment",
        id: 1
      })
      .end(done);
  });
  it("should get the ID for the new idea", done => {
    api
      .get("/ideas/")
      .set("Accept", "application/json")
      .end((error, response) => {
        //  expect(response.body.length).to.equal(previousLength + 1);
        n = response.body.length - 1;
        ideaToUpdate = response.body[n];
        id = ideaToUpdate._id;
        // previousLength=response.body.length
        done();
      });
  });
  it("add a comment ", done => {
    api
      .post(`/ideas/comments/${id}`)
      .set("Accept", "application/json")
      .send({
        user: "anonymous",
        message: "testing comments"
      })
      .end((error, response) => {
        commID = response.body.comments[0]._id;
        previousLength = response.body.comments.length;

        done();
      });
  });
  it("add a second comment ", done => {
    api
      .post(`/ideas/comments/${id}`)
      .set("Accept", "application/json")
      .send({
        user: "anonymous",
        message: "testing2 this is really odd"
      })
      .end((error, response) => {
        done();
      });
  });

  it("DELETE should delete the comment from the new idea", done => {
    api
      .delete(`/ideas/comments/${id}/${commID}`)
      .set("Accept", "application/json")
      .end((error, response) => {
        expect(response.body.comments.id).to.equal(undefined);
        done();
      });
  });
});
