const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let PokeModel = {};

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const PokeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trum: true,
    set: setName,
  },

  level: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  
  pokeDexNumber: {
    type: Number,
    min: 1,
    max: 151,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

PokeSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  level: doc.level,
  pokeDexNumber: doc.pokeDexNumber,
});

PokeSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return PokeModel.find(search).select('name level pokeDexNumber').exec(callback);
};

PokeModel = mongoose.model('Poke', PokeSchema);

module.exports.PokeModel = PokeModel;
module.exports.PokeSchema = PokeSchema;

