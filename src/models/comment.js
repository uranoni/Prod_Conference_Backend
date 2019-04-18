import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  paperID: {
    type: String,
    required: true,
    ref: "Submission"
  },
  jurordata: [{
    jid: { type: mongoose.Schema.Types.ObjectId },
    jname: { type: String },
    text: { type: String },
    grade: { type: String },
    status: { type: String },
  }],
  createAt: {
    type: String,
    required: true
  },
  updateAt: {
    type: String,
  }
})


export default mongoose.model('Comment', schema);