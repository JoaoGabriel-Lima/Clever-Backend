const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dayjs = require("dayjs");

// * Esta classe é responsável por gerar um novo RefreshToken que expira em 10 dias através do userId, isso ocorre somente quando usuário faz login ou
// * quando o RefreshToken é atualizado após 10 dias.

class GenerateRefreshToken {
  async execute(userId) {
    await prisma.refreshToken.deleteMany({
      where: {
        userid: userId,
      },
    });
    const expiresIn = dayjs().add(10, "day").unix();
    const generateRefreshToken = await prisma.refreshToken.create({
      data: {
        userid: userId,
        expiresIn: expiresIn,
      },
    });
    return generateRefreshToken;
  }
}

module.exports = GenerateRefreshToken;
