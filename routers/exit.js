const Router = require("koa-router"),
    router = new Router(),
   cookieHandler = require("../util/cookieHandler");


router.use(async (ctx,next)=>{
    if(cookieHandler.getCookie(ctx,"id")){
        await next()
    }else{
        ctx.redirect("/login")
    }
})

router.get("/",async (ctx,next)=>{
    cookieHandler.modifyCookieConfig({maxAge:-1},"id",ctx)
    cookieHandler.modifyCookieConfig({maxAge:-1},"type",ctx)
    ctx.redirect(ctx.request.header.referer)
})

module.exports = router.routes()