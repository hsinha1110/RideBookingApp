import mongoose, { Document, Schema } from "mongoose";

//================================================
// INTERFACE
//================================================

export interface IRide extends Document {
  rider: mongoose.Types.ObjectId;

  driver?: mongoose.Types.ObjectId;

  pickupLocation: {
    type: "Point";

    coordinates: [number, number];

    address: string;

    place_id: string;

    name: string;
  };

  destinationLocation: {
    type: "Point";

    coordinates: [number, number];

    address: string;

    place_id: string;

    name: string;
  };

  status: "pending" | "accepted" | "ongoing" | "completed" | "cancelled";

  fare?: number;
}

//================================================
// SCHEMA
//================================================

const RideSchema: Schema = new Schema(
  {
    rider: {
      type: Schema.Types.ObjectId,

      ref: "User",

      required: true,
    },

    driver: {
      type: Schema.Types.ObjectId,

      ref: "User",
    },

    //============================================
    // PICKUP LOCATION
    //============================================

    pickupLocation: {
      type: {
        type: String,

        enum: ["Point"],

        default: "Point",

        required: true,
      },

      coordinates: {
        type: [Number],

        required: true,
      },

      address: {
        type: String,

        required: true,
      },

      place_id: {
        type: String,

        required: true,
      },

      name: {
        type: String,

        required: true,
      },
    },

    //============================================
    // DESTINATION LOCATION
    //============================================

    destinationLocation: {
      type: {
        type: String,

        enum: ["Point"],

        default: "Point",

        required: true,
      },

      coordinates: {
        type: [Number],

        required: true,
      },

      address: {
        type: String,

        required: true,
      },

      place_id: {
        type: String,

        required: true,
      },

      name: {
        type: String,

        required: true,
      },
    },

    //============================================
    // STATUS
    //============================================

    status: {
      type: String,

      enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],

      default: "pending",
    },

    //============================================
    // FARE
    //============================================

    fare: {
      type: Number,
    },
  },

  {
    timestamps: true,
  },
);

//================================================
// GEO INDEXES
//================================================

RideSchema.index({
  "pickupLocation.coordinates": "2dsphere",
});

RideSchema.index({
  "destinationLocation.coordinates": "2dsphere",
});

//================================================
// MODEL
//================================================

export default mongoose.model<IRide>("Ride", RideSchema);
