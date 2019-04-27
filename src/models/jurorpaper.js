import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    JID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    paperList: [{
        sid: {
            type: String,

        },
        title: String,
        status: Boolean,
        time: Date,
    }],
})


export default mongoose.model('JurorPaper', schema);