let Koa = require("koa2"),
	Router = require("koa-router"),
	app = new Koa(),
	router = new Router(),
	login = require("./routers/login.js"),
	bodyParser = require("koa-bodyparser"),
	static = require("koa-static"),
	student = require("./routers/student"),
	teacher = require("./routers/teacher"),
	manager = require("./routers/manager"),
    render = require('koa-art-template'),
	error = require("./routers/error"),
	path = require("path"),
	exit = require("./routers/exit"),
    teachEvaluation = require('./routers/teachEvaluation');

//---使用bodyparser中间件---//
app.use(bodyParser())

//---静态文件---//
app.use(static(__dirname+"/public/"))

//----模板引擎---//
render(app,{
    root:path.join(__dirname,'views'),
    extname:'.html',
    debug:process.env.NODE_ENV !=='production'
})

//-----错误处理中间件----//
app.use(async (ctx,next)=>{
	try {
		await next()
	} catch(err) {
		//全局错误处理
		console.log(err)
	}
})
//------登陆处理----//
router.use('/login',login)

//------学生模块---//
router.use('/students',student)

//------教师模块---//
router.use('/teachers',teacher)

//------管理员模块---//
router.use('/managers',manager)

//------出错模块---//
router.use('/error',error)

//------退出模块---//
router.use('/exit',exit)

//教学质量评价模块
router.use('/teachevaluation',teachEvaluation);


app.use(router.routes()).use(router.allowedMethods());

//-----服务端监听----//
app.listen("8080",function(){
	console.log("web服务开启成功，监听在127.0.0.1:8080......")
});

