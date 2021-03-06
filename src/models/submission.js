import mongoose from 'mongoose';

const schema = new mongoose.Schema({

    sid: {
        type: String,
        required: true,

    },
    title: {
        type: String,
        required: true,
    },
    contact: [{
        email: { type: String },
        username: { type: String },
        phone: { type: String }
    }],
    labels: [{ type: String, ref: "User" }],
    abstract: {
        type: String
    },
    authorsData: [{
        author: { type: String },
        description: { type: String },
        school: { type: String }
    }],
    published: { type: Boolean, default: false },
    reference: [{
        reflink: { type: String },
        reftittle: { type: String },
    }],
    createAt: {
        type: String,
        required: true
    },
    updateAt: {
        type: String
    },
    paperpath: {
        type: String,
    },
    papername: {
        type: String
    }
})


export default mongoose.model('Submission', schema);