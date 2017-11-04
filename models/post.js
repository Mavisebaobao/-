let db=require("./db");

// 插入数据

exports.insert=(data,cb)=>{
	let query="insert into posts set ?";
	var a=db.query(query,data,(err)=>{
		if(err){
			return cb(err);
		}
		cb(null);
	})
	// console.log(a.sql);
}

exports.findAll=(...args)=>{

	let query, offset, pageSize, cb;
	if(args.length==1&& typeof(args[0])==='function'){
		
		 query = 'select posts.id,posts.title from posts left join users on posts.uid = users.id';
		//第一个参数就是回调函数
		cb=args[0];
	}else{
		//传入三个参数的时候
		//参数的第一个是每页的条数
		pageSize=args[0];
		//第二个参数是当前第几页
		page=args[1];
		//第三个参数是回调函数
		cb=args[2];

		//计算页码数据的起始位置
		offset=(page-1)*pageSize;
		query="select posts.id,posts.title,posts.time,posts.brief,users.name from posts left join users on posts.uid=users.id limit ?,?";

	}
	var a=db.query(query,[offset,pageSize],(err,rows)=>{
		if(err){
			return cb(err);
		}
		cb(null,rows);
	})
	// console.log(a.sql);
}

//查找单条数据

module.exports.find=(id,cb)=>{
	
	let query = 'select posts.id,posts.title,posts.brief, posts.content from posts left join users on posts.uid = users.id where posts.id = ?';
	db.query(query,id,(err,rows)=>{
		if(err){
			return cb(err);
		}
		cb(null,rows);
	})
}
module.exports.detail=(id,cb)=>{

	let query = 'select * from posts left join users on posts.uid = users.id where posts.id = ?';
	db.query(query,id,(err,rows)=>{
		if(err){
			return cb(err);
		}
		cb(null,rows);
	})
}
//删除一条数据
module.exports.delete=(id,cb)=>{
	let query="delete from posts where id=?";
	db.query(query,id,(err)=>{
		if(err){
			return cb(err);
		}
		cb(null)
	})
}
//更新文章的内容
module.exports.modify=(id,data,cb)=>{
	let query="update posts set ? where id=?";
	var a=db.query(query,[data,id],cb);
	console.log(a.sql)
}

//查询
exports.count=function(cb){
	let query="select count(*) as total from posts";
	db.query(query,(err,rows)=>{
		if(err){
			return cb(err);
		}
		cb(null,rows[0]);
	})
}
