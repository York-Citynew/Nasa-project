const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");
const VERSION = "v1";
describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });
  afterAll(() => {
    mongoDisconnect();
  });
  describe(`post /${VERSION}/launches`, () => {
    const launchRequestData = {
      rocket: "Explorer IS1",
      mission: "Kepler exploration X",
      launchDate: new Date("December 27, 2007"),
      target: "Kepler-442 b",
    };
    const launchRequestDataWoDate = {
      rocket: "Explorer IS1",
      mission: "Kepler exploration X",
      target: "Kepler-442 b",
    };
    test("it shouhld respond with 201", async () => {
      const response = await request(app)
        .post(`/${VERSION}/launches`)
        .send(launchRequestData)
        .expect(201)
        .expect("Content-Type", /json/);
      expect(new Date(launchRequestData.launchDate)).toBe(
        new Date(response.body.launchDate)
      );
      expect(response.body).toMatchObject(launchRequestDataWoDate);
    });
    test("it should throw a 404 error when receiving invalid flight id", async () => {
      const response = await request(app)
        .delete(`/${VERSION}/launches/99999`)
        .expect(404)
        .expect("Content-Type", /json/);
      expect(response.body).toStrictEqual({ error: "invalid id" });
    });
    test("it should throw a 400 error when recieving partially completed data", async () => {
      const response = await request(app)
        .post(`/${VERSION}/launches`)
        .send(launchRequestDataWoDate)
        .expect(400)
        .expect("Content-Type", /json/);
      expect(response.body).toStrictEqual({ error: "missing required fields" });
    });
  });
  describe(`get /${VERSION}/launches`, () => {
    test("it should respond with 200", async () => {
      await request(app)
        .get(`/${VERSION}/launches`)
        .expect(200)
        .expect("Content-Type", /json/);
    });
  });
});
