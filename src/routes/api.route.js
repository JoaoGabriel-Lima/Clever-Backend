const router = require("express").Router();
const UserController = require("../controllers/user.controller");
const PostController = require("../controllers/post.controller");
const AuthController = require("../controllers/auth.controller");
const RefreshTokenUserController = require("../controllers/RefreshToken/RefreshTokenUserController");
const permission = require("../middleware/checkPermission.middleware");
const {
  ensureAuthenticated,
} = require("../middleware/ensureAuthenticated.middleware");
const refreshTokenUserController = new RefreshTokenUserController();

router.get("/", UserController.helloWorld);

// TODO: Criar um sistema de permissões impedindo que usuários não autorizados acessem determinadas rotas ou recursos.
// TODO: Executar testes com Jest
// * ensureAuthenticated é um middleware que verifica se o usuário está com um token válido

// ! Users routes
router.get(
  "/user",
  ensureAuthenticated,
  permission(["USER", "ADMIN"]),
  UserController.getUser
);
router.get(
  "/AllUsers",
  ensureAuthenticated,
  permission(["ADMIN"]),
  UserController.getAllUsers
);

router.get(
  "/users/:id",
  ensureAuthenticated,
  permission(["USER", "ADMIN"]),
  UserController.getUserById
);

router.post("/users", UserController.addUser);

router.delete(
  "/users/:id",
  ensureAuthenticated,
  permission(["ADMIN"]),
  UserController.removeUser
);

router.get(
  "/check-token",
  ensureAuthenticated,
  // permission(["USER", "ADMIN"]),
  UserController.checkToken
);
router.put(
  "/users/:id",
  ensureAuthenticated,
  permission(["ADMIN"]),
  UserController.editUser
);

//! Auth routes
router.post("/login", AuthController.login);
router.post("/refresh-token", refreshTokenUserController.handle);

//! Post routes
router.get("/posts", ensureAuthenticated, PostController.getPosts);
router.post(
  "/posts/add",
  ensureAuthenticated,
  permission(["USER", "ADMIN"]),
  PostController.addPost
);
router.post(
  "/posts/like",
  ensureAuthenticated,
  permission(["USER", "ADMIN"]),
  PostController.likePost
);
router.delete(
  "/posts/remove/:id",
  ensureAuthenticated,
  permission(["ADMIN", "USER"]),
  PostController.deletePost
);

module.exports = router;
