const express= require("express");
const loginControllers= require("../controllers/logincontrollers");
const router= express.Router();

router.get("/home", loginControllers.home);
router.get("/register", loginControllers.renderRegister);
router.post("/register", loginControllers.addUser);
router.get("/login", loginControllers.renderLogin);
router.post("/login", loginControllers.auth);
router.get("/logout", loginControllers.logout);
router.post("/addtask", loginControllers.addTask);
router.get("/deletetask/:id", loginControllers.deleteTask);
router.post("/updatetask/:id", loginControllers.updateTask);

module.exports= router;