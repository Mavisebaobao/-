let express=require("express");
//后台主路由
let admin=express.Router();

let post = require('../models/post');

let user = require('../models/user');

let multer=require("multer");

// let upload = multer({dest: 'public/admin/uploads/avatar'});


// 通过diskStorage实现目录位置和文件名的自定义操作

var storage=multer.diskStorage({
	//自定义目录
	destination:function(req,file,cb){
		cb(null,"public/admin/uploads/avatar");
	},
	filename:function(req,file,cb){

		let extname=file.originalname.slice(file.originalname.lastIndexOf("."));
		cb(null, file.fieldname + '-' + Date.now() + extname);
	}
})

var upload = multer({storage: storage});

admin.get("/",(req,res)=>{
	res.render("admin/index",{});
});
admin.get("/add",(req,res)=>{

	res.render("admin/add",{
		action:"/admin/add"
	});
});
//编辑操作

admin.get("/edit",(req,res)=>{

	post.find(req.query.id,(err,rows)=>{
		console.log(rows);
		if(!err){
			res.render("admin/add",{
				post:rows[0],
				action:"/admin/modify"
			})
		}
	});
});


//添加文章
admin.post("/add",(req,res)=>{
	//添加登录用户
	
	req.body.uid=req.session.loginfo.id;
		
	post.insert(req.body,(err)=>{
		if(!err){
			res.json({
				code:10000,
				msg:"添加成功！",
			});
		}
	
	})


})

//修改博客的内容
admin.post("/modify",(req,res)=>{
	let id=req.body.id;
	delete req.body.id;//从对象中删除id属性
	post.modify(id,req.body,(err)=>{
		if(!err){
			res.json({
				code:10000,
				msg:"修改成功！"
			})
		}
	})
})
//删除博客
admin.get("/delete",(req,res)=>{
	console.log(9999);
	post.delete(req.query.id,(err)=>{
		if(!err){
			res.json({
                code: 10000,
                msg: '删除成功!'
            });
		}
	})
})


// 修改密码
admin.get("/repass",(req,res)=>{
	res.render("admin/repass",{});
})
//文章列表
admin.get("/list",(req,res)=>{
	post.findAll((err,rows)=>{
		if(err){
			return req.send("数据库错误！");
		}
		console.log(rows);
		res.render("admin/list",{data:rows});
	})
});
	

//设置
admin.get("/settings",(req,res)=>{
	let id=req.session.loginfo.id;
	user.find(id,(err,rows)=>{
		if(!err){
			// console.log(rows);
			res.render("admin/settings",{
				data:rows[0]
			});
		}
	})
	
})
//更新个人资料
admin.post("/updata",(req,res)=>{
	let id=req.session.loginfo.id;
	console.log(req.body);
	user.updata(id,req.body,(err,data)=>{
		if(!err){
			res.json({
				code:10000,
				msg:"个人资料更新成功！"
			})
		}
	}) 

})

//退出登录
admin.get("/logout",(req,res)=>{
	req.session.loginfo=null;
	// res.redirect("/login"); //与下面的功能一样
	res.render("home/login",{})
})

//头像上传
admin.post("/upfile",upload.single('avatar'),(req,res)=>{
	// console.log(req.file);
	res.json({
		code:10000,
		msg:"上传成功！",
		path:req.file.path
	});
})

module.exports=admin;
