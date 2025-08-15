import mongoose, { CallbackError, model, models } from "mongoose";
import bcrypt from "bcryptjs";


export interface IUser {
    name: string;
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    profilePicture?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
    {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String }
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


const User = models.User || model<IUser>('User', userSchema);
export default User;