const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String,
        default: ""
    },
    image: {
        url: {
            type: String,
            default: "https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_1280.png"
        },
        filename: {
            type: String,
            default: "default-avatar"
        }
    },
    coverImage: {
        url: {
            type: String,
            default: "/images/default-cover.png"
        },
        filename: {
            type: String,
            default: "default-cover"
        }
    },
    name: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    interests: {
        type: [String],
        default: []
    },
    favorites: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing"
        }
    ],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    emailVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true, strict: false });

userSchema.plugin(passportLocalMongoose);  //username, hashing, salting  and hashed password + some useful methods (read docs) inn sbko automatically implement krdega 

module.exports = mongoose.model("User", userSchema);