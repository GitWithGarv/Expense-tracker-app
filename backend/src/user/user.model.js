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
        unique: true,
        lowercase: true
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
        enum: ['user', 'admin']
    }
}, { timestamps: true });

userSchema.pre('save', async function(){
    if(!this.isModified('password')) return;
    const hashedPassword = await bcrypt.hash(this.password.toString(), 12);
    this.password = hashedPassword; 
});

const UserModel = model('User', userSchema);

export default UserModel;