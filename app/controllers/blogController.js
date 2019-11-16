const mongoose = require('mongoose');
const shortid = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const check = require('../libs/checkLib')



/* Models */
const BlogModel=mongoose.model('BlogModel')


let createBlog=(req,res)=>{
console.log(req.file)
    let newBlog = new BlogModel({
        blogId:shortid.generate(),
        title:req.body.title,
        description:req.body.description,
        content:req.body.content,
        authorName:req.body.userName,
        authorId:req.body.userId,
        productimage: req.file.path,
        createdOn:Date.now()
    })
    newBlog.save((err,result)=>{
        if(err){
            logger.error(`Error occured : ${err}`, 'createBlog', 10)
            let apiResponse = response.generate(true, 'Failed to register Event', 500, null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            logger.error(`No blog found`, 'createBlog', 6)
            let apiResponse = response.generate(true, 'Blog not found', 404, null)
            res.send(apiResponse)
        } else {
            console.log(result)
            logger.info(`blog created`, 'createBlog', 1)
            let apiResponse = response.generate(false, 'Blog created successfully', 200, result)
            res.send(apiResponse)
        }
    })

}

let deleteBlog=(req,res)=>{

    let remove=()=>{
      return new Promise((resolve,reject)=>{
        BlogModel.deleteOne({blogId:req.body.blogId},(err,result)=>{
            if(err){
                logger.error('some error occured','delete blog',7)
            let apiResponse=response.generate(true,'some error occured',500,null)
            reject(apiResponse)
            } else if (check.isEmpty(result)) {
                let apiResponse = response.generate(true, 'blog not found', 404, null)
                reject(apiResponse)
            }
            else {
                let apiResponse=response.generate(false,"blog Deleted Successfully",200,result);
                resolve(apiResponse)
            }
        })
      })   
}

     let fetch =()=>{
         return new Promise((resolve,reject)=>{
            BlogModel.find((err,result)=>{
                if(err){
                 logger.error('some error occured','get blog',9)
                 let apiResponse=response.generate(true,'some error occured',403,null)
                 reject(apiResponse)
                } else if (check.isEmpty(result)) {
                 let apiResponse = response.generate(true, 'No blog found', 404, null)
                 reject(apiResponse)
             } else {
                    let apiResponse=response.generate(false,"blogs are listed ",200,result);
                    resolve(apiResponse)
                }
            })
         })
     }


     remove(req, res)
     .then(fetch)
     .then((resolve) => {
         let apiResponse = response.generate(false, 'blog updated', 200, resolve)
         res.send(apiResponse)
     })
     .catch((err) => {
         console.log(err);
         res.send(err);
     })

}

let editBlog=(req,res)=>{
    let options=req.body;
    if (req.file) { options.productimage = req.file.path; }

    console.log(req.params.blogId)
    BlogModel.update({blogId:req.params.blogId},options,{multi:true}).exec((err,result)=>{
        if(err){
            logger.error('some error occured','update blog',6)
        let apiResponse=response.generate(true,'some error occured',403,null)
        res.send(apiResponse)
        } else if (check.isEmpty(result)) {
            let apiResponse = response.generate(true, 'blog not found', 404, null)
            res.send(apiResponse)
        } 
        else {
            logger.info('blog editted','editblog',0)
            let apiResponse=response.generate(false,"blog is updated Successfully",200,result);
            console.log(result)
            res.send(apiResponse)
        }
    })
}

let oneBlog=(req,res)=>{
    BlogModel.findOne({blogId:req.params.blogId},(err,result)=>{
        if(err){
            logger.error('some error occured','get one blog',9)
            let apiResponse=response.generate(true,'some error occured',403,null)
            res.send(apiResponse)
           } else if (check.isEmpty(result)) {
            let apiResponse = response.generate(true, 'No blog found', 404, null)
            res.send(apiResponse)
        } else {
               let apiResponse=response.generate(false,"blog is listed",200,result);
               res.send(apiResponse)
           }
    })
}

let allBlog=(req,res)=>{
    BlogModel.find((err,result)=>{
        if(err){
            logger.error('some error occured','get all blog',9)
            let apiResponse=response.generate(true,'some error occured',403,null)
            res.send(apiResponse)
           } else if (check.isEmpty(result)) {
            let apiResponse = response.generate(true, 'No blog found', 404, null)
            res.send(apiResponse)
        } else {
               let apiResponse=response.generate(false,"Blogs are listed",200,result);
               res.send(apiResponse)
           }
    })
}

module.exports = {

createBlog:createBlog,
deleteBlog:deleteBlog,
editBlog:editBlog,
oneBlog:oneBlog,
allBlog:allBlog

}// end e