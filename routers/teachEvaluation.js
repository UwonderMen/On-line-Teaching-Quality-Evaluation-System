const Router = require("koa-router"),
    router = new Router(),
    cookieHandler = require("../util/cookieHandler"),
    sqlParser = require("../util/sqlParser"),
    handler = require("../DB/handler"),
    isType = require("../util/isType"),
    moment = require("moment");


router.use(async (ctx,next)=>{
    if(cookieHandler.getCookie(ctx,"id")){

        await next()
    }else{
        ctx.redirect("/login")
    }
})

router.post("/",async (ctx,next)=>{

    let path = ctx.request.header.referer;
    console.log(ctx.request)
    let {grade,teacherID,studentID,courseID,msg,number} = ctx.request.body
    msg = msg.trim()
    let isSendMsg = 0

    //发送留言
    if(msg !== "")
        isSendMsg = 1

    let ismarked = 1
    teacherID = parseInt(teacherID)
    studentID = parseInt(studentID)
    courseID = parseInt(courseID)
    let dataStr = ""
    let numStr = ""
    let time = (new Date()).getTime()
    console.log(time+"时间戳")
    for(let i=0;i<grade.length;i++){
        dataStr += grade[i]+"|"
        numStr += number[i]+"|"
    }

    let addTeachEvaluate_sql = sqlParser.addTeachEvaluate(teacherID,studentID,courseID,ismarked,isSendMsg,dataStr,numStr,msg,time)

    let addTeachEvaluateHandler = handler.addTeachEvaluate(addTeachEvaluate_sql,[])

    await Promise.all([addTeachEvaluateHandler]).then(res=>{
        console.log(res[0][0][0])
        if(res[0][0][0]["t_error"] === 0){
            ctx.response.status = 200
            ctx.body = {
                status:200,
                msg:"评教成功",
                data:"",
                path:path
            }
        }
    }).catch(err=>{
        console.log(err);
        ctx.throw(501,"增加教学评价失败")
    })

})

module.exports = router.routes()