const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const GenerateToken = require("../provider/GenerateTokenProvider");
const GenerateRefeshToken = require("../provider/GenerateRefreshTokenProvider");

// * O AuthController.login é responsável por fazer a autenticação do usuário. Caso senha e email esteja correto, ele cria um novo token de acesso e um novo token de refresh a partir do UserID que o prisma retorna.
// * Além disso, ele deleta o último refresh token para garantir que aquele acesso não seja reutilizado. (Só pode existir um refresh token por usuário)

exports.login = async function (req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ message: "Missing parameters" });
    }
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const generateToken = new GenerateToken();
    const token = await generateToken.execute(user.userId);

    const generateRefreshToken = new GenerateRefeshToken();
    const refreshToken = await generateRefreshToken.execute(user.userId);

    res.status(200).json({
      status: "successful",
      data: { token: token, refreshToken: refreshToken },
    });
  } catch (error) {
    next(error);
  }
};
