const Router = require("koa-router"),
	router = new Router(),
	cookieHandler = require("../util/cookieHandler"),
    sqlParser = require("../util/sqlParser"),
    handler = require("../DB/handler"),
    isType = require("../util/isType"),
    moment = require("moment"),
    excelexport = require("excel-export");


router.use(async (ctx,next)=>{

    if(cookieHandler.getCookie(ctx,"id")){
        try{
            await next()
        }catch (e) {
            console.log(e)
            let status = 0
            switch (e.status){
                case 500:
                    status = 3000
                    break;
                case 404:
                    status = 5000
                    break;
                case 501:
                    status = 6000
                    break;
                default:
                    status = 4000
                    break;
            }
            ctx.redirect("/error/"+status)
        }
    }else{
        ctx.redirect("/login")
    }
})
router.get("/teacher/:id",async (ctx,next)=>{
    let teacher = {}
    let id = ctx.params.id
    let data = []
    if(! parseInt(id)){
        ctx.throw(500,"传入的id不正确！")
    }else
        data[0] = parseInt(id)
    let sql = sqlParser.findTeacherS("")
    await handler.findTeacher(sql,data).then(res=>{
        if(res.length > 0 && res[0]){
            for(var key in res[0]){
                teacher[key] = res[0][key]
            }
        }else{
            ctx.throw(404,"Not Found")
        }
    }).catch(err=>{
        console.log(err)
        ctx.throw(501,"其他内部错误")
    })

    await ctx.render("teacher/teacher.html",{teacher})
})
router.post("/dorepaire",async (ctx,next)=>{
    let {id,newpassword,confirmpassword}= ctx.request.body
    let p_type = parseInt(cookieHandler.getCookie(ctx,"type"))
    let sql_parser = sqlParser.repaire(isType.func(p_type))
    let msg = {
        status:0,
        msg:""
    }
    let data = [
        newpassword,
        id
    ]
    if(newpassword === confirmpassword ){
        await handler.repaireTeacher(sql_parser,data).then(res=>{
            if(res.affectedRows > 0){
                msg.status = 200
                msg.msg = "修改成功"
                ctx.set("Content-Type","application/json")
                ctx.response.status = 200
                ctx.body = msg
            }
        }).catch(err=>{
            console.log(err)
            ctx.throw(501,"修改密码时数据库内容错误!")
        })
    }else{
        msg.status = 401
        msg.msg = "两次密码不相同！"
        ctx.set("Content-Type","application/json")
        ctx.response.status = 401
        ctx.body = msg
    }
})

router.get("/course",async (ctx,next)=>{

    let id = parseInt(cookieHandler.getCookie(ctx,"id"))
    let teacher = {
        name:"",
        id:id
    }
    let classtableArr = []
    let p_type = parseInt(cookieHandler.getCookie(ctx,"type"))
    let findName_sql = sqlParser.findTeacherName(isType.func(p_type))
    let teacherclassTable_sql = sqlParser.findTeacherClasstable("")
    let data = [id]
    let findNamehandlerPromise = handler.findTeacherName(findName_sql,data)
    let classTablehandlerPromise = handler.findClassTable(teacherclassTable_sql,data)
    let classTable = []
    await Promise.all([findNamehandlerPromise,classTablehandlerPromise]).then(res=>{
        for(let i=0;i<res.length;i++){
            if(i === 0)
                teacher.name = res[i][0]["name"]
            else
                classtableArr = res[i]
        }
        for(let i=1; i<5; i++){
            classTable[i-1] = []
            for(let j=1;j<6;j++){
                classTable[i-1][j-1] = {}
            }
        }
        for(let k=0;k<classtableArr.length;k++){
            let i = classtableArr[k]["muchID"]
            let j = classtableArr[k]["weekID"]
            classTable[i-1][j-1] = classtableArr[k]
        }
    }).catch(err=>{
        console.log(err)
    })
    await ctx.render("teacher/course.html",{
        teachers:{
            teacher,
            classTable
        }
    })
})


router.get("/teacher/:id/message",async (ctx,next)=>{

    let id = parseInt(cookieHandler.getCookie(ctx,"id"))
    id = parseInt(id)
    let teacher = {
        name:"",
        id:id
    }
    let p_type = parseInt(cookieHandler.getCookie(ctx,"type"))
    let findName_sql = sqlParser.findTeacherName(isType.func(p_type))
    let findNamehandlerPromise = handler.findTeacherName(findName_sql,[id])


    //查看留言
    let findMessage_sql = sqlParser.findMessage(isType.func(p_type))
    let findMessageHandler = handler.findMessage(findMessage_sql,[id])

    let messaages = []

    await Promise.all([findNamehandlerPromise,findMessageHandler]).then(res=>{
        if(res.length >0 && res[0][0]){
            teacher.name = res[0][0]["name"]
            if(res[1].length >0){
                for(let i=0;i<res[1].length;i++){
                    res[1][i]["time"] = moment(parseInt(res[1][i]["time"])).format('YYYY-MM-DD HH:mm:ss')
                }
                messaages = res[1]
            }
        }
        console.log(res)
    }).catch(err=>{
        console.log(err)
    })
    teacher.messages = messaages
    await ctx.render("teacher/message.html",{teacher})
})

router.get("/teacher/:id/lookevaluato",async (ctx,next)=>{
    let id = parseInt(cookieHandler.getCookie(ctx,"id"))
    id = parseInt(id)
    let teacher = {
        name:"",
        id:id
    }
    let p_type = parseInt(cookieHandler.getCookie(ctx,"type"))
    let findName_sql = sqlParser.findTeacherName(isType.func(p_type))
    let findNamehandlerPromise = handler.findTeacherName(findName_sql,[id])

    // //得到系名
    // let getDepartment_sql = sqlParser.findDepartment()
    // let getDepartmentHandler = handler.getDepartment(getDepartment_sql,[])

    // //得到全部班级评价
    // let getAllClassesEvaluato_sql = sqlParser.getAllClassesEvaluato()
    // let getAllClassesEvaluatoHandler = handler.getAllClassesEvaluato(getAllClassesEvaluato_sql,[])

    //得到全部上过我的课的学生的评价
    let getAllReadyClassEvaluato_sql = sqlParser.getAllReadyClassEvaluato()
    let getAllReadyClassEvaluatoHandler = handler.getAllReadyClassEvaluato(getAllReadyClassEvaluato_sql,[id])
    let handlers = [findNamehandlerPromise,getAllReadyClassEvaluatoHandler]

    let allGrade = []

    let getAllGrade = [[]]

    let container = []

    let map = new Map()

    await Promise.all(handlers).then(res=>{
        if(res.length >0 && res[0][0]){
            teacher.id = id
            teacher.name = res[0][0]["name"]
            allGrade = res[1]
            for(let i=0;i<allGrade.length;i++){

                    let flag = 0

                    for(let j=0;j<getAllGrade.length;j++){

                        if(!getAllGrade[j]["courseID"] && j===0){


                            getAllGrade.splice(getAllGrade[j],1)

                            getAllGrade.push(allGrade[i])

                            map.set(allGrade[i]["courseID"],[])

                            map.get(allGrade[i]["courseID"]).push(allGrade[i])

                        }else if(getAllGrade[j]["courseID"] === allGrade[i]["courseID"]){

                            map.get(allGrade[i]["courseID"]).push(allGrade[i])

                            break;

                        }else{
                            flag++;
                        }
                    }
                    if(flag === getAllGrade.length){

                        map.set(allGrade[i]["courseID"],[])

                        map.get(allGrade[i]["courseID"]).push(allGrade[i])

                        getAllGrade.push(allGrade[i])

                    }
                }

               map.forEach((index,m)=>{
                   let grade = {
                       courseName:map.get(m)[0]["courseName"],
                       avg:0,
                       sum:0,
                       count:0,
                       courseID:m
                   }
                   for (let i=0;i<map.get(m).length;i++){
                       grade.sum +=map.get(m)[i]["sumGrade"]
                       grade.count += 1;
                   }
                   grade.avg = Math.ceil(grade.sum / grade.count);
                   container.push(grade)
               })
             teacher.grade = container;
            }
        }).catch(err=>{
            console.log(err)
        })

    await ctx.render("teacher/lookEvaluato.html",{teacher})
})

router.get("/exportmyinfo/:id",async (ctx,next)=>{
    let id = ctx.params.id
    let teacher = {}
    let data = []
    if(! parseInt(id)){
        ctx.throw(500,"传入的id不正确！")
    }else
        data[0] = parseInt(id)
    let sql = sqlParser.findTeacherS("")
    await handler.findTeacher(sql,data).then(res=>{
        if(res.length > 0 && res[0]){
            for(var key in res[0]){
                teacher[key] = res[0][key]
            }
        }else{
            ctx.throw(404,"Not Found")
        }
    }).catch(err=>{
        console.log(err)
        ctx.throw(501,"其他内部错误")
    })
    console.log(teacher)

    //下载个人资料
    let conf ={};
    conf.stylesXmlFile = "public/xml/styles.xml";
    conf.name = "mysheet";
    conf.cols = [{
        caption:'id',
        type:'number',
        width:28.7109375
    },{
        caption:'姓名',
        type:'string',
        width:28.7109375
    },{
        caption:'性别',
        type:'number',
        width:28.7109375
    },{
        caption:'电话号码',
        type:'string',
        width:28.7109375
    },{
        caption:'地址',
        type:'string',
        width:28.7109375
    },{
        caption:'年龄',
        type:'number',
        width:28.7109375
    }];
    let t = [];
    for( let val in teacher){
        t.push(teacher[val])
    }
    conf.rows = [
        t
    ];
    let result = excelexport.execute(conf);
    ctx.status = 200;
    ctx.set('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
    ctx.set("Content-Disposition", "attachment; filename=myinfo.xlsx");
    ctx.res.end(result,"binary");
})

module.exports = router.routes()