const { verify } = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.ensureAuthenticated = async function (req, res, next) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authToken.split(" ")[1];

  try {
    const user = verify(token, process.env.JWT_SECRET);
    const isUserValid = await prisma.user.findUnique({
      where: { userId: user.userId },
    });
    if (!isUserValid) {
      return res.status(401).json({ message: "This Token is Invalid" });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "This Token is Invalid" });
  }
};
