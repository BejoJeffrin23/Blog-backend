const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

  let blogSchema= new Schema({
      title:{
        type:String,
        default:''
      },
      authorName:{
        type:String,
        default:''
      },
      description:{
        type:String,
        default:''
      },
      authorId: {
        type: String,
        default: ''
      },
      blogId: {
        type: String,
        default: '',
        index: true,
        unique: true
      },
      content:{
        type: String,
        default: ''
      },
      createdOn:{
        type:Date
      },
      productimage:{
        type:String
      },
  })

  mongoose.model('BlogModel', blogSchema);