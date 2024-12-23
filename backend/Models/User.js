import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']  // Gender restriction
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Ensure email is unique
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']  // Email validation
    },
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();  // Check if password is modified
    this.password = await bcrypt.hash(this.password, 10);  // Hash the password
    next();
});

// Compare password method (for login)
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);  // Compare passwords
};

const User = mongoose.model('User', userSchema);

export default User;
