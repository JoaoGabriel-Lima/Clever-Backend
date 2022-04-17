var jwt = require("jsonwebtoken");

// * Esta classe é responsável por criar e retornar um novo token de acesso que dura 15 minutos criptografado com o seu ID de usuário.

class GenerateToken {
  async execute(userId) {
    const token = jwt.sign({ userId: userId }, `${process.env.JWT_SECRET}`, {
      expiresIn: "15m",
    });
    return token;
  }
}

module.exports = GenerateToken;
