var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const imageSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    img: 
    { data: Buffer, contentType: String }
   

})

module.exports = mongoose.model('Image', imageSchema);  //콜렉션에 모델을 연결한다. 

/* var Item = new ItemSchema(
    { img: 
    { data: Buffer, contentType: String }
   }
  );
  var Item = mongoose.model('Clothes',ItemSchema);
 */
/*   const imageSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    image:{
        type:Buffer,
        
        contentsType : String
    }

})
 */