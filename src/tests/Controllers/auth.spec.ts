import { NextFunction, Request, Response } from "express";
const auth = require("../../controllers/auth.controller");

describe("Test Auth Process", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn;

  beforeEach(() => {
    mockRequest = { headers: {} };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  test("should return a 400 if its missing parameters", async () => {
    mockRequest = {
      body: {},
    };
    const expectedResponse = {
      message: "Missing parameters",
    };
    await auth.login(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
    expect(mockResponse.status).toBeCalledWith(401);
  });

  test("should return a 400 if email or password is invalid", async () => {
    mockRequest = {
      body: {
        email: "jg.limamarinho202@gmail.com",
        password: "invalidpassword",
      },
    };
    const expectedResponse = {
      message: "Invalid email or password",
    };
    await auth.login(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
    expect(mockResponse.status).toBeCalledWith(401);
  });

  test("should return a 200 if email and password is correct", async () => {
    mockRequest = {
      body: {
        email: "test.account@gmail.com",
        password: "batman202",
      },
    };
    await auth.login(mockRequest as Request, mockResponse as Response);
    expect(mockResponse.status).toBeCalledWith(200);
  });
});
