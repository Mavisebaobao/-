let express =require("express");
let app=express();;
app.listen(3000);
app.set("views","./views");
app.set("view engine","xtpl");
//引入中间插件 express-session
let session=require('express-session');

app.use(session({
	  secret: 'fad',
    resave: false,
    saveUninitialized: false
}))
//引入处理postq请求方式的bodt-parser
let bodyParser=require("body-parser");

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static('./public'));


//如果public那么还在public下面去找
// 当访问 /public 时，去public中查找资源
app.use('/public', express.static('./public'));



//自定义一个中间件 用来判断是不是已经登录
app.use("/admin",(req,res,next)=>{
	if(!req.session.loginfo&&req.url!="/login"){
		return res.redirect("/login");
	}
	next();
})


let admin=require("./routes/admin");
let home=require("./routes/home");

app.use("/admin",admin);
app.use("/",home);