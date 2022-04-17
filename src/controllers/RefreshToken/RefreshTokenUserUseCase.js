const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const GenerateTokenProvider = require("../../provider/GenerateTokenProvider");
const dayjs = require("dayjs");
const GenerateRefreshToken = require("../../provider/GenerateRefreshTokenProvider");

// * Esta é a classe mais importante do processo de revalidar tokens de acesso. A classe recebe o refresh_token e verifica se ele existe no banco de dados.
// * Se existir, ele verifica se o refresh_token não expirou (10 dias). Se o refresh_token não expirou, ele cria e retorna um novo token de acesso através do UserID presente no banco de dados. Se expirou, ele cria e retorna um novo refresh_token e retorna um novo token de acesso.
// * Se o refresh_token não existir no banco de dados, ele retorna false para que o controller cuide das requisições.

class RefreshTokenUserUseCase {
  async execute(refresh_token) {
    if (!refresh_token) {
      return false;
    }
    if (typeof refresh_token !== "string") {
      return false;
    }
    const refreshToken = await prisma.refreshToken.findUnique({
      where: {
        id: refresh_token,
      },
    });
    if (!refreshToken) {
      return false;
    }
    const refreshTokenExpired = dayjs().isAfter(
      dayjs.unix(refreshToken.expiresIn)
    );

    const generateTokenProvider = new GenerateTokenProvider();
    const token = await generateTokenProvider.execute(refreshToken.userid);

    if (refreshTokenExpired) {
      const generateRefreshTokenProvider = new GenerateRefreshToken();
      const newRefreshToken = await generateRefreshTokenProvider.execute(
        refreshToken.userid
      );
      return { token, newRefreshToken };
    }

    return { token };
  }
}

module.exports = RefreshTokenUserUseCase;
