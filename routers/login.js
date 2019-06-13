const Router = require("koa-router"),
	router = new Router(),
	errFunc = require("../util/error.js"),
	sqlParser = require("../util/sqlParser"),
	handler = require("../DB/handler"),
	isType = require("../util/isType"),
	cookieHandler = require("../util/cookieHandler");


router.use(async (ctx,next)=>{
	try {
		await next()
		} catch(err) {
			switch (err.status) {
				case 401:
					ctx.set("Content-Type","application/json") 
					ctx.response.status = 401
					var m =  {
						ms:err.ms,
						state:err.state,
						descriptions:err.descriptions
					}
					ctx.body = m 
					break;
				default:
					console.log(err)
					break;
			}
		}
})

router.post('/dologin',async (ctx,next)=>{

	if (ctx.request.method !== 'POST')
		ctx.throw(401)

	let p_type = parseInt(ctx.request.body.type)
	sql_parser = sqlParser.login(isType.func(p_type))
	uid = parseInt(ctx.request.body.username)
	console.log(uid)
	let data = [
		uid,
		ctx.request.body.password,
	]
	await handler.doLogin(sql_parser,data).then(res=>{
		if(res[0] && res.length > 0){
			cookieHandler.setCookie(ctx,{
				key:"id",
				val:uid
			})
            cookieHandler.setCookie(ctx,{
                key:"type",
                val:p_type
            })
			let return_data = {
				path:'',
				status:200
			}
			switch (p_type) {
				case 1:
						return_data.path = '/students/stud/'+uid
						break;
				case 2:
                    	return_data.path = '/teachers/teacher/'+uid
						break;
				case 3:
                    	return_data.path = '/managers/man/'+uid
						break;
			}
            ctx.response.status = 200
			ctx.set("Content-Type","application/json")
			ctx.body =return_data
		}else{
			ctx.throw(401)
		}
	}).catch(err=>{
		console.log(err)
		ctx.throw(401,{
				ms:"账户或者密码错误",
				state:1000,
				descriptions:"请检查自己的账户密码!"
			}
		)
	})
})

router.get("/",async (ctx,next)=>{
	await ctx.render("login/login.html")
})



module.exports = router.routes()


