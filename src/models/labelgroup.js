import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    labelname: {
        type: String
    },
    papers: [{
        paperID: { type: String },
        paperTitle: { type: String }
    }],
    jurors: [{
        jurorID: { type: String },
        jurorName: { type: String }
    }]

})


export default mongoose.model('LabelGroup', schema);