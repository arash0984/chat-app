const chatModel = require("../Models/chatModel");
const messageModel = require("../Models/messageModel");
const userModel = require("../Models/userModel")
const { GoogleGenerativeAI } = require("@google/generative-ai");

const createChat = async (req, res) => {
    const { firstId, secondId } = req.body;

    try {
        const chat = await chatModel.findOne({
            members: { $all: [firstId, secondId] },
        });

        if (chat) return res.status(200).json(chat);

        const newChat = new chatModel({
            members: [firstId, secondId],
        });

        const response = await newChat.save();

        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const findUserChats = async (req, res) => {
    const userId = req.params.userId;

    try {
        const chats = await chatModel.find({
            members: { $in: [userId] },
        });

        res.status(200).json(chats);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const findChat = async (req, res) => {
    const { firstId, secondId } = req.params;

    try {
        const chat = await chatModel.findOne({
            members: { $all: [firstId, secondId] },
        });

        res.status(200).json(chat);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const gpt_help = async (req, res) => {
    let { chat_id, user_id, message } = req.body;

    try {
        const messages = await messageModel.find({ chatId: chat_id }).sort({ createdAt: +1 }).limit(40);

        const senderIds = [...new Set(messages.map(message => message.senderId))];

        const users = await userModel.find({ _id: { $in: senderIds } });
        const userMap = {};
        users.forEach(user => {
          userMap[user._id] = user.name;
        });

        const regex = /\$\$(.*?)\$\$/g;
        let matches = [];
        let match;

        // Extract matches
        while ((match = regex.exec(message)) !== null) {
            matches.push(match[1]);
            message = message.replace(new RegExp(`${match[0]}`, 'g'), '')
        }

        let prompt = `You are a communication expert. `;

        if (matches.length !=0) {
            prompt += `${userMap[user_id]} wants you to help him in the following conversation. He has given you the folowing instructions:\n`
            matches.forEach((instruciton, i) => {
                prompt += `${i + 1}. ${instruciton}\n`;
            })
            prompt += `\nWrite an appropriate message based on these messages:\n\n`;
        } else {
            prompt += `${userMap[user_id]} wants you to help him in the following conversation. Write an appropriate message based on these messages:\n\n`;
        }

        messages.forEach(message => {
          const userName = userMap[message.senderId];
          prompt += `${userName}: ${message.text}\n`;
        });

        prompt += `\nPlease write a suitable response to continue the conversation. Don't repeat the \"${userMap[user_id]}:\" part, only output the message.`;

        console.log(prompt);

        const genAI = new GoogleGenerativeAI(process.env.API_KEY);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        console.log(text);

        res.status(200).json({"message": text})
    } catch {

    }
}

module.exports = { createChat, findUserChats, findChat, gpt_help };
