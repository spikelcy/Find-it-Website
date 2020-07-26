/**
 * Created by spike on 13/4/2017.
 */
var mongoose = require('mongoose');
var placeSchema = mongoose.Schema(
    {
      "name":{ type: String, required: true },
      "address": { type: String, required: true },
        "postalcode": { type: Number, min: 0, max: 9999 },
        "tags":[
          {
            "name": String,
            "count": {type: Number, min: 0, max: 999}
          }
        ],
        "img": String,
        "img_id": String,
        "comments":[String],
        "google_id":String,
        "report": {type: Number, min: 0},
        "likes":{type: Number, min: 0},
        "created_at"    : { type: Date, required: true, default: Date.now }

      }
);

//By Hailie: add index to support text search
placeSchema.index({address:'text','tags.name':'text',name:'text'});
mongoose.model('Place',placeSchema);
