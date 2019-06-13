const Router = require("koa-router"),
	router = new Router(),
	cookieHandler = require("../util/cookieHandler"),
    sqlParser = require("../util/sqlParser"),
    handler = require("../DB/handler"),
    isType = require("../util/isType"),
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

router.get("/course",async (ctx,next)=>{
	let id = parseInt(cookieHandler.getCookie(ctx,"id"))
    let stud = {
        name:"",
        id:id
    }
    let table = []
    let classtableArr = []
	let p_type = parseInt(cookieHandler.getCookie(ctx,"type"))
	let findName_sql = sqlParser.findstudentName(isType.func(p_type))
	let classTable_sql = sqlParser.findClasstable("")
	let data = [id]
	let findNamehandlerPromise = handler.findStudentName(findName_sql,data)
	let classTablehandlerPromise = handler.findClassTable(classTable_sql,data)
    let classTable = []
	await Promise.all([findNamehandlerPromise,classTablehandlerPromise]).then(res=>{
		for(let i=0;i<res.length;i++){
			if(i === 0)
                stud.name = res[i][0]["name"]
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

    await ctx.render("student/course.html",{
    	student:{
    		stud,
            table:classTable
		}
    })
})

router.get("/stud/:id",async (ctx,next)=>{
	let student = {}
	let id = ctx.params.id
	if(! parseInt(id))
		ctx.throw(500,"传入的id不正确！")
    let sql = sqlParser.findStudentS("")
    let session_sql = sqlParser.findsessionS()
    let session_id = null;
    await handler.findStudent(sql,[parseInt(id)]).then(res=>{
		if(res.length > 0 && res[0]){
			for(var key in res[0]){
				student[key] = res[0][key]
			}
		}else{
			ctx.throw(404,"Not Found")
		}
	}).catch(err=>{
		console.log(err)
		ctx.throw(501,"其他内部错误")
	})

    session_id = student["session"]
    await handler.findStudentSession(session_sql,[session_id]).then(res=>{
        if(res.length > 0 && res[0]){
            student.session_name = res[0]["session"]
        }else{
            ctx.throw(404,"Not Found")
        }
    })
    await ctx.render("student/student.html",{student})
})

router.post("/domodifyinfo",async (ctx,next)=>{
    let {name,sex,phone,qq,email,address,descriptions} = ctx.request.body
    let id = parseInt(cookieHandler.getCookie(ctx,"id"));
    let update_sql = sqlParser.updateS();
    let trim_space = function(){
            let res = [].slice.call(arguments);
            let result = [];
            for(let i=0 ;i <res.length; i++){
                res[i] = res[i].trim();
                if(i === 3)
                    res[i] = parseInt(res[i]);

                result.push(res[i]);
            }
            return result;
    };
    let data = trim_space(name,sex,phone,qq,email,address,descriptions);
    data.push(id)
    await handler.updateStudent(update_sql,data).then(res=>{
        if(res.affectedRows > 0){
            ctx.set("Content-Type","application/json");
            ctx.status = 200;
            ctx.redirect("/students/stud/"+id);
        }
    })
})

router.get("/:id/modifyinfo",async (ctx,next)=>{
    let student = {}
    let id = ctx.params.id
    if(! parseInt(id))
        ctx.throw(500,"传入的id不正确！")
    let sql = sqlParser.findStudentS("")
    let session_sql = sqlParser.findsessionS()
    let session_id = null;
    await handler.findStudent(sql,[parseInt(id)]).then(res=>{
        if(res.length > 0 && res[0]){
            for(var key in res[0]){
                student[key] = res[0][key]
            }
        }else{
            ctx.throw(404,"Not Found")
        }
    }).catch(err=>{
        console.log(err)
        ctx.throw(501,"其他内部错误")
    })

    session_id = student["session"]
    await handler.findStudentSession(session_sql,[session_id]).then(res=>{
        if(res.length > 0 && res[0]){
            student.session_name = res[0]["session"]
        }else{
            ctx.throw(404,"Not Found")
        }
    })
    await ctx.render("student/modify.html",{student})
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
        await handler.repaireStudent(sql_parser,data).then(res=>{
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


router.get("/getTip",async (ctx,next)=>{
    let getTips_parser = sqlParser.getTips()
	let tipHandler = handler.tip(getTips_parser,[])

	await Promise.all([tipHandler]).then(res=>{
		if(res.length > 0 && res[0][0]["isPublish"] === 1 ){
            ctx.set("Content-Type","application/json")
            ctx.response.status = 200
            ctx.body = {
            	status:200,
				msg:"查询成功"
			}
		}
	}).catch(err=>{
        console.log(err)
        ctx.throw(501,"查询提示信息出错")
	})
})

router.get("/tips",async (ctx,next)=>{
    let id = parseInt(cookieHandler.getCookie(ctx,"id"))
    let p_type = parseInt(cookieHandler.getCookie(ctx,"type"))
    let findName_sql = sqlParser.findstudentName(isType.func(p_type))
    let findNamehandlerPromise = handler.findStudentName(findName_sql,[id])

    //查询自己属于哪个系//查询自己属于哪一届
    let findStudentSaD_sql = sqlParser.findStudentSaD()
    let findStudentSaDHandler = handler.findStudentSaD(findStudentSaD_sql,[id])
    let student = {};
    let date = new Date();
    let time = date.getFullYear();
    let timestamp = date.valueOf();
    let findPublish_sql = sqlParser.findPublish();
    let  info  = {};
    let msg = null;
	await Promise.all([findNamehandlerPromise,findStudentSaDHandler]).then(res=>{
        if(res.length){
            student.name = res[0][0]["name"];
            info = res[1][0]
            return handler.findPublish(findPublish_sql,[info.sessionid,info.depid,time])
        }
	}).then(res=>{
	    console.log(res)
	   if(res.length){
	       let start_time = parseInt(res[0]["starttime"])
	       let end_time = parseInt(res[0]["endtime"])
           if(timestamp > (end_time-start_time)){
                msg = {
                    path:"/students/stud/"+id+"/evaluate",
                    msg:res[0]["msg"],
                    tips:res[0]["tip"],
                }
           }else{
               msg = {
                   path:"",
                   msg:"对不起，你所访问的地址还没开通或者连接已经过期",
                   tips:"连接已失效或者还没开始",
               }
           }
       }else{
           msg = {
               path:"",
               msg:"对不起，你所访问的地址还没开通或者连接已经过期",
               tips:"连接已失效或者还没开始",
           }
       }

    }).catch(err=>{
        console.log(err)
        ctx.throw(501,"查询提示信息出错")
	})
    student.id = id;
	student.msg = msg;

	await ctx.render("student/tips.html",{student})
})

router.get("/stud/:id/evaluate",async (ctx,next)=>{
    let id = parseInt(cookieHandler.getCookie(ctx,"id"))
    let p_type = parseInt(cookieHandler.getCookie(ctx,"type"))
    let findStudent_sql = sqlParser.findStudentS(isType.func(p_type))
    let data = [id]
    let findStudentlerHandler = handler.findStudent(findStudent_sql,data)

    let findGradeTable_sql = sqlParser.findGradeTable()
    let findGradeTableAll = handler.findGradeTableAll(findGradeTable_sql,[])

    //返回发布需要的信息
    let getPublishInformation_sql = sqlParser.getPublishInformation()
    let getPublishHandler= handler.getPublishTableAll(getPublishInformation_sql,[])

    //获取达到等级
    let getAssessLevel_sql = sqlParser.getAssessLevel()
    let getAssessLevelTableAllHandler = handler.getAssessLevelTableAll(getAssessLevel_sql,[])

    let student = {}
    student.stud = {}
    let gradeTable = []
    let teachEvaluations = []
    student["levels"] = []
	let handlers = [
        findStudentlerHandler,
		findGradeTableAll,
		getAssessLevelTableAllHandler,
		getPublishHandler,
	]
    await Promise.all(handlers).then(res=>{
        if(res.length >0 && res[0]){
            student.stud = res[0][0]
            gradeTable = res[1]
            student["levels"] = res[2]
            student["publish"] = res[3][0]
            for (let i = 0; i < gradeTable.length; i++) {
                let counter = 0
                //当有索引跳过某一个范围就会报错
                for (let j = 0; j < teachEvaluations.length; j++) {
                    if (teachEvaluations[j]["numberID"] === gradeTable[i]["numberID"]) {
                        for (let key in gradeTable[i]) {
                            if (key.startsWith("content"))
                                teachEvaluations[j]["contents"].push(gradeTable[i][key])
                        }
                    }else
                        counter++
                }
                if(counter === teachEvaluations.length){
                    let evaluation = {}
                    let content = []
                    evaluation["contents"] = []
                    for (let key in gradeTable[i]) {
                        if (key.startsWith("number")) {
                            evaluation[key] = gradeTable[i][key]
                        } else {
                            content.push(gradeTable[i][key])
                        }
                    }
                    evaluation["contents"] = content
                    teachEvaluations[evaluation["numberID"]-1] = evaluation
                }
            }
        }
    }).catch(err=>{
        console.log(err)
        ctx.throw(501,"查询评教信息出错")
	})
    student["teachEvaluations"] = teachEvaluations
	student["teachEvaluationsLength"] = teachEvaluations.length
	await ctx.render("student/evaluate.html",{student})
})


router.post("/getAlreadyTandC",async (ctx,next)=>{
	let studentID = ctx.request.body.stduentID
	let data = [parseInt(studentID)]


	//获取学生已评价的教师和课程
    let getAlreadyTandC_sql = sqlParser.getAlreadyTandC()
    let getAlreadyTandCallHandler = handler.getAlreadyTandCall(getAlreadyTandC_sql,data)

	//查询学生学过的课程
    let getStudentAlreadyCourse_sql = sqlParser.getStudentAlreadyCourse()
    let getStudentAlreadyCourseHandler = handler.getStudentAlreadyCourse(getStudentAlreadyCourse_sql,data)

	let alreadyCourse = []
	let classCourse = []
	let notCourse = []
	await Promise.all([getAlreadyTandCallHandler,getStudentAlreadyCourseHandler]).then(res=>{
		if(res.length >0){
            alreadyCourse = res[0]
            classCourse = res[1]
			if(alreadyCourse.length > 0){
                for(let i=0;i<alreadyCourse.length;i++){
                    for(let j=0;j<classCourse.length;j++){
                        if(classCourse[j]["courseID"] === alreadyCourse[i]["courseID"] && classCourse[j]["teacherID"]===alreadyCourse[i]["teacherID"]){
                            classCourse.splice(j,1);
                        }
                    }
                }
			}
		}
		notCourse = classCourse
		let course = {}
		course.notCourse = notCourse
		course.alreadyCourse = alreadyCourse
        ctx.response.status = 200
        ctx.body = {
            status:200,
            msg:"查询成功",
			data:{course}
        }
	}).catch(err=>{
        console.log(err)
        ctx.throw(501,"查询已评教信息出错")
	})
})


router.post("/getNotEvaluate",async (ctx,next)=>{

    let studentID =  ctx.request.body.studentID;
    let teacherID = ctx.request.body.teacherID;
	let data = [parseInt(studentID),parseInt(teacherID)]
    //获取指定学生且指定教师课程
    let getCourseWithTandS_sql = sqlParser.getCourseWithTandS()
    let getCourseWithTandSHandler = handler.getCourseWithTandS(getCourseWithTandS_sql,data)

    //获取指定学生且指定教师已评价的课程
    let getAlreadyCourseWithTandS_sql = sqlParser.getAlreadyCourseWithTandS()
    let getAlreadyCourseWithTandSHandler = handler.getAlreadyCourseWithTandS(getAlreadyCourseWithTandS_sql,data)


    let alreadyCourse = []
    let classCourse = []
    let notCourse = []
    await Promise.all([getCourseWithTandSHandler,getAlreadyCourseWithTandSHandler]).then(res=>{
        if(res.length >0){
            classCourse = res[0]
            alreadyCourse = res[1]
            if(alreadyCourse.length > 0){
                for(let i=0;i<classCourse.length;i++){
                    for(let j=0;j<alreadyCourse.length;j++){if(classCourse[i]["courseID"] === alreadyCourse[j]["courseID"] && classCourse[i]["teacherID"]===alreadyCourse[j]["teacherID"])
                        continue
                    else
                        notCourse.push(classCourse[i])
                    }
                }
            }else
                notCourse = classCourse
        }
        let course = {}
        course.notCourse = notCourse
        ctx.response.status = 200
        ctx.body = {
            status:200,
            msg:"查询成功",
            data:{course}
        }
    }).catch(err=>{
        console.log(err)
        ctx.throw(501,"查询已评教信息出错")
    })

})

router.get("/exportmyinfo/:id",async (ctx,next)=>{
    let id = ctx.params.id
    let student = {}
    if(! parseInt(id))
        ctx.throw(500,"传入的id不正确！")
    let sql = sqlParser.findStudentS("")
    await handler.findStudent(sql,[parseInt(id)]).then(res=>{
        if(res.length > 0 && res[0]){
            for(var key in res[0]){
                student[key] = res[0][key]
            }
        }else{
            ctx.throw(404,"Not Found")
        }
    }).catch(err=>{
        console.log(err)
        ctx.throw(501,"其他内部错误")
    })

    //下载个人资料
    let conf ={};
    conf.stylesXmlFile = "public/xml/styles.xml";
    conf.name = "mysheet";
    conf.cols = [{
        caption:'id',
        type:'number',
        width:28.7109375
    },{
        caption:'name',
        type:'string',
        width:28.7109375
    },{
        caption:'age',
        type:'number',
        width:28.7109375
    },{
        caption:'sex',
        type:'string',
        width:28.7109375
    },{
        caption:'phone',
        type:'string',
        width:28.7109375
    },{
        caption:'address',
        type:'string',
        width:28.7109375
    },{
        caption:'introduction',
        type:'string',
        width:28.7109375
    },{
        caption:'qq',
        type:'number',
        width:28.7109375
    },{
        caption:'email',
        type:'string',
        width:28.7109375
    },{
        caption:' department',
        type:'string',
        width:28.7109375
    },{
        caption:'classes',
        type:'string',
        width:28.7109375
    }];
    let stud = [];
    for( let val in student){
        stud.push(student[val])
    }
    conf.rows = [
       stud
    ];
    let result = excelexport.execute(conf);
    ctx.status = 200;
    ctx.set('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
    ctx.set("Content-Disposition", "attachment; filename=myinfo.xlsx");
    ctx.res.end(result,"binary");
})

module.exports = router.routes()