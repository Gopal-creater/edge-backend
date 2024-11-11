import request from "supertest";
import app from "../../app";
import User from "../../models/userModal";
import jwt from "jsonwebtoken";

jest.mock("../../models/userModal");
jest.mock("jsonwebtoken");

describe("User routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/v1/users/signin", () => {
    test("should sign in user with correct credentials", async () => {
      const mockUser = {
        _id: "mockUserId",
        userName: "testuser",
        password: "password123",
        correctPassword: jest.fn().mockResolvedValue(true),
      };

      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockImplementation((payload, secret, options, callback) => {
        callback(null, "mockToken");
      });

      const response = await request(app)
        .post("/api/v1/users/signin")
        .send({ userName: "testuser", password: "password123" })
        .expect(200);

      console.log("Logging-----", response);

      expect(response.data.status).toBe("success");
      expect(response.data.token).toBe("mockToken");
      expect(response.data.data._id).toBe("mockUserId");
    });

    test("should return 400 if username or password is missing", async () => {
      const response = await request(app)
        .post("/api/v1/users/signin")
        .send({})
        .expect(400);

      expect(response.data.status).toBe("fail");
      expect(response.data.message).toBe("User name and Password is required!");
    });

    test("should return 401 for incorrect credentials", async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/v1/users/signin")
        .send({ userName: "wronguser", password: "wrongpassword" })
        .expect(401);

      expect(response.data.status).toBe("fail");
      expect(response.data.message).toBe("Incorrect user name or password");
    });
  });

  describe("GET /api/v1/users/me", () => {
    test("should get user data for authenticated user", async () => {
      const mockUser = {
        _id: "mockUserId",
        userName: "testuser",
      };

      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: "mockUserId" });
      });

      User.findById.mockResolvedValue(mockUser);

      const response = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", "Bearer validToken")
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data).toEqual(mockUser);
    });

    test("should return 401 if no token is provided", async () => {
      const response = await request(app).get("/api/v1/users/me").expect(401);

      expect(response.body.status).toBe("fail");
      expect(response.body.message).toBe("User not logged in!");
    });

    test("should return 401 if token is invalid", async () => {
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(new Error("Invalid token"));
      });

      const response = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", "Bearer invalidToken")
        .expect(401);

      expect(response.body.status).toBe("fail");
      expect(response.body.message).toBe("User not logged in!");
    });

    test("should return 401 if user no longer exists", async () => {
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: "nonexistentUserId" });
      });
      User.findById.mockResolvedValue(null);

      const response = await request(app)
        .get("/api/v1/users/me")
        .set("Authorization", "Bearer validToken")
        .expect(401);

      expect(response.body.status).toBe("fail");
      expect(response.body.message).toBe(
        "The user belonging to this token does no longer exist."
      );
    });
  });
});
