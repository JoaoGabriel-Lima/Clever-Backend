import GenerateRefreshToken from "../../provider/generateRefreshTokenProvider";

describe("Test RefreshToken Provider", () => {
  it("should return a new token if the user has the permission provided", async () => {
    const generateRefreshToken = new GenerateRefreshToken();
    const refreshToken = await generateRefreshToken.execute("aqAZAyn6V4Zf");
    expect(typeof refreshToken.id).toBe("string");
  });
});
