import mongoose, { Document, Schema } from "mongoose";

import bcrypt from "bcryptjs";

export interface IUser extends Document {
  fullName: string;

  email: string;

  phoneNumber: string;

  password?: string;

  profileImage?: string;

  bio?: string;

  gender?: "male" | "female" | "other";

  dateOfBirth?: Date;

  isOnline?: boolean;

  fcmToken?: string;

  rating?: number;

  totalRides?: number;

  userType: "rider" | "driver";

  location?: {
    type: "Point";

    coordinates: [number, number];

    heading?: number;
  };

  carDetails?: {
    carName: string;

    carNumber: string;

    carModel: string;

    carColor: string;
  };

  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    userType: {
      type: String,
      enum: ["rider", "driver"],
      required: true,
    },

    //==================================================
    // PROFILE IMAGE
    //==================================================

    profileImage: {
      type: String,

      default:
        "https://www.clipartmax.com/png/small/117-1179462_user-icon-flat-user-icon-png-green",
    },

    //==================================================
    // BIO
    //==================================================

    bio: {
      type: String,

      default: "",
    },

    //==================================================
    // GENDER
    //==================================================

    gender: {
      type: String,

      enum: ["male", "female", "other"],
    },

    //==================================================
    // DATE OF BIRTH
    //==================================================

    dateOfBirth: {
      type: Date,
    },

    //==================================================
    // ONLINE STATUS
    //==================================================

    isOnline: {
      type: Boolean,

      default: false,
    },

    //==================================================
    // FCM TOKEN
    //==================================================

    fcmToken: {
      type: String,

      default: "",
    },

    //==================================================
    // USER RATING
    //==================================================

    rating: {
      type: Number,

      default: 5,
    },

    //==================================================
    // TOTAL RIDES
    //==================================================

    totalRides: {
      type: Number,

      default: 0,
    },

    //==================================================
    // LOCATION
    //==================================================

    location: {
      type: {
        type: String,

        enum: ["Point"],

        default: "Point",
      },

      coordinates: {
        type: [Number],

        default: [0, 0],
      },

      heading: {
        type: Number,

        default: 0,
      },
    },

    //==================================================
    // CAR DETAILS
    //==================================================

    carDetails: {
      carName: {
        type: String,
      },

      carNumber: {
        type: String,
      },

      carModel: {
        type: String,
      },

      carColor: {
        type: String,
      },
    },
  },

  {
    timestamps: true,
  },
);

//======================================================
// GEO INDEX
//======================================================

UserSchema.index({
  "location.coordinates": "2dsphere",
});

//======================================================
// HASH PASSWORD
//======================================================

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

//======================================================
// COMPARE PASSWORD
//======================================================

UserSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
