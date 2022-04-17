const checkPermission = require("../../middleware/checkPermission.middleware");
const GenerateToken = require("../../provider/GenerateTokenProvider");

import { NextFunction, Request, Response } from "express";

describe("Test CheckPermission Middleware", () => {
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

  it("should return a 500 error if this middleware is called before ensureAuthenticated middleware", async () => {
    const expectedResponse = {
      message: "Authenticate system was ignored",
    };
    checkPermission(["USER", "ADMIN"])(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.json).toBeCalledWith(expectedResponse);
    expect(mockResponse.status).toBeCalledWith(500);
  });

  it("should return a 401 error if the user has a permission different from the one provided", async () => {
    const generateToken = new GenerateToken();
    const token = await generateToken.execute("aqAZAyn6V4Zf");
    mockRequest = {
      headers: {
        authorization: "Bearer " + token,
      },
    };
    const expectedResponse = {
      message: "You are not authorized to perform this action",
    };
    await checkPermission(["USER"])(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
    expect(mockResponse.status).toBeCalledWith(401);
  });

  it("should call next if the user has the permission provided", async () => {
    const generateToken = new GenerateToken();
    const token = await generateToken.execute("aqAZAyn6V4Zf");
    mockRequest = {
      headers: {
        authorization: "Bearer " + token,
      },
    };
    await checkPermission(["ADMIN"])(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(nextFunction).toHaveBeenCalled;
  });
});
