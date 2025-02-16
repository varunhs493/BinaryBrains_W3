const mongoose = require('mongoose');

const CenterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,  // Removes extra spaces
    index: true  // Improves search performance
  },
  description: {
    type: String,
    trim: true
  },
  location: {
    address: {
      type: String,
      required: true,
      index: true  // 🔹 Faster location-based search
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: function (val) {
          return val.length === 2 && typeof val[0] === 'number' && typeof val[1] === 'number';
        },
        message: "Coordinates must be an array [longitude, latitude]"
      },
      index: '2dsphere'
    }
  },
  acceptedItems: {
    type: [String],
    required: true, // 🔹 Prevents empty item lists
    default: []
  },
  contactInfo: {
    phone: {
      type: String,
      match: [/^\d{10}$/, "Phone number must be 10 digits"]
    },
    email: {
      type: String,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },
    website: {
      type: String
    }
  },
  operatingHours: {
    type: String,
    default: "Not available"
  },
  verified: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// 🔹 Virtual Field for Full Address
CenterSchema.virtual('fullAddress').get(function () {
  return `${this.location.address} (Lat: ${this.location.coordinates[1]}, Lon: ${this.location.coordinates[0]})`;
});

module.exports = mongoose.model('Center', CenterSchema);
