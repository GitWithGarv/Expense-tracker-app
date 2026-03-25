import {Router} from 'express';
import { createUser, login, logout, sendEmail, verifyOTP, signupWithOTP, forgotPassword, verifyToken, changePassword } from "./user.controller.js";
import { verifyTokenGuard, AdminUserGuard } from "../middleware/guard.middleware.js";

const userRouter = Router();

userRouter.post('/signUp', signupWithOTP);
userRouter.post('/login', login);
userRouter.post('/logout', logout);
userRouter.post('/send-mail', sendEmail);
userRouter.post('/verify-otp', verifyOTP);
userRouter.post('/forgot-password', forgotPassword);
userRouter.get('/session', AdminUserGuard, (req, res) => {
    return res.json(req.user);
});

userRouter.post('/verify-token', verifyTokenGuard, verifyToken);
userRouter.put('/change-password', verifyTokenGuard, changePassword);

export default userRouter;