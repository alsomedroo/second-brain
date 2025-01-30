import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ContentModel, UserModel } from "./db";
import {userMiddleware} from "./middleware"

const app = express();
app.use(express.json());
app.post("/api/v1/signup", async (req, res) => {
    // TODO: zod validation , hash the password
    const username = req.body.username;
    const password = req.body.password;

    try {
        await UserModel.create({
            username: username,
            password: password
        }) 

        res.json({
            message: "User signed up"
        })
    } catch(e) {
        res.status(411).json({
            message: "User already exists"
        })
    }
})

app.post('/api/v1/signin' , async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    const existingUser = await UserModel.findOne({
        username,
        password
    })

    if (existingUser){
        const token = jwt.sign({ id: existingUser._id }, 'secret_key' )
        res.json({
            message: "User authenticated",
            token
        })

    }else{
        res.status(401).json({
            message: "Invalid credentials"
        })
    }
})
2
app.post('/api/v1/content', userMiddleware , async (req, res) => {
    const type = req.body.type
    const link = req.body.link

    await ContentModel.create({
        link,
        type,
        //@ts-ignore
        userId: req.userId,
        tags: []
    })
    res.json({
        messege: "Content added"
    })

})

app.get('/api/v1/content',userMiddleware, async (req, res) => {
    //@ts-ignore
    const userId = req.userId
    const content = await ContentModel.find({
        userId:userId
    }).populate("userId")
    res.json({
        content
    })
})

app.delete('/api/v1/content',userMiddleware, async (req, res) => {
    const contentId = req.body.contentId
    
    await ContentModel.deleteMany({
        contentId,
        //@ts-ignore
        userId: req.userId

    })

    res.json({
        message:"Delete content"
    })

})

app.post('/api/v1/brain/share', (req, res) => {

})

app.get('/api/v1/brain/:sharelink', (req, res) => {
    
})

app.listen(3000)