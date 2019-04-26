import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    JID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    paperList: [{
        pid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Submission"
        },
        ptitle: String,
        pstatus: Boolean,
        time: Date,
    }],
})


export default mongoose.model('JurorPaper', schema);