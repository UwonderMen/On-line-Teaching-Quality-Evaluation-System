const Router = require("koa-router"),
    cookieHandler = require("../util/cookieHandler"),
    router = new Router();


router.use(async (ctx,next)=>{

    if(cookieHandler.getCookie(ctx,"id")){
        await next()
    }else{
        ctx.redirect("/login")
    }
})

router.get("/:status",async (ctx,next)=>{
    let html = ""
    let err = {
        ms:"",
        status:0,
        descriptions:"",
        help:""
    }
    switch (parseInt(ctx.params.status)){
        case 3000:
            err.ms = "错误的id，请确认后在传入，否则以为您是想sql注入！"
            err.descriptions = "非法id"

            html = "error/parser_error.html"
            break;
        case  4000:
            err.ms = "内部错误"
            err.descriptions = "内部错误"
            err.help = "请及时与官方人员联系，联系qq：1032869676@qq.com"
            html = "error/inside_error.html"
        case  5000:
            err.ms = "没有找到"
            err.descriptions = "not found this id"
            err.help = "请及时联系管理员，联系qq：1032869676@qq.com"
            html = "error/notFound.html"
        case  6000:
            err.ms = "修改密码时内部错误"
            err.descriptions = "FATAL"
            err.help = "请及时联系管理员，联系qq：1032869676@qq.com"
            html = "error/other_error.html"
        default:
            html = "error/other_error.html"
    }
    err.status = parseInt(ctx.params.status)
    await ctx.render(html,{err})
})


module.exports = router.routes()