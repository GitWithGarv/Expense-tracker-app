import { model, Schema } from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        lowercase: true,
        trim: true 
    },
    mobile: {
        type: String,
        required: true,
        trim: true 
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true 
    },
    status: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: "user",
        enum: ['user']
    }
}, { timestamps: true });

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    const hashedPassword = await bcrypt.hash(this.password.toString(), 12);
    this.password = hashedPassword; 
    next();
});

const UserModel = model('User', userSchema);

export default UserModel;