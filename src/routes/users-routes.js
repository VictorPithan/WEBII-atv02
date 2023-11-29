const { Router } = require("express");
const router = Router();

const { UsersController } = require("../controllers/users-controller");
const { AuthController } = require("../controllers/auth-controller");
const { isOwner } = require("../middleware/is-owner");
const { isAuth } = require("../middleware/is-auth");
const { PhotoController } = require("../controllers/photo-controller");
const { LikeController } = require("../controllers/like-controller");
const { TagController } = require("../controllers/tag-controller");

const userController = new UsersController();
const authController = new AuthController();
const photoController = new PhotoController();
const likeController = new LikeController();
const photoTagController = new TagController();

router.post("/tags", (req, res) => photoTagController.searchByTag(req, res))

router.get("/", (req, res) => userController.pageLogin(req, res));
router.post("/", (req, res) => authController.login(req, res));
router.get("/home", isAuth, (req, res) => photoController.pageHome(req, res));
router.get("/my-photos", isAuth, (req, res) => photoController.pageMyPhotos(req, res));
router.get("/users/:id/delete_photo/:photo_id", isAuth, isOwner, (req, res) => photoController.deletePhoto(req, res))
router.get("/friend-profile/:id", isAuth, (req, res) => photoController.pageFriendProfile(req, res));
router.get("/create-user", (req, res) => userController.pageCreateUser(req, res));
router.post("/create-user", (req, res) => userController.createUser(req, res));

router.get("/add-photo", isAuth, (req, res) => photoController.pageAddPhoto(req, res));
router.post("/add-photo", isAuth, (req, res) => photoController.addPhoto(req, res));

router.post("/photo/:photo_id", isAuth, (req, res) => likeController.addOrRemoveLike(req, res));

router.get("/photo/:photo_id", isAuth, (req, res) => photoController.pagePhoto(req, res));

router.get("/friend-list", isAuth, (req, res) => userController.getUsers(req, res));

router.get("/logout", (req, res) => authController.logout(req, res));

router.get('/page-not-found', (req, res) => res.render('page-not-found'));

module.exports = {
  usersRouter: router,
};
