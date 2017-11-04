let express=require("express");

let moment=require("moment");
moment.locale('en', {
    longDateFormat : Object
});

let user=require("../models/user");

let  post=require("../models/post");

let home=express.Router();

home.get("/",(req,res)=>{

	//每页显示的条数
	let pageSize=2;

	//当前的页数 参数
	let page=req.query.page||1;


	////总共多少页  总条数/每页的条数
	post.count((err,rows)=>{
		if(err){
			return;
		}
		//获得总条数
		let total=rows.total;

		//总的页数
		let pages=Math.ceil(total/pageSize);

		post.findAll(pageSize,page,(err,rows)=>{	
		// console.log(rows);
			for(var i=0;i<rows.length;i++){
				rows[i].time=moment().format("YYYY-D-M");
				// console.log(rows[i].time);
			}
			if(!err){
				res.render("home/index",{
					posts:rows,
					pages:pages,
					page:page
				});
			}
		
		})
	})

});
home.get("/article",(req,res)=>{
	console.log(req.query.id);
	 // 根据文章id获得文件信息
    post.detail(req.query.id, (err, rows) => {
        if(!err) {
            console.log(rows[0])
            res.render('home/article', {post: rows[0]});
        }
    });
	

})
//登录
home.get("/login",(req,res)=>{
	res.render("home/login",{});

})
home.post("/login",(req,res)=>{
	// console.log(req.body);
	user.auth(req.body.email,req.body.pass,(err,rows)=>{
		if(!err){
			req.session.loginfo=rows;
			// console.log(req.session);
			res.json({
				code:10000,
				msg:"登录成功！"
			})
		}
	})
})

//注册
home.get("/register",(req,res)=>{
	res.render("home/register",{});

})
home.post("/register",(req,res)=>{
	// console.log(req.body);
	user.insert(req.body,(err)=>{
		if(!err){
			res.json({
				code:10000,
				msg:"添加成功"
			});
		}
	})
})

//关于我们
home.get("/about",(req,res)=>{
	res.render("home/about",{});

})

//中心
home.get("/center",(req,res)=>{
	res.render("home/center",{});

})
//加入
home.get("/join",(req,res)=>{
	res.render("home/join",{});

})

module.exports=home;