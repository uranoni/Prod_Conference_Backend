const mongoose = require('mongoose');
const _ = require('lodash');
const SystemSchema = new mongoose.Schema({
  argsdefault: {
    type: String,
    default: "defaultargs"
  },
  conferenceName: {
    zh: {
      type: String,
      unique: true
    },
    en: {
      type: String,
      unique: true
    }
  },
  conferenceTopic: [{
    type: String
  }],
  conferenceAgenda: {
    location: {
      type: String
    },
    agenda: {
      type: String
    }
  },
  conferenceDate: {
    submitDeadline: {
      type: Date
    },
    noticeAccept: {
      type: Date
    },
    endGame: {
      type: Date
    },
    holdTime: {
      type: Date
    }
  },
  conferenceDocument: [{
    fileTitle: {
      type: String
    },
    fileName: {
      type: String
    },
    fileFormat: {
      type: String
    },
    fileUrl: {
      type: String
    }
  }],
  organizerContact: [{
    organizerName: {
      type: String
    },
    organizerEmail: {
      type: String
    },
    phone: {
      type: String
    }
  }],
  conferenceStatus: {
    type: Boolean
  }

})
SystemSchema.methods.removeDocument = function (createFile) {
  var system = this;
  return system.updateOne({
    $pull: {
      conferenceDocument: {
        _id: createFile
      }
    }
  })
}


SystemSchema.methods.removeDocument = function (gamecontact) {
  var system = this;
  return system.updateOne({
    $pull: {
      conferenceDocument: {
        _id: gamecontact.id
      }
    }
  })
}



export default mongoose.model('System', SystemSchema)