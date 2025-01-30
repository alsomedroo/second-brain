import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export const userMiddleware = (req:Request, res:Response, next:NextFunction) => {
    const header = req.headers["authorization"]
    const decoded = jwt.verify(header as string, "secret_key")
    if (decoded){
        //@ts-ignore
        req.userId = decoded.id
        next()
    }else {
        res.status(401).json({ error: "Not authorized" })
    }
}