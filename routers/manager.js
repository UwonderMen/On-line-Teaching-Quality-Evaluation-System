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

router.get("/man/:id",async (ctx,next)=>{
    let manager = {}
    let id = ctx.params.id
	let type = cookieHandler.getCookie(ctx,"type")
    let data = []
    if(! parseInt(id)){
        ctx.throw(500,"传入的id不正确！")
    }else
        data[0] = parseInt(id)
	let p_type = isType.func(parseInt(type))
    let sql = sqlParser.findManager(p_type)

    await handler.findManager(sql,data).then(res=>{
        if(res.length > 0 && res[0]){
            for(var key in res[0]){
                manager[key] = res[0][key]
            }
        }else{
            ctx.throw(404,"Not Found")
        }
    }).catch(err=>{
        console.log(err)
        ctx.throw(501,"其他内部错误")
    })
    await ctx.render("manager/manager.html",{manager})
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

router.get("/lookcourse",async (ctx,next)=>{
    let p_type = parseInt(cookieHandler.getCookie(ctx,"type"))
    let id = parseInt(cookieHandler.getCookie(ctx,"id"))
    let findName_sql = sqlParser.findManagerName(isType.func(parseInt(p_type)))
    let findDepartment_sql = sqlParser.findDepartment()
    let findDepartementCourse = sqlParser.findDepartementCourse()
	let data = [parseInt(id)]
	let manager = {}
	manager.id = parseInt(id)
    let findManagerName = handler.findManagerName(findName_sql,data)
    let findDepartment = handler.findDepartment(findDepartment_sql,[])
    let findDC = handler.findDepartementCourse(findDepartementCourse,[])
	await Promise.all([findDepartment,findManagerName,findDC]).then(res=>{
		manager.name = res[1]["name"]
        manager.department = res[0]
        manager.departmentandcourse = res[2]
	}).catch(err=>{
		console.log(err)
	})
	await ctx.render("manager/lookCourse.html",{manager})

})

router.post("/getCourse",async (ctx,next)=>{
	let {did} = ctx.request.body;
	let department_id = parseInt(did)
    let findCourse = sqlParser.findCourse()
	let data
    await handler.findCourse(findCourse,[department_id]).then(res=>{
    	if(res.length>0 && res[0]){
    		ctx.set("Content-Type","application/json")
			ctx.response.status = 200
			data = {
    			msg:"请求成功",
				status:200,
				data:res
			}
			ctx.body = data
		}

	}).catch(err=>{
        console.log(err)
        ctx.throw(501,"传入的did不正确")
	})
})

router.post("/getDepartmentCourse",async (ctx,next)=>{
    let {cid,did} = ctx.request.body;
    let course_id = parseInt(cid)
    let department_id = parseInt(did)
    let sql = sqlParser.findDepartment_course()
	let data
    await handler.findDepartmentCourse(sql,[course_id,department_id]).then(res=>{
		if(res.length > 0 && res[0]){
			data = {
				msg:"查询成功",
				status:200,
				data:res
			}
            ctx.set("Content-Type","application/json")
            ctx.response.status = 200
			ctx.body = data
		}
	}).catch(err=>{
        console.log(err)
        ctx.throw(501,"传入的cid不正确")
	})

})

router.get("/findTeacher",async (ctx,next)=>{
    let p_type = parseInt(cookieHandler.getCookie(ctx,"type"))
    let findName_sql = sqlParser.findManagerName(isType.func(parseInt(p_type)))
    let id = parseInt(cookieHandler.getCookie(ctx,"id"))
    let data = [parseInt(id)]
    let findManagerNamehandler = handler.findManagerName(findName_sql,data)
    let findteacher_sql =  sqlParser.findTeacher()
    let findteacherhandler = handler.findTeacher(findteacher_sql,[])
    let manager;
    await Promise.all([findteacherhandler,findManagerNamehandler]).then(res=>{
        if(res.length > 0 && res[0]){
            manager=res[1][0]
            ctx.set("Content-Type","text/html")
            ctx.response.status = 200
            manager.teacherList = res[0]
        }
    }).catch(err=>{
        console.log(err)
        ctx.throw(501,"传入的cid不正确")
    })
    await ctx.render("manager/teacherList.html",{manager})
})

router.post("/filterTeacher",async (ctx,next)=>{
    let {findValue} = ctx.request.body;
    let filter_teacher_sql = sqlParser.filterTeacher(findValue)
    let data
    await handler.filterTeacher(filter_teacher_sql,[]).then(res=>{
        data = {
            msg:"查询成功",
            status:200,
            data:res
        }
        ctx.set("Content-Type","application/json")
        ctx.response.status = 200
        ctx.body = data
    }).catch(err=>{
        console.log(err)
    })
})



router.post("/domodify/student",async (ctx,next)=>{
    let {id,name,age,sex,phone,address,phone2,introduction,email,qq} = ctx.request.body
    id = parseInt(id)
    age = parseInt(age)
    let updateStudent_sql = sqlParser.updateStudent()
    let updateStudenthandler = handler.updateStudent(updateStudent_sql,[name,age,sex,phone,address,phone2,introduction,email,qq,id])
    let data
    await Promise.all([updateStudenthandler]).then(res=>{
        if(res.length > 0 && res[0].affectedRows >0){
            ctx.set("Content-Type","application/json")
            ctx.response.status = 200
            data = {
                msg:"修改成功",
                status:200,
                path:"/managers/findStudent"
            }
            ctx.body = {data}
        }
    }).catch(err=>{
        console.log(err)
        ctx.throw(501,"传入的cid不正确")
    })
})


router.post("/domodify/teacher",async (ctx,next)=>{
    let {id,name,sex,age,phone,address} = ctx.request.body
    id = parseInt(id)
    age = parseInt(age)
    let updateTeacher_sql = sqlParser.updateTeacher()
    let updateTeacherhandler = handler.updateTeacher(updateTeacher_sql,[name,age,address,phone,sex,id])
    let data
    await Promise.all([updateTeacherhandler]).then(res=>{
        if(res.length > 0 && res[0].affectedRows >0){
            ctx.set("Content-Type","application/json")
            ctx.response.status = 200
            data = {
                msg:"修改成功",
                status:200,
                path:"/managers/findTeacher"
            }
            ctx.body = {data}
        }
    }).catch(err=>{
        console.log(err)
        ctx.throw(501,"传入的cid不正确")
    })
})



router.get("/modify/teacher/:id",async (ctx,next)=>{
    let teacherId = parseInt(ctx.params.id)
    let p_type = parseInt(cookieHandler.getCookie(ctx,"type"))
    let findName_sql = sqlParser.findManagerName(isType.func(parseInt(p_type)))
    let manager_id = parseInt(cookieHandler.getCookie(ctx,"id"))
    let findManagerNamehandler = handler.findManagerName(findName_sql,[manager_id])
    let teacherInfo_sql = sqlParser.findSingleTeacher()
    let findSingleTeacherHandler = handler.findSingleTeacher(teacherInfo_sql,[teacherId])
    let manager
    await Promise.all([findManagerNamehandler,findSingleTeacherHandler]).then(res=>{
        if(res.length > 0 && res[0]){
            manager=res[0][0]
            manager.teacher = {}
            manager["teacher"] = res[1][0]
            manager.returnPath = "/managers/findTeacher"
        }
    }).catch(err=>{
        console.log(err)
        ctx.throw(501,"传入的cid不正确")
    })
    ctx.set("Content-Type","text/html")
    ctx.response.status = 200
    await ctx.render("manager/modifyTeacher.html",{manager})

})



router.get("/modify/student/:id",async (ctx,next)=>{
    let studentId = parseInt(ctx.params.id)
    let p_type = parseInt(cookieHandler.getCookie(ctx,"type"))
    let findName_sql = sqlParser.findManagerName(isType.func(parseInt(p_type)))
    let manager_id = parseInt(cookieHandler.getCookie(ctx,"id"))
    let findManagerNamehandler = handler.findManagerName(findName_sql,[manager_id])

    let studentInfo_sql = sqlParser.findSingleStudent()
    let findSingleStudentHandler = handler.findSingleStudent(studentInfo_sql,[studentId])
    let manager
    await Promise.all([findManagerNamehandler,findSingleStudentHandler]).then(res=>{
        if(res.length > 0 && res[0]){
            manager=res[0][0]
            manager.student = {}
            manager["student"] = res[1][0]
            manager.returnPath = "/managers/findStudent"
        }
    }).catch(err=>{
        console.log(err)
        ctx.throw(501,"传入的cid不正确")
    })
    ctx.set("Content-Type","text/html")
    ctx.response.status = 200
    await ctx.render("manager/modifyStudent.html",{manager})

})

router.get("/detail/teacher/:id",async (ctx,next)=>{
    let teacherId = parseInt(ctx.params.id)
    let p_type = parseInt(cookieHandler.getCookie(ctx,"type"))
    let findName_sql = sqlParser.findManagerName(isType.func(parseInt(p_type)))
    let manager_id = parseInt(cookieHandler.getCookie(ctx,"id"))
    let findManagerNamehandler = handler.findManagerName(findName_sql,[manager_id])
    let teacherDetail = sqlParser.teacherDetail()
    let teacherDetailHandler = handler.teacherDetail(teacherDetail,[teacherId])
    let manager
    await Promise.all([findManagerNamehandler,teacherDetailHandler]).then(res=>{
        manager = res[0][0]
        manager["teacher"] = {}
        manager["teacher"]["courses"] = []
        for(var i=0;i<res[1].length;i++){
            let course = {}
            for(var key in res[1][i]){
                if(key.startsWith("course")){
                    course[key] = res[1][i][key]
                }else{
                    manager["teacher"][key] = res[1][i][key]
                }

            }
            manager["teacher"]["courses"].push(course)
        }
    }).catch(err=>{
        console.log(err)
    })
    await ctx.render("manager/teacherDetail",{manager})
})

router.get("/detail/student/:id",async (ctx,next)=>{
    let studentId = parseInt(ctx.params.id)
    let p_type = parseInt(cookieHandler.getCookie(ctx,"type"))
    let findName_sql = sqlParser.findManagerName(isType.func(parseInt(p_type)))
    let manager_id = parseInt(cookieHandler.getCookie(ctx,"id"))
    let findManagerNamehandler = handler.findManagerName(findName_sql,[manager_id])

    let studentDetail_sql = sqlParser.studentDetail()
    let studentDetailHandler = handler.studentDetail(studentDetail_sql,[studentId])
    let manager = []
    await Promise.all([findManagerNamehandler,studentDetailHandler]).then(res=>{
        manager = res[0][0]
        manager["student"] = {}
        manager["student"]["courses"] = []
        for(var i=0;i<res[1].length;i++){
            let course = {}
            for(var key in res[1][i]){
                if(key.startsWith("course")){
                    course[key] = res[1][i][key]
                }else{
                    manager["student"][key] = res[1][i][key]
                }
            }
            manager["student"]["courses"].push(course)
        }
    }).catch(err=>{
        console.log(err)
    })
    await ctx.render("manager/studentDetail",{manager})
})


router.get("/findStudent",async (ctx,next)=>{
    let p_type = parseInt(cookieHandler.getCookie(ctx,"type"))
    let findName_sql = sqlParser.findManagerName(isType.func(parseInt(p_type)))
    let id = parseInt(cookieHandler.getCookie(ctx,"id"))
    let data = [parseInt(id)]
    let findManagerNamehandler = handler.findManagerName(findName_sql,data)
    let findstudent_sql =  sqlParser.findStudent()
    let findStudenthandler = handler.findStudent(findstudent_sql,[])
    let manager
    await Promise.all([findStudenthandler,findManagerNamehandler]).then(res=>{
        if(res.length > 0 && res[0]){
            manager=res[1][0]
            ctx.set("Content-Type","text/html")
            ctx.response.status = 200
            manager.studentList = res[0]
        }
    }).catch(err=>{
        console.log(err)
        ctx.throw(501,"传入的cid不正确")
    })
    await ctx.render("manager/studentList.html",{manager})
})

router.post("/filterStudent",async (ctx,next)=>{
    let {departmentFilter,classesFilter,courseFilter,ageFilter,sexFilter} = ctx.request.body
    let findStudentFilterList_sql = sqlParser.findStudentFilterList(departmentFilter,classesFilter,courseFilter,sexFilter,ageFilter)
    let data = {}
    await handler.findStudentFilter(findStudentFilterList_sql,[]).then(res=>{
        data["studentList"] = res
        ctx.set("Content-Type","text/html")
        ctx.response.status = 200
        ctx.body = {
            msg:"查询成功",
            data:data,
            status:200
        }
    }).catch(err=>{
        console.log(err)
        ctx.throw(501,"传入的cid不正确")
    })
})

router.post("/departmentCourse",async (ctx,next)=>{
    let findDepartment_sql = sqlParser.findDepartment()
    let findCourse_sql = sqlParser.findCourseAll()
    let findclasses_sql = sqlParser.findclassesAll()
    let findDepartmentAll = handler.findDepartmentAll(findDepartment_sql,[])
    let findCourseAll = handler.findCourseAll(findCourse_sql,[])
    let findClassesAll = handler.findClassesAll(findclasses_sql,[])
    let data = {}
    await Promise.all([findDepartmentAll,findCourseAll,findClassesAll]).then(res=>{
       if(res.length>0 && res[0]){
           data.department = res[0]
           data.course = res[1]
           data.classes = res[2]
       }
        ctx.set("Content-Type","text/html")
        ctx.response.status = 200
        ctx.body = {
           msg:"查询成功",
            data:data,
            status:200
        }
    }).catch(err=>{
        console.log(err)
    })
})

router.get("/publish",async (ctx,next)=>{
    let p_type = parseInt(cookieHandler.getCookie(ctx,"type"))
    let findName_sql = sqlParser.findManagerName(isType.func(parseInt(p_type)))
    let id = parseInt(cookieHandler.getCookie(ctx,"id"))
    let data = [parseInt(id)]
    let findManagerNamehandler = handler.findManagerName(findName_sql,data)
    let findGradeTable_sql = sqlParser.findGradeTable()
    let findGradeTableAll = handler.findGradeTableAll(findGradeTable_sql,[])
    let type_flag = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
    //返回发布需要的信息
    let getPublishInformation_sql = sqlParser.getPublishInformation()
    let getPublishHandler= handler.getPublishTableAll(getPublishInformation_sql,[])

    //获取达到等级
    let getAssessLevel_sql = sqlParser.getAssessLevel()
    let getAssessLevelTableAllHandler = handler.getAssessLevelTableAll(getAssessLevel_sql,[])

    //获取指定的系
    let findDepartment_sql = sqlParser.findDepartment()
    let findDepartmentHandler = handler.findDepartment(findDepartment_sql,[])

    //获得指定的届
    let findSession_sql = sqlParser.findSession()
    let findSessionHandler = handler.findSession(findSession_sql,[])

    let manager = {}
    let gradeTable = []
    let teachEvaluations = [{}]
    manager["levels"] = []
    await Promise.all([
        findManagerNamehandler,
        findGradeTableAll,
        getAssessLevelTableAllHandler,
        getPublishHandler,
        findDepartmentHandler,
        findSessionHandler
    ]).then(res=>{
        if(res.length >0 && res[0]){
            manager = res[0][0]
            gradeTable = res[1]
            manager["levels"] = res[2]
            manager["departments"] = res[4]
            manager["sessions"] = res[5]
            manager["publish"] = res[3][0]
            for (let i = 0; i < gradeTable.length; i++) {
                let counter = 0
                //当有索引跳过某一个范围就会报错
                for (let j = 0; j < teachEvaluations.length; j++) {
                    teachEvaluations[j] =  teachEvaluations[j]?teachEvaluations[j]:{};
                    if ("numberID" in teachEvaluations[j] && teachEvaluations[j]["numberID"] === gradeTable[i]["numberID"]) {
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
    })
    manager["teachEvaluations"] = teachEvaluations
    for(let i=0;i<manager["teachEvaluations"].length;i++){
        manager["teachEvaluations"][i].type = type_flag[i]
    }
    await ctx.render("manager/publish.html",{manager})
})


router.post("/doPublish",async (ctx,next)=>{
    let {
        start,
        end,
        session,
        department,
        p_msg,
        tip ,
        is_publish
    } = ctx.request.body;

    isPublish = parseInt(is_publish);
    session = parseInt(session);
    department = parseInt(department);

    let date = new Date();
    let time = date.getFullYear();

    let data = [is_publish,p_msg,tip,session,end,start,department,time]
    //插入发布表
    let insertPublish_sql = sqlParser.insertPublish()
    let modifyPublishhandler = handler.modifyPublish(insertPublish_sql,data)
    await Promise.all([modifyPublishhandler]).then(res=>{
        if(res[0].affectedRows > 0){
            ctx.set("Content-Type","application/json")
            ctx.status = 200;
            ctx.body = {
                msg:"发布成功",
                path:'/managers/publish',
                status:200
            }
        }else{
            ctx.throw(500,"非法操作")
        }
    }).catch(err=>{
        console.log(err)
        ctx.throw(500,"非法操作")
    })
})

router.get("/IsPublish",async (ctx,next)=>{
    let isPublish_sql = sqlParser.isPublish()
    let IsPublishHandler = handler.IsPublish(isPublish_sql,[])
    await Promise.all([IsPublishHandler]).then(res=>{
        if(res[0][0]["isPublish"]){
            ctx.set("Content-Type","application/json")
            ctx.response.status = 200
            ctx.body = {
                msg:"已经发布了，无法再继续发布",
                data:'',
                status:200
            }
        }
    }).catch(err=>{
        console.log(err)
        ctx.throw(500,"非法操作")
    })
})


//---新增一条教学质量评价规则---///
router.get("/addTeachEvaluation",async (ctx,next)=>{
    let p_type = parseInt(cookieHandler.getCookie(ctx,"type"))
    let findName_sql = sqlParser.findManagerName(isType.func(parseInt(p_type)))
    let id = parseInt(cookieHandler.getCookie(ctx,"id"))
    let data = [parseInt(id)]
    let findManagerNamehandler = handler.findManagerName(findName_sql,data)
    let manager = {}
    let str=""
    let strs="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    let number_sql = sqlParser.findAssessNumber_number("assessnumber")
    let findAssessNumber_numberHandler = handler.findAssessNumber_number(number_sql)
    await Promise.all([findManagerNamehandler,findAssessNumber_numberHandler]).then(res=>{
        if(res.length > 0 && res[0][0]["id"]){
            manager = res[0][0]
            for(let i=0;i<res[1].length;i++){
                str+=res[1][i]["number"]
            }
            manager["assessNumber"] = strs.replace(str,"")[0]
            manager["quota"] = res[1]
        }else{
            ctx.throw(500,"非法操作")
        }
    }).catch(err=>{
        console.log(err)
        ctx.throw(500,"非法操作")
    })
    await ctx.render("manager/addTeachEvaluation.html",{manager})
})


//重做
router.post("/doaddteachevaluation",async (ctx,next)=>{
    console.log(123)
    let { numberName,numberQuota,contents} = ctx.request.body
    numberName = numberName.trim()
    numberQuota = numberQuota.trim()
    let contents_str = ''
    //adasdasda|asdasdasd|asdas|
    for(let i=0;i<contents.length;i++){
        contents_str += contents[i].trim() +"|"
    }
    let addTeachEvaluation_sql = sqlParser.addTeachEvaluation(numberName,numberQuota,contents_str)

    let addTeachEvaluation = handler.addTeachEvaluation(addTeachEvaluation_sql,[]);
    await Promise.all([addTeachEvaluation]).then(res=>{
        console.log(res);
        if(res[0].length >0 &&res[0][0][0]["t_error"] === 0){
            ctx.set("Content-Type","application/json")
            ctx.status = 200
            ctx.body = {
                msg:"添加成功，即刻跳转到发布界面模板",
                data:'',
                status:200,
                path:"/managers/publish"
            }
        }
    }).catch(err=>{
        console.log(err)
        ctx.throw(500,"非法操作")
    })
})

router.post("/dorepaireteachevaluation",async (ctx,next)=>{
    let {numberid,
        numberQuota,
        contents,
        assesscontentID
    } = ctx.request.body
    numberid = parseInt(numberid.trim())
    numberQuota = numberQuota.trim()
    assesscontentID = assesscontentID.trim()
    let contents_str = ''
    for(let i=0;i<contents.length;i++){
        contents_str += contents[i].trim() +"|"
    }
    let updateTeachEvaluation_sql = sqlParser.updateTeachEvaluation(numberid,numberQuota,contents_str,assesscontentID)
    let updateTeachEvaluationhandler = handler.updateTeachEvaluation(updateTeachEvaluation_sql,[])
    await updateTeachEvaluationhandler.then(res=>{
        if(res.affectedRows > 0){
            ctx.set("Content-Type","application/json")
            ctx.response.status = 200
            ctx.body = {
                msg:"修改成功，即刻跳转到发布界面模板",
                data:'',
                status:200,
                path:"/managers/publish"
            }
        }
    }).catch(err=>{
        console.log(err)
    })
})
router.post("/getrepareEvaluation",async (ctx,next)=>{
    let {number_id} = ctx.request.body;
    let findcontent_number_sql = sqlParser.findcontent_number()
    let findcontent_numberhandler = handler.findcontent_number(findcontent_number_sql,[number_id])
    let result = {};
    result.assessContent = [];
    result.assessContentID = [];
    await findcontent_numberhandler.then(res=>{
        if(res.length > 0){
            for(let i=0;i<res.length;i++){
                result.quota = res[i]["quota"]
                result.assessContent.push(res[i]["assessContent"])
                result.assessContentID.push(res[i]["assessContentID"])
            }
            ctx.set("Content-Type","application/json")
            ctx.status = 200
            console.log(result)
            ctx.body = {
                msg:"查询成功",
                data:result,
                status:200
            }
        }
    }).catch(err=>{
        console.log(err)
        ctx.throw(500,"非法操作")
    })
})

router.get("/repareEvaluation",async (ctx,next)=>{
    let p_type = parseInt(cookieHandler.getCookie(ctx,"type"))
    let findName_sql = sqlParser.findManagerName(isType.func(parseInt(p_type)))
    let id = parseInt(cookieHandler.getCookie(ctx,"id"))
    let data = [parseInt(id)]
    let findManagerNamehandler = handler.findManagerName(findName_sql,data)

    let findassesslevel_sql = sqlParser.findassesslevel()
    let findassesslevelhandler = handler.findassesslevel(findassesslevel_sql,data)
    let manager = {
        name:"asdasd",
        id:1231
    }
    let handlers = [findManagerNamehandler,findassesslevelhandler]
    await Promise.all(handlers).then(res=>{

        if(res.length > 0  && res[0][0]) {
            manager.name = res[0][0]["name"]
            manager.id = res[0][0]["id"]
            manager.level = res[1]
        }
    })
    await ctx.render("manager/repaireTeachEvaluation.css.html",{manager})
})

//查看教师得分
router.get("/getallevaluato",async (ctx,next)=>{
    let p_type = parseInt(cookieHandler.getCookie(ctx,"type"))
    let findName_sql = sqlParser.findManagerName(isType.func(parseInt(p_type)))
    let id = parseInt(cookieHandler.getCookie(ctx,"id"))
    let data = [parseInt(id)]
    let findManagerNamehandler = handler.findManagerName(findName_sql,data)
    let manager = {
        name:"asdasd",
        id:1231
    }
    //得到全部老师评价
    let getAllTeacherEvaluato_sql = sqlParser.getAllTeacherEvaluato()
    let getAllTeacherEvaluatoHandler = handler.getAllTeacherEvaluato(getAllTeacherEvaluato_sql,[])
    let handlers = [findManagerNamehandler,getAllTeacherEvaluatoHandler]
    let getAllGrade = [[]]
    let container = []
    let map = new Map()
    await Promise.all(handlers).then(res=>{

        if(res.length > 0  && res[0][0]){

            manager.name = res[0][0]["name"]

            manager.id = res[0][0]["id"]

            allGrade = res[1]

            for(let i=0;i<allGrade.length;i++){

                let flag = 0

                for(let j=0;j<getAllGrade.length;j++){

                    if(!getAllGrade[j]["teacherID"] && j===0){

                        getAllGrade.splice(getAllGrade[j],1)

                        getAllGrade.push(allGrade[i])

                        map.set(allGrade[i]["teacherID"],[])

                        map.get(allGrade[i]["teacherID"]).push(allGrade[i])

                    }else if(getAllGrade[j]["teacherID"] === allGrade[i]["teacherID"]){

                        map.get(allGrade[i]["teacherID"]).push(allGrade[i])

                        break;

                    }else{
                        flag++;
                    }
                }
                if(flag === getAllGrade.length){

                    map.set(allGrade[i]["teacherID"],[])

                    map.get(allGrade[i]["teacherID"]).push(allGrade[i])

                    getAllGrade.push(allGrade[i])

                }
            }
        }
        map.forEach((index,m)=>{
            let teacherGrade = map.get(m)
            let map1 = new Map()
            let allGrade = [{}]
            for(let i=0;i<teacherGrade.length;i++){

                let flag = 0

                for(let j=0;j<allGrade.length;j++){

                    if(!allGrade[j]["courseID"] && j===0){

                        allGrade.splice(getAllGrade[j],1)

                        allGrade.push(teacherGrade[i])

                        map1.set(teacherGrade[i]["courseID"],[])

                        map1.get(teacherGrade[i]["courseID"]).push(teacherGrade[i])

                    }else if(allGrade[j]["courseID"] === teacherGrade[i]["courseID"]){

                        map1.get(teacherGrade[i]["courseID"]).push(teacherGrade[i])

                        break;

                    }else{
                        flag++;
                    }
                }
                if(flag === allGrade.length){

                    map1.set(teacherGrade[i]["courseID"],[])

                    map1.get(teacherGrade[i]["courseID"]).push(teacherGrade[i])

                    allGrade.push(teacherGrade[i])

                }
            }
            map.set(m,map1)
        })

        map.forEach((index,parent)=>{
            let map1 = map.get(parent)
            map1.forEach((i,child)=>{
                let grade = {
                    courseName:map1.get(child)[0]["courseName"],
                    avg:0,
                    sum:0,
                    count:0,
                    courseID:child,
                    teacherName:map1.get(child)[0]["teacherName"]
                }
                for (let i=0;i<map1.get(child).length;i++){
                    grade.sum +=map1.get(child)[i]["sumGrade"]
                    grade.count += 1;
                }
                grade.avg = Math.ceil(grade.sum / grade.count);
                container.push(grade)
            })
        })
        manager.grade = container
    }).catch(err=>{
        console.log(err)
        ctx.throw(500,"非法操作")
    })
    await ctx.render("manager/AllGrade.html",{manager})
})

router.post("/drawGrade",async (ctx,next)=>{

    //得到全部老师评价
    let getAllTeacherEvaluato_sql = sqlParser.getAllTeacherEvaluato()
    let getAllTeacherEvaluatoHandler = handler.getAllTeacherEvaluato(getAllTeacherEvaluato_sql,[])

    let handlers = [getAllTeacherEvaluatoHandler]
    let getAllGrade = [[]]
    let container = []
    let map = new Map()
    let allGrade = []
    await Promise.all(handlers).then(res=>{
        if(res.length > 0  && res[0][0]){

            allGrade = res[0]

            for(let i=0;i<allGrade.length;i++){

                let flag = 0

                for(let j=0;j<getAllGrade.length;j++){

                    if(!getAllGrade[j]["teacherID"] && j===0){

                        getAllGrade.splice(getAllGrade[j],1)

                        getAllGrade.push(allGrade[i])

                        map.set(allGrade[i]["teacherID"],[])

                        map.get(allGrade[i]["teacherID"]).push(allGrade[i])

                    }else if(getAllGrade[j]["teacherID"] === allGrade[i]["teacherID"]){

                        map.get(allGrade[i]["teacherID"]).push(allGrade[i])

                        break;

                    }else{
                        flag++;
                    }
                }
                if(flag === getAllGrade.length){

                    map.set(allGrade[i]["teacherID"],[])

                    map.get(allGrade[i]["teacherID"]).push(allGrade[i])

                    getAllGrade.push(allGrade[i])

                }
            }
        }

        map.forEach((index,m)=>{
            let teacherGrade = map.get(m)
            let map1 = new Map()
            let allGrade = [{}]
            for(let i=0;i<teacherGrade.length;i++){

                let flag = 0

                for(let j=0;j<allGrade.length;j++){

                    if(!allGrade[j]["courseID"] && j===0){

                        allGrade.splice(getAllGrade[j],1)

                        allGrade.push(teacherGrade[i])

                        map1.set(teacherGrade[i]["courseID"],[])

                        map1.get(teacherGrade[i]["courseID"]).push(teacherGrade[i])

                    }else if(allGrade[j]["courseID"] === teacherGrade[i]["courseID"]){

                        map1.get(teacherGrade[i]["courseID"]).push(teacherGrade[i])

                        break;

                    }else{
                        flag++;
                    }
                }
                if(flag === allGrade.length){

                    map1.set(teacherGrade[i]["courseID"],[])

                    map1.get(teacherGrade[i]["courseID"]).push(teacherGrade[i])

                    allGrade.push(teacherGrade[i])

                }
            }
            map.set(m,map1)
        })

        map.forEach((index,parent)=>{
            let map1 = map.get(parent)
            map1.forEach((i,child)=>{
                let grade = {
                    courseName:map1.get(child)[0]["courseName"],
                    avg:0,
                    sum:0,
                    count:0,
                    courseID:child,
                    teacherName:map1.get(child)[0]["teacherName"]
                }
                for (let i=0;i<map1.get(child).length;i++){
                    grade.sum +=map1.get(child)[i]["sumGrade"]
                    grade.count += 1;
                }
                grade.avg = Math.ceil(grade.sum / grade.count);
                container.push(grade)
            })
        })

        ctx.response.status = 200
        ctx.set("Content-Type","application/json")
        ctx.body = {
            msg:"查询成功",
            status:200,
            data:container
        }
    }).catch(err=>{
        console.log(err)
        ctx.throw(500,"非法操作")
    })
})

router.get("/exportmyinfo/student",async (ctx,next)=>{
    let p_type = parseInt(cookieHandler.getCookie(ctx,"type"))
    let findName_sql = sqlParser.findManagerName(isType.func(parseInt(p_type)))
    let id = parseInt(cookieHandler.getCookie(ctx,"id"))
    let data = [parseInt(id)]
    let findManagerNamehandler = handler.findManagerName(findName_sql,data)
    let findstudent_sql =  sqlParser.findStudent()
    let findStudenthandler = handler.findStudent(findstudent_sql,[])
    let manager;
    let conf ={};
    await Promise.all([findStudenthandler,findManagerNamehandler]).then(res=>{
        if(res.length > 0 && res[0]){
            manager=res[1][0]
            ctx.set("Content-Type","text/html")
            ctx.response.status = 200
            manager.studentList = res[0]


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
                caption:'年龄',
                type:'number',
                width:28.7109375
            },{
                caption:'性别',
                type:'string',
                width:28.7109375
            },{
                caption:'联系电话1',
                type:'string',
                width:28.7109375
            },{
                caption:'联系电话2',
                type:'string',
                width:28.7109375
            },{
                caption:'地址',
                type:'string',
                width:28.7109375
            },{
                caption:'介绍',
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
                caption:'系名',
                type:'string',
                width:28.7109375
            },{
                caption:'班级',
                type:'string',
                width:28.7109375
            }];
            conf.rows = [];
            [].slice.call(manager.studentList).forEach((s)=>{
                let stud = []
                for(let val in s){
                    stud.push(s[val])
                }
                conf.rows.push(stud)
            })
        }
    }).catch(err=>{
        console.log(err)
        ctx.throw(501,"传入的cid不正确")
    })

    //下载个人资料
    let result = excelexport.execute(conf);
    ctx.status = 200;
    ctx.set('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
    ctx.set("Content-Disposition", "attachment; filename=myinfo.xlsx");
    ctx.res.end(result,"binary");
})

router.get("/exportmyinfo/teacher",async (ctx,next)=>{
    let p_type = parseInt(cookieHandler.getCookie(ctx,"type"))
    let findName_sql = sqlParser.findManagerName(isType.func(parseInt(p_type)))
    let id = parseInt(cookieHandler.getCookie(ctx,"id"))
    let data = [parseInt(id)]
    let findManagerNamehandler = handler.findManagerName(findName_sql,data)
    let findteacher_sql =  sqlParser.findTeacher()
    let findteacherhandler = handler.findTeacher(findteacher_sql,[])
    let manager;
    let conf = {};
    await Promise.all([findteacherhandler,findManagerNamehandler]).then(res=>{
        if(res.length > 0 && res[0]){
            manager=res[1][0]
            ctx.set("Content-Type","text/html")
            ctx.response.status = 200
            manager.teacherList = res[0]
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
                type:'string',
                width:28.7109375
            },{
                caption:'联系电话',
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
            conf.rows = [];
            [].slice.call(manager.teacherList).forEach((s)=>{
                let teahcer = []
                for(let val in s){
                    teahcer.push(s[val])
                }
                conf.rows.push(teahcer)
            })
        }
    }).catch(err=>{
        console.log(err)
        ctx.throw(501,"传入的cid不正确")
    })

    //下载个人资料
    let result = excelexport.execute(conf);
    ctx.status = 200;
    ctx.set('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
    ctx.set("Content-Disposition", "attachment; filename=myinfo.xlsx");
    ctx.res.end(result,"binary");
})

module.exports = router.routes()