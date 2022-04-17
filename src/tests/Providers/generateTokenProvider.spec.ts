import GenerateToken from "../../provider/GenerateTokenProvider";

describe("Test RefreshToken Provider", () => {
  it("should return a new token if the user has the permission provided", async () => {
    const generateToken = new GenerateToken();
    const token = await generateToken.execute("aqAZAyn6V4Zf");
    expect(typeof token).toBe("string");
  });
});
