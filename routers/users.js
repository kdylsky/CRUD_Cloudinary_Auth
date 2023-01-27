const express = require("express");
const router = express.Router();
const {validateUser} = require("../middleware"); 
const wrapAsync = require("../utils/wrapAsync");
const user = require("../controllers/users")

router.get("/register", user.renderRegister);
router.post("/register", validateUser, wrapAsync(user.register));
router.get("/login", user.renderLogin);
router.post("/login", validateUser, wrapAsync(user.login));
router.post("/logout", wrapAsync(user.logout));

module.exports = router