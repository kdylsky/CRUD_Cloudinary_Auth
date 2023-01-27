const mongoose = require("mongoose");
const {cloudinary} = require("../cloudinary/index");

// 아래의 ImageSchema를 넣는 경우
const ImageSchema = new mongoose.Schema({
    url:String,
    filename:String
})

// 이미지 크기 조정을 위한 가상속성 설정
ImageSchema.virtual("arrageImageSize").get(function(){
    return this.url.replace("/upload", "/upload/w_300");
})

const AnimalSchema = new mongoose.Schema({
    name:String,
    description:String,
    lifespan:Number,
    // images:{
    //     url:String,
    //     filename:String
    // }
    images : [ImageSchema],
    user :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

AnimalSchema.post("findOneAndDelete", async function(doc){
    for (let image of doc.images){
        await cloudinary.uploader.destroy(image.filename);
    }
})

const Animal = mongoose.model("Animal", AnimalSchema);
module.exports = Animal;