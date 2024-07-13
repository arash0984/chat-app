const express = require("express")
const {
    createChat,
    findUserChats,
    findChat,
    gpt_help
} = require("../Controllers/chatController");

const router = express.Router();

router.post("/", createChat);
router.post("/help", gpt_help);
router.get("/:userId", findUserChats);
router.get("/find/:firstId/:secondId", findChat);

module.exports = router;
