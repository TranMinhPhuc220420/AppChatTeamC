const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const ChatController = require("../controllers/ChatController");
const ProductController = require("../controllers/ProductController");
const passport = require("passport");
const auth = passport.authenticate("jwt", { session: false });

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/admin/login", AuthController.loginAdmin);
router.post(
    "/admin/conversation-list",
    auth,
    ChatController.getConversationList
);
router.post("/get-messages", auth, ChatController.getMessages);
router.post("/send-message", auth, ChatController.sendMessage);
router.post('/get-chat', auth, ChatController.getChat);

router.get('/product/add', ProductController.addNew);
router.get('/product/get-all', ProductController.getAll);
router.post('/product/reduction', ProductController.reductionDiscount);

module.exports = router;
