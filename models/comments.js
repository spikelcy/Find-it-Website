        /**
 * Created by spike on 13/4/2017.
 */

var mongoose = require('mongoose');
var commentSchema = mongoose.Schema(
    {
        "address":String,
        "postalcode": { type: Number, min: 0, max: 9999 },
        "rating": { type: Number, min: 0, max: 5 },
        "place_id": String,
        "person_id": String,
        "review_text" : String,
       "created_at"    : { type: Date, required: true, default: Date.now }
    }
);
mongoose.model('Comment',commentSchema);