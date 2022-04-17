const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
const { verify } = require("jsonwebtoken");

const generateRandomString = async function () {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  const userExists = await prisma.user.findUnique({
    where: { userId: result },
  });
  if (userExists) {
    generateRandomString();
  }
  return result;
};

exports.helloWorld = async function (req, res) {
  res.send({ message: "The API is working 😉" });
};

exports.getUser = async function (req, res, next) {
  try {
    let users = await prisma.user.findUnique({
      where: { userId: req.userId },
      select: {
        email: true,
        name: true,
        username: true,
      },
    });
    res.status(201).json({ data: users });
  } catch (error) {
    next(error);
  }
};
exports.getAllUsers = async function (req, res, next) {
  try {
    let users = await prisma.user.findMany({
      select: {
        userId: true,
        name: true,
        email: true,
        permissions: true,
        updatedAt: true,
        createdAt: true,
      },
    });
    res.status(201).json({ data: users });
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async function (req, res, next) {
  const { id } = req.params;

  if (req.role === "ADMIN") {
    try {
      let user = await prisma.user.findUnique({
        where: { id: Number(req.params.id) },
        select: {
          userId: true,
          name: true,
          email: true,
          permissions: true,
          updatedAt: true,
          createdAt: true,
        },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(201).json({ data: user });
    } catch (error) {
      next(error);
    }
  }

  try {
    let user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};
exports.addUser = async function (req, res, next) {
  const { name, email, password, username } = req.body;
  if (!name || !email || !password || !username) {
    return res.status(400).json({ message: "Missing parameters" });
  }
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) {
    return res
      .status(400)
      .json({ message: "This email has already been registered" });
  }
  const usernameHasTaken = await prisma.user.findUnique({
    where: { username: username },
  });
  if (usernameHasTaken) {
    return res.status(400).json({ message: "Username already taken" });
  }
  // Create a function that will generate a random string of characters with a length of 12
  const uuid = await generateRandomString();
  const hashpass = await bcrypt.hash(password, 10);
  try {
    let user = await prisma.user.create({
      data: {
        username: username,
        name: name,
        email: email,
        password: hashpass,
        userId: uuid,
      },
    });
    res.status(201).json({ message: "successful", data: [user] });
  } catch (error) {
    next(error);
  }
};

exports.checkToken = async function (req, res, next) {
  return res.status(200).json({ message: "successful" });
};

exports.removeUser = async function (req, res, next) {
  try {
    const { id } = req.params;
    let user = await prisma.user.findUnique({ where: { id: Number(id) } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user = await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.status(201).json({ message: "successful", data: user });
  } catch (error) {
    next(error);
  }
};

exports.editUser = async function (req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    let user = await prisma.user.findUnique({ where: { id: Number(id) } });
    let userExists = null;

    if (email != undefined) {
      userExists = await prisma.user.findUnique({ where: { email } });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (userExists && userExists.id !== Number(id)) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashpass = await bcrypt.hash(password, 10);

    user = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email, hashpass, updatedAt: new Date() },
    });

    return res.status(200).json({ message: "successful", data: user });
  } catch (error) {
    next(error);
  }
};
