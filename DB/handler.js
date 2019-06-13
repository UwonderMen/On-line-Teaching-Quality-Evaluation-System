let sqlError = require("../util/sqlError");
const connect_mysql = require("./connect_mysql");

function Handler(con,sql,data){
	return new Promise((resolve,reject)=>{
			con.query({
				sql:sql,
				timeout:4000,
				values:data
			},(err,res)=>{
				if(err){
					reject(err)
				}
				else{
					resolve(res)
			}
		})
	})
}


//----定义导出mysql数据库统一接口----//
function QueryFunc(func,sql,data){
	return new Promise((resolve,reject)=>{
		connect_mysql.fn(func,sql,data).then(res=>{
			resolve(res)
		}).catch(err=>{
			reject(err)
		})
	})
}

module.exports = {
	doLogin:function(sql,data){
		return QueryFunc(Handler,sql,data)
	},
    findStudent:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    repaireStudent:function(sql,data){
        return QueryFunc(Handler,sql,data)
	},
	findClassTable:function(sql,data){
		return QueryFunc(Handler,sql,data)
	},
	findStudentName:function(sql,data){
        return QueryFunc(Handler,sql,data)
	},
    findManager:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    findManagerName:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    findDepartment:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    findDepartementCourse:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    findCourse:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    findDepartmentCourse:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    findTeacher:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
	filterTeacher:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    teacherDetail:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    findSingleTeacher:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    updateTeacher:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    findStudentFilter:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    findDepartmentAll:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    findCourseAll:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    findClassesAll:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    studentDetail:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    findSingleStudent:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    updateStudent:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    repaireTeacher:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    findTeacherName:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    findGradeTableAll:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    publish:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    IsPublish:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    addTeachEvaluation:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    findAssessNumber_number:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    getAssessLevelTableAll:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    getPublishTableAll:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    modifyPublish:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    tip:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    getAlreadyTandCall:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    getStudentAlreadyCourse:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    getCourseWithTandS:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    getAlreadyCourseWithTandS:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    addTeachEvaluate:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    findMessage:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    getAllReadyClassEvaluato:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    getAllTeacherEvaluato:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    findassesslevel:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    findcontent_number:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    updateTeachEvaluation:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    findStudentSession:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    findSession:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    findStudentSaD:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
    findPublish:function(sql,data){
        return QueryFunc(Handler,sql,data)
    },
}
