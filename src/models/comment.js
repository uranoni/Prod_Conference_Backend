import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    commentID:{
      type: String,
      required: true,
      unique: true
    },
    paperID: {
        type: String,
        required: true,
    },
    text:{
      type:String
    },
    grade:{
      type:String
    },
    jurordata:[{
      uid:{type: String},
      jurorname:{type: String},
      juroremail:{type: String}
    }],
    createAt: {
        type: Date,
        required: true
    },
    updateAt: {
      type: Date,
      required: true
  }
})


export default mongoose.model('Comment', schema);