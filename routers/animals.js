const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync")
const animals = require("../controllers/animals")
const {isLogin, isValidUser} = require("../middleware");
//설정한 cloudinary를 불러온다.
const {storage} = require("../cloudinary/index") 

//multer설정 저장 위치를 설정한다. 현재는 로컬로 되어 있다.
const multer = require("multer");

// const upload = multer({dest:"uploads/"})
const upload = multer({storage});
// upload에는 single와 array 등이 있다.
// 위의 메서드를 사용하게 되면 multer가 body를 파싱하게 된다.

router.get("/", wrapAsync(animals.animalList));
router.get("/new", isLogin, animals.renderCreateAnimal);
router.post("/", isLogin, upload.array("image"),  wrapAsync(animals.createAnimal));
router.get("/:id", wrapAsync(animals.detailAnimal));
router.get("/:id/edit", isLogin, isValidUser, wrapAsync(animals.renderEditAnimal));
router.put("/:id", isLogin, isValidUser,  upload.array("image"), wrapAsync(animals.editAnimal))
router.delete("/:id", isLogin, isValidUser, wrapAsync(animals.deleteAnimal));

module.exports = router;