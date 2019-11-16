const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const blogController = require("./../../app/controllers/blogController");
const appConfig = require("./../../config/appConfig")
const auth = require("./../../app/middlewares/auth")
const multer=require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+ file.originalname)
    }
})
const upload = multer({
storage:storage,
 limits: {
        fileSize: 1024 * 1024 * 5
    }
})

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;

    // defining routes.


    // params: firstName, lastName, email, mobileNumber, password
    app.post(`${baseUrl}/signup`, userController.signUpFunction);

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/login api for user login.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Login Successful",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUertyuiopojhgfdwertyuVCJ9.MCwiZXhwIjoxNTIwNDI29tIiwibGFzdE5hbWUiE4In19.hAR744xIY9K53JWm1rQ2mc",
                "userDetails": {
                "mobileNumber": 2234435524,
                "email": "someone@mail.com",
                "lastName": "Sengar",
                "firstName": "Rishabh",
                "userId": "-E9zxTYA8"
            }

        }
    */

    // params: email, password.
    app.post(`${baseUrl}/login`, userController.loginFunction);

    /**
     * @apiGroup users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/logout to logout user.
     *
     * @apiParam {string} userId userId of the user. (auth headers) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Logged Out Successfully",
            "status": 200,
            "data": null

        }
    */

    // auth token params: userId.
    app.post(`${baseUrl}/logout`,auth.isAuthorized, userController.logout);
/**
  * @apiGroup User
  * @apiVersion  1.0.0
  * @api {post} /api/v1/users/logout to logout user.
  *    
  * @apiSuccess {object} myResponse shows error status, message, http status code, result.
  * 
  * @apiSuccessExample {object} Success-Response:
      {
         "error": false,
         "message": "Logged Out Successfully",
         "status": 200,
         "data": null

     }
     * @apiErrorExample {json} Error-Response:
     *
     * {
         "error": true,
         "message": "Error message",
         "status": 500/404/403,
         "data": null
        }
 */

 app.post(`${baseUrl}/create`,upload.single('productimage'),blogController.createBlog)
  /** 
     * @apiGroup Blog
     * @apiVersion 1.0.0
     * @api {post} /api/v1/users/create Create Blog
     * 
     * @apiParam {string} title Title of the blog. (body params) (required)
     * @apiParam {string} description description of the blog. (body params) (required)
     * @apiParam {string} content content of the blog. (body params) (required)
     * @apiParam {string} productimage Image of the blog. (body params) (required)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     *
     *  @apiSuccessExample {json} Success-Response:
     *  {
            "error": false,
            "message": "Blog created successfully",
            "status": 200,
            "data": {
                        authorName: "Ashok"
                        createdOn: "2019-09-01T10:21:42.000Z"
                        description: "blog is solved"
                        blogId: "Sg7SdDAC2_"
                        title: "Issue"
                        productimage: ["uploads\1545465302072image"]
                    }
            }
     * @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured",
	    "status": 500/404,
	    "data": null
	   }
    */

 app.post(`${baseUrl}/delete`,blogController.deleteBlog)
  /** 
     * @apiGroup Blog
     * @apiVersion 1.0.0
     * @api {post} /api/v1/users/delete Delete a blog
     *
     * @apiParam {string} blogId Id of the blog. (body params) (required)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
            "error": false,
            "message": "blog deleted successfully",
            "status": 200,
            "data": null
            }
     * @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured",
	    "status": 500/404,
	    "data": null
	   }
    */


 app.put(`${baseUrl}/:blogId/edit`, upload.single('productimage'),blogController.editBlog)
    /** 
     * @apiGroup Blog
     * @apiVersion 1.0.0
     * @api {put} /api/v1/users/:blogId/edit Edit a blog
     * 
     * @apiParam {string} blogId Id of the blog. (query params) (required)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     *
     *  @apiSuccessExample {json} Success-Response:
     *  {
            "error": false,
            "message": "Issue edited successfully",
            "status": 200,
            "data": {
                        authorName: "Ashok"
                        createdOn: "2019-09-01T10:21:42.000Z"
                        description: "blog is solved"
                        blogId: "Sg7SdDAC2_"
                        title: "Issue"
                        productimage: ["uploads\1545465302072image"]
                    }
            }
     * @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured",
	    "status": 500/404,
	    "data": null
	   }
    */

    

 app.get(`${baseUrl}/get/:blogId`,blogController.oneBlog)
   /** 
     * @apiGroup Blog
     * @apiVersion 1.0.0
     * @api {get} /api/v1/users/get/:blogId Fetch a particular blog
     * 
     * @apiParam {string} blogId Id of the blog. (query params) (required)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     *
     *  @apiSuccessExample {json} Success-Response:
     *  {
            "error": false,
            "message": "Blog fetched successfully",
            "status": 200,
            "data": {
                       
                        authorName: "Ashok"
                        createdOn: "2019-09-01T10:21:42.000Z"
                        description: "blog is solved"
                        blogId: "Sg7SdDAC2_"
                        title: "Issue"
                        productimage: ["uploads\1545465302072image"]
                    }
            }
     * @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured",
	    "status": 500/404,
	    "data": null
	   }
    */
 app.get(`${baseUrl}/all`,blogController.allBlog)
   /** 
     * @apiGroup Blog
     * @apiVersion 1.0.0
     * @api {get} /api/v1/users/all Get All Blogs
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     *  @apiSuccessExample {json} Success-Response:
     *  {
            "error": false,
            "message": "All blogs fetched successfully",
            "status": 200,
            "data": [{
                       
                        createdOn: "2019-09-01T10:21:42.000Z"
                        description: "blog is solved"
                        blogId: "Sg7SdDAC2_"
                        title: "Issue"
                        productImage: ["uploads\1545465302072image"]
                        authorName: "Shiva"
                        content:"hello"
                    }]
            }
     * @apiErrorExample {json} Error-Response:
	 *
	 * {
	    "error": true,
	    "message": "Error Occured",
	    "status": 500/404,
	    "data": null
	   }
    */
    
}
