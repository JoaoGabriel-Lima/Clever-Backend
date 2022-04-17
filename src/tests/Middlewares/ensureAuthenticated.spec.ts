const {
  ensureAuthenticated,
} = require("../../middleware/ensureAuthenticated.middleware");
const GenerateToken = require("../../provider/GenerateTokenProvider");

import { NextFunction, Request, Response } from "express";

describe("Test Token Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction = jest.fn;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  it("should return a 401 if no token is provided", async () => {
    mockRequest = {
      headers: {},
    };
    const expectedResponse = {
      message: "Unauthorized",
    };

    ensureAuthenticated(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.json).toBeCalledWith(expectedResponse);
    expect(mockResponse.status).toBeCalledWith(401);
  });

  it("should return a 401 if the token is invalid", async () => {
    mockRequest = {
      headers: {
        authorization: "Bearer invalid-token",
      },
    };
    const expectedResponse = {
      message: "This Token is Invalid",
    };

    ensureAuthenticated(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(mockResponse.status).toBeCalledWith(401);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });

  it("should call next if the token is valid", async () => {
    const generateToken = new GenerateToken();
    const token = await generateToken.execute("aqAZAyn6V4Zf");
    mockRequest = {
      headers: {
        authorization: "Bearer " + token,
      },
    };
    await ensureAuthenticated(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled;
  });

  it("Should return 401 if the token is valid but user doesn't", async () => {
    const generateToken = new GenerateToken();
    const token1 = await generateToken.execute("invalidUser");
    mockRequest = {
      headers: {
        authorization: "Bearer " + token1,
      },
    };
    const expectedResponse = {
      message: "This Token is Invalid",
    };

    await ensureAuthenticated(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(mockResponse.status).toBeCalledWith(401);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });
});
