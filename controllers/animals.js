const Animal = require("../models/animal");
const {cloudinary} = require("../cloudinary/index");

module.exports.animalList = async(req,res)=>{
    const animals = await Animal.find({});
    res.render("animals/index", {animals});
}

module.exports.renderCreateAnimal = (req,res)=>{
    res.render("animals/new");
}

module.exports.createAnimal = async(req,res)=>{
    const animal = new Animal(req.body)
    // 단일 파일을 받는 경우라면 현재의 모델로 수행하고 다중 파일이라면 아래의 코드를 실행해야 한다.
    // const {path, filename} = req.file;
    // animal.images.url = path
    // animal.images.filename = filename
    
    // files로 받는 경우라면 모델에서 images를 배열로 만들고 아래를 수행해야 한다.
    animal.images = req.files.map(f=>({url:f.path, filename:f.filename}))
    animal.user = req.user; 
    await animal.save()
    res.redirect("/animal")
}

module.exports.detailAnimal = async(req,res)=>{
    const {id} = req.params;
    const animal = await Animal.findById(id).populate("user","-password");
    res.render("animals/detail", {animal})
}

module.exports.renderEditAnimal = async(req,res)=>{
    const {id} = req.params;
    const animal = await Animal.findById(id);
    res.render("animals/edit", {animal})
}

module.exports.editAnimal = async(req,res)=>{
    const {id} = req.params;
    const animal = await Animal.findByIdAndUpdate(id,{...req.body}, {new:true})
    const imgs = req.files.map(f=>({url:f.path, filename:f.filename}));
    animal.images.push(...imgs);
    if(req.body.deleteImages){
        // cloudly 이미지 삭제하기
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await animal.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    await animal.save();  
    res.redirect(`/animal/${id}`)
}

module.exports.deleteAnimal = async(req,res)=>{
    const {id} = req.params;
    const animal = await Animal.findByIdAndDelete(id)
    res.redirect("/animal")
}