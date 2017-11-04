let db=require("./db");

//插入用户
exports.insert=function(data,cb){
	let query="insert into users set ?";
	//密文处理
	data.pass=db.md5(data.pass);
	//执行sql语句
	db.query(query,data,(err)=>{
		if(err){
			//如果有错误则返回 不在往下执行，，
			return cb(err);
		}
		cb(null);
	})
}
exports.auth=function(email,password,cb){
	let query="select * from users where email=?";
	db.query(query,email,(err,rows)=>{
		if(err){
			return cb(err);
		}
		//如果登陆成功
		if(rows[0].pass==db.md5(password)){
			return cb(null,rows[0]);
		}
		// 如果密码不正确
		cb({msg:"用户或者密码错误"});
	})	

}
module.exports.find=(id,cb)=>{
	let query="select * from users where id= ?";
	db.query(query,id,(err,rows)=>{
		if(err){
			return cb(err);
		}
		cb(null,rows);
	})
}

module.exports.updata=(id,data,cb)=>{
	let query="update users set ? where id=?";
	var a=db.query(query,[data,id],(err,rows)=>{
		if(err){
			return cb(err);
		}
		cb(null,rows);
	})
	// console.log(a.sql);
}


