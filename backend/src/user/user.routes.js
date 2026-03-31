import {Router} from 'express';
import { createUser, login, logout, sendEmail, verifyOTP, signupWithOTP, forgotPassword, verifyToken, changePassword, getAllUsers, toggleUserStatus, deleteUser } from "./user.controller.js";
import { verifyTokenGuard, AdminUserGuard, AdminOnlyGuard } from "../middleware/guard.middleware.js";

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

userRouter.get('/all-users', AdminOnlyGuard, getAllUsers);
userRouter.patch('/toggle-status/:id', AdminOnlyGuard, toggleUserStatus);
userRouter.delete('/:id', AdminOnlyGuard, deleteUser);

userRouter.post('/verify-token', verifyTokenGuard, verifyToken);
userRouter.put('/change-password', verifyTokenGuard, changePassword);

export default userRouter;