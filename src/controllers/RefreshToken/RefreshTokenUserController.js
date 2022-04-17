const { response } = require("express");
const RefreshTokenUserUseCase = require("./RefreshTokenUserUseCase");

// * Esta classe, juntamente com o RefreshTokenUserUseCase, é responsável por fazer a revalidação do token de acesso. Ela envia o refresh_token para o UserUseCase e caso o sistema retorne false
// * Ele retorna um error 401

class RefreshTokenUserController {
  async handle(req, res, next) {
    const { refresh_token } = req.body;
    const refreshtokenUserUseCase = new RefreshTokenUserUseCase();
    const refreshtoken = await refreshtokenUserUseCase.execute(refresh_token);
    if (!refreshtoken) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }
    return res.json(refreshtoken);
  }
}
module.exports = RefreshTokenUserController;
