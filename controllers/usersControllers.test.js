import { app } from "../app.js";
import { jest } from "@jest/globals";
import supertest from "supertest";

jest.mock("../schemas/usersSchemas.js");

describe("loginUser tests", () => {
  test("should return status code 200, token, and user object with email and subscription fields", async () => {
    const data = await supertest(app).post("/users/login").send({
      email: "phil@gmail.com",
      password: "52346728",
    });

    console.log(data);

    expect(data.status).toBe(200);
    expect(data.body).toHaveProperty("token");
    expect(data.body.user).toBeDefined();
    expect(data.body.user.email).toBe("phil@gmail.com");
    expect(typeof data.body.user.email).toBe("string");
    expect(data.body.user.subscription).toBe("starter");
    expect(typeof data.body.user.subscription).toBe("string");
  });
});
