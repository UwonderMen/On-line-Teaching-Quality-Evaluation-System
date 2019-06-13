exports.login = function(tab){
	return  `select name from ${tab} where id=? and passwd=?`
}

exports.findStudentS = function(tab){
	return `
	    select 
            s.id,s.name,s.age,s.sex,s.phone,s.address,s.sessionid as session,
            s.introduction,s.qq,s.email,d.name as "department",c.name as "classes"
        from 
            student as s
        left join 
            department as d 
        on 
            s.depid=d.id 
        left join 
            classes as c
        on 
            s.classid=c.id 
        where 
            s.id=?
	`
}

//-----修改学生/管理员/教师密码----//
//------update student set passwd=123456 where id=6015203100----//
exports.repaire = function(tab){
    return  `update ${tab} set passwd=? where id=?`
}

//---查询学生基本信息：名字---//
exports.findstudentName = function(tab){
	return `select name from ${tab} where id=?`
}

//---查询/教师/基本信息：名字---//
exports.findTeacherName = function(tab){
    return `select name from ${tab} where id=?`
}

//------查询学生的课程表-----//
exports.findClasstable = function(tab){
	return `
	select 
		c.name as "course",t.name as "teacher",addr.addr as "address",w.id as "weekID",
		w.week as "weekName",tt.id as "timeID",tt.time as "timeName" ,much.id as "muchID",
		much.name as "classMuch",timeR.range as "timeRange"
	from 
		class 
	left join 
		course as c 
	on 
		class.cid=c.id
	left join 
		teacher as t 
	on 
		class.tid=t.id
	left join 
		classaddress as addr
	on
		class.addrid=addr.id
	left join 
		weeks as w
	on 
		class.weekid=w.id
	left join 
		time as tt
	on
		class.timeid=tt.id
	left join
		classmuch as much
	on class.mid=much.id
	left join
		timerange as timeR
	on class.mid=timeR.id
	where 
		class.sid=?`
}



//----查找管理员信息----//
exports.findManager = function(tab){
    return `select 
	id,name,age,sex,phone,address,qq,email,phone2,descriptions
	from 
		${tab}
	where 
		id=?
	`
}

//----查看管理员的名字---//
exports.findManagerName = function(tab){
    return `select id,name from ${tab} where id=?`
}

//----查找系名----//
exports.findDepartment = function(){
	return `select id,name from department`
}

//----查找系名对应的课程----//
exports.findDepartementCourse = function(){
	return `select 
		d.id as "departmentID",d.name as "department",c.id as "courseID",c.name as  "course"
	from 
		department_course as dc 
	left join 
		department as d 
	on 
		dc.did=d.id
	left join 
		course as c
	on
		dc.cid=c.id
	`
}

//----查找根据系名查找课程----//
exports.findCourse = function(){
	return `
		select 
			c.id,c.name 
		from 
			department_course as dc 
		left join
		 	course as c 
		on  dc.cid=c.id
		where 
			dc.did=?
	`
}

exports.findDepartment_course = function(){
    return `select 
		d.id as "departmentID",d.name as "department",c.id as "courseID",c.name as  "course"
	from 
		department_course as dc 
	left join 
		department as d 
	on 
		dc.did=d.id
	left join 
		course as c
	on
		dc.cid=c.id
	where 
		dc.cid=? and d.id=?
	`
}

exports.findTeacher = function(){
	return`
	select 
	id,name as "teachername",sex as "teacherSex",phone as "teacherPhone",address as "address",age
from 
	teacher 	
	`
}

exports.findTeacherS = function(){
    return`
	select 
	id,name as "teachername",sex as "teacherSex",phone as "teacherPhone",address as "address",age
from 
	teacher
where
    teacher.id=?	
	`
}

exports.filterTeacher = function(param){
	let filter = `%${param}%`
	return `
	select 
		id,name as "teachername",sex as "teacherSex",phone as "teacherPhone",address as "address" 
	from 
		teacher 
	WHERE 
		CONCAT(id,name,sex,phone,address,age) LIKE '${filter}'
	`
}

exports.teacherDetail = function(){
	return `
		select 
			t.id as "teacherID",t.name as "teacherName",t.sex as "teacherSex",t.age as "teacherAge",t.address as "teacherAddress",t.phone as "teacherPhone",
			c.name as "courseName", c.id as "courseID",
			addr.addr as "courseAddress",
			wk.week as "courseweek",
			timeR.range as "courseTime",
			tim.time as "courseT"
		from 
			class as clas
		left join 
			teacher as t
		on 
			clas.tid=t.id
		left join 
			classaddress as addr
		on 
			clas.addrid=addr.id
		left join 
			weeks as wk
		on 
			clas.weekid=wk.id
		left join 
			timerange as timeR
		on 
			clas.time=timeR.id
		left join
			course as c
		on 
			clas.cid=c.id
		left join
			time as tim
		on
			clas.timeid=tim.id
		where 
			clas.tid=?`
}


exports.findSingleTeacher = function(){
	return `
		select 
			id,name,age,sex,phone,address
		from 
			teacher
		where
			teacher.id=?
	`
}

exports.updateTeacher = function(){
	return `
	
		update 
			teacher 
		set name=?,
			age=?,
			address=?,
			phone=?,
			sex=? 
		where 
			id=?
	`
}


exports.findStudent = function(){
	return `
	select 
		s.id,s.name,s.age,s.sex,s.phone,s.phone2,s.address,s.introduction,s.qq,s.email,
		d.name as 'department',
		c.name as 'class'
	from 
		student as s
	left join 
		department as d
	on
		s.depid=d.id
	left join
		classes as c
	on
		s.classid=c.id
	
	
	`
}


/*
* 使用存储过程
*
* DELIMITER $$
create PROCEDURE findStudentFilter(
	in `departmentFilter` INTEGER,
	in `classesFilter`  INTEGER,
	in `courseFilter` INTEGER,
	in ageStartFilter INTEGER,
	in ageEndFilter INTEGER,
	in `sexFilter` char(1)
)

BEGIN
	select distinct
			s.id,s.name,s.age,s.sex,s.phone,s.phone2,s.address,s.introduction,s.qq,s.email,
			d.name as 'department',
			c.name as 'class'
		from
			student as s
		INNER join
			department as d
		on
			s.depid=d.id
		INNER join
			classes as c
		on
			s.classid=c.id
		INNER join
			class as clas
		on
			s.id=clas.sid
		INNER join
			course as cou
		on
			cou.id=clas.cid
		where
			d.id = if(`departmentFilter` is null,d.id,`departmentFilter`)
		and
			c.id = if(`classesFilter` is null,c.id,`classesFilter`)
		and
			cou.id = if(`courseFilter` is null,cou.id,`courseFilter`)
		and
			s.age BETWEEN if(ageStartFilter is null,s.age,ageStartFilter) and if(ageEndFilter is null,s.age,ageEndFilter)
		and
			s.sex = if(`sexFilter` is null,s.sex,`sexFilter`);
END;
$$
DELIMITER ;

CALL findStudentFilter(null,null,null,20,22,null)
*
*
* */

exports.findStudentFilterList = function(d,c,c1,s,a){
	var dFilter
	var classFilter
	var courseFilter
	var	sexFilter
	let startAge = 0
	let endAge = 0

	if(!d){
        dFilter = null
	}else{
        dFilter = parseInt(d)
	}
	if(!c){
        classFilter = null
	}else{
        classFilter = parseInt(c)
	}
	if(!c1){
        courseFilter = null
	}else {
        courseFilter = parseInt(c1)
    }
	if(!s){
        sexFilter = null
	}else{
		switch (parseInt(s)){
            case 0:
                sexFilter = '男'
                break;
            case 1:
                sexFilter = '女'
                break;
            default:
                sexFilter = null
                break;
		}
	}

    if(a){
        ageFilter = parseInt(a)
        switch(ageFilter){
            case 0:
                startAge = 10
                endAge = 15
                break;
            case 1:
                startAge = 15
                endAge = 20
                break;
            case 2:
                startAge = 20
                endAge = 25
                break;
            case 2:
                startAge = 25
                endAge = 30
                break;
        }

    }else{
        startAge = 0
        endAge = 100
    }

	return `CALL findStudentFilter(${dFilter},${classFilter},${courseFilter},${startAge},${endAge},${sexFilter})`
}

exports.findCourseAll = function(){
    return `
		select id,name from course 		`
}

exports.findclassesAll = function(){
	return `
		select id,name from classes
	`
}

exports.studentDetail = function(){
    return `
		select 
			s.id as "studentID",s.name as "studentName",s.sex as "studentSex",s.age as "studentAge",s.address as "studentAddress",s.phone as "studentPhone",
			s.qq as "studentQQ",s.email as "studentEmail",s.introduction as "studentIntroduction",
			dep.name as "studentDepartment",
			class.name as "studentClass",
			c.name as "courseName", c.id as "courseID",
			addr.addr as "courseAddress",
			wk.week as "courseweek",
			timeR.range as "courseTime",
			tim.time as "courseT"
		from 
			class as clas
		left join 
			student as s
		on 
			clas.sid=s.id
		left join 
			department as dep
		on 
			dep.id=s.depid
		left join 
			classes as class
		on 
			class.id=s.classid
		left join 
			classaddress as addr
		on 
			clas.addrid=addr.id
		left join 
			weeks as wk
		on 
			clas.weekid=wk.id
		left join 
			timerange as timeR
		on 
			clas.time=timeR.id
		left join
			course as c
		on 
			clas.cid=c.id
		left join
			time as tim
		on
			clas.timeid=tim.id
		where 
			clas.sid=?`
}


exports.findSingleStudent = function(){
    return `
		select 
			id,name,age,sex,phone,address,phone2,introduction,email,qq
		from 
			student
		where
			student.id=?
	`
}


exports.updateStudent = function(){
    return `
		update 
			student 
		set 
		    name=?,
		    age=?,
		    sex=?,
		    phone=?,
		    address=?,
		    phone2=?,
		    introduction=?,
		    email=?,
		    qq=?
		where 
			id=?
	`
}


//------查询老师的课程表-----//
exports.findTeacherClasstable = function(tab){
    return `
	select 
		c.name as "course",t.name as "teacher",addr.addr as "address",w.id as "weekID",
		w.week as "weekName",tt.id as "timeID",tt.time as "timeName" ,much.id as "muchID",
		much.name as "classMuch",timeR.range as "timeRange"
	from 
		class 
	left join 
		course as c 
	on 
		class.cid=c.id
	left join 
		teacher as t 
	on 
		class.tid=t.id
	left join 
		classaddress as addr
	on
		class.addrid=addr.id
	left join 
		weeks as w
	on 
		class.weekid=w.id
	left join 
		time as tt
	on
		class.timeid=tt.id
	left join
		classmuch as much
	on class.mid=much.id
	left join
		timerange as timeR
	on class.mid=timeR.id
	where 
		class.tid=?`
}


exports.findGradeTable = function(){
    return `
        select 
            n.id as "numberID",n.number as "numberName",n.quota as "numberQuota",
            c.assessContent as "content"
        from 
            gradetable as g
        left join 
            assessnumber as n
        on 
                g.nid=n.id
        left join
            assesscontent as c
        on
            g.cid=c.id
    `
}

exports.publish = function(){
    return `
        insert into publish(path,isPublish,msg,tip)  values(?,?,?,?)
    `
}

exports.isPublish = function(){
    return  `
        select isPublish from publish 
`
}


exports.addTeachEvaluation = function(numberName,numberQuota,str){
    return `call addTeachEvaluation("${numberName}","${numberQuota}","${str}")`
}


/*
*
* 存储过程代码实现(带事务的存储过程)
*
delimiter $$;

drop procedure addTeachEvaluation;

create procedure addTeachEvaluation(
in assessNumber char(1),
in assessQuota char(20),
in str TINYTEXT
)

begin

	declare substr varchar(80);

	declare len int default 0;

	declare n int DEFAULT 0;

	declare s varchar(80);

	declare count int DEFAULT 0;

	declare assessnumberID int(10) default 0;

	declare tmpID int(10) DEFAULT 0;

	declare tmpIDStr TINYTEXT DEFAULT '';

	declare i  int(10) DEFAULT 0;

	declare contentsIDStr  TINYTEXT DEFAULT '';

	declare IDStr CHAR(10) DEFAULT '';

	declare id int(10) DEFAULT 0;

	declare id_len int DEFAULT 0;

	declare tmp_tr TINYTEXT DEFAULT '';

	declare counter_len int DEFAULT 0;

	declare t_error int DEFAULT 0 ;

	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET t_error=1;

	select length(str) into n;

	set s=str;

	start TRANSACTION;

		-- 添加到assessnumber表中
		if assessNumber is not null and assessQuota is not null then

				insert into assessnumber(number,quota) value(assessNumber,assessQuota);

				select LAST_INSERT_ID() into assessnumberID;

		end if;

		-- 循环添加到assesscont表中
		while count<n DO

			select substring_index(s,'|',1) into substr; -- wwww.baidu.com|www.yagao.com|www.qiqi.com

			insert into assesscontent(assessContent) value(substr);

			select LAST_INSERT_ID() into tmpID;

			select CONCAT(tmpIDStr,tmpID,"|") into tmpIDStr;  -- 2|3|4|

			select concat(substr,"|") into substr;   -- wwww.baidu.com

			select length(substr) into len;   -- length("wwww.baidu.com|")

			select replace(s,substr,"") into s;  -- substr='www.yagao.com|www.qiqi.com'

			set count=count+len;

		end while;


		if assessnumberID is not null and length(tmpIDStr)>0 then

			set n=length(tmpIDStr);

			set contentsIDStr=tmpIDStr;

			while counter_len<n DO

					-- contentsIDStr :8|9|10|

					set i=i+1;

					select substring_index(contentsIDStr,'|',1) into IDStr; --  8

					select CAST(IDstr as SIGNED) into id;   -- 字符8转换成数字8

					insert into gradetable(nid,lid,cid) value(assessnumberID,i,id); -- 插入gradetable表

					select CONCAT(IDStr,"|") into tmp_tr;  -- 8|

					select length(tmp_tr) into id_len;   -- length("8|")

					select replace(contentsIDStr,tmp_tr,"") into contentsIDStr;  -- substr='9|10|'

					set counter_len=counter_len+id_len;

			end while;

			end if;

			if i=3 then

					insert into gradetable(nid,lid,cid) value(assessnumberID,4,null);

			end if;

if t_error=1 then

	ROLLBACK;

	else

		COMMIT;

	end if;

-- 返回是否正确
select t_error;

end

call addTeachEvaluation('C',"测试","wwww.baidu.com|www.yagao.com|www.qiqi.com");
* */


exports.findAssessNumber_number = function(tab){
    return `
    
        select number,quota from ${tab}
    `
}

//获取等级表assesslevel

exports.getAssessLevel = function(){

    return `
    
        select * from assesslevel;
    
    `
}


//得到发布信息
exports.getPublishInformation = function(){
    return `
        select * from publish
    `
}


exports.modifyPublish = function(){
    return `
        update publish set isPublish=?,msg=?,tip=? where id=?
    `
}


//查看是否发布教学质量评价
exports.getTips = function(){
    return `
        select isPublish,msg,tip from publish
    `
}

//获得已评价的课程和老师
exports.getAlreadyTandC = function(){
    return `
        select 
            c.name as "courseName",c.id as "courseID",
            t.name as "teacherName",t.id as "teacherID"
        from 
            grade as g
        
        left join 
            course as c
        on 
            g.cid=c.id
        left join
            teacher as t
        on
            g.tid=t.id
        left join 
            student as s
        on 
            g.sid=s.id
        where
            g.sid=?
        and
            g.ismarked=1
    `
}

exports.getStudentAlreadyCourse = function(){
    return `
        select DISTINCT
                c.id as "courseID",c.name as "courseName",
                t.id as "teacherID",t.name as "teacherName"
        from 
            class as clas
        left join 
            course as c
        on 
            clas.cid=c.id
        left join 
            teacher as t
        on 
            clas.tid=t.id
        left join 
            student as s
        on
            clas.sid=s.id
        where 
            s.id=?
    `
}

//获取指定学生指定教师的课程
exports.getCourseWithTandS = function(){
    return `
    select DISTINCT
		c.id as "courseID",c.name as "courseName",
		t.id as "teacherID",t.name as "teacherName"
    from 
        class as clas
    left join 
        course as c
    on 
        clas.cid=c.id
    left join 
        teacher as t
    on 
        clas.tid=t.id
    left join 
        student as s
    on
        clas.sid=s.id
    where 
        s.id=?
    and
        t.id=?
    `
}

//获取已评价的指定学生指定教师的课程
exports.getAlreadyCourseWithTandS = function(){
    return `
        select 
            c.name as "courseName",c.id as "courseID",
            t.name as "teacherName",t.id as "teacherID"
        from 
            grade as g
        
        left join 
            course as c
        on 
            g.cid=c.id
        left join
            teacher as t
        on
            g.tid=t.id
        where
            g.sid=?
        and
            g.ismarked=1
        and
            g.tid=?
    `
}


/*
*
*
* 增加评教和实现留言功能存储函数
*
* delimiter $$;

drop procedure addTeachEvaluate;

create procedure addTeachEvaluate(
	in teacherID bigint(10),
	in studentID bigint(10),
	in courseID int(4),
	in ismarked int,
	in dataStr TINYTEXT,
	in isSendMsg int,
	in msg MEDIUMTEXT,
	in numStr TINYTEXT
)

begin

	declare t_error int default 0;

	declare count int default 0;

	declare n int default 0;

	declare s MEDIUMTEXT DEFAULT "";

	declare subStr char(30) DEFAULT "";

	declare s1 MEDIUMTEXT DEFAULT "";

	declare subStr1 char(30) DEFAULT "";

	declare assessnumberID int(10) DEFAULT 0;

	declare g int(11) DEFAULT 0;

	declare tmpIDStr MEDIUMTEXT DEFAULT "";

	declare tmpGrade MEDIUMTEXT DEFAULT "";

	declare len int default 0;

	declare tmpLen int DEFAULT 0;

	declare countLen int DEFAULT 0;

	declare i int DEFAULT 0;

	DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET t_error=1;

	start TRANSACTION;

	if teacherID is not null and studentID is not null and courseID is not null and ismarked is not null then

			insert into grade(cid,tid,sid,ismarked) value(courseID,teacherID,studentID,ismarked);

	end if;


	if isSendMsg=1 then

		insert into message(sid,tid,time,msg) value(studentID,teacherID,"2019-04-09 12:45:55",msg);

	end if;

	set s=dataStr;

	set s1=numStr;

	select length(dataStr) into n;

	while count<n DO

			-- 1|2|3|4|5|
			-- 10|9|10|8|10|

			set tmpIDStr="";

			set tmpGrade="";

			select length(s) into countLen;  -- 10

			select substring_index(s,'|',1) into substr; 	-- 10  9 10

			select substring_index(s1,'|',1) into substr1;  -- 1  2 3

			select CAST(substr as SIGNED) into g; -- 分数 10 9 10

			select CAST(substr1 as SIGNED) into assessnumberID; -- ID 1 2  3

			insert into typegrade(aid,cid,tid,sid,grade) value(assessnumberID,courseID,teacherID,studentID,g); -- 1 2 3

			select CONCAT(tmpIDStr,assessnumberID,"|") into tmpIDStr; -- 1|  2|  3|

			select CONCAT(tmpGrade,g,"|") into tmpGrade;	 -- 10|  9|

			select length(tmpGrade) into len;   -- length("wwww.baidu.com|")

			set tmpLen=countLen-len;  -- 10  8

			select right(s,tmpLen) into s;

			select replace(s1,tmpIDStr,"") into s1;   -- 2|3|4|

			set count=count+len;

		end while;

	if t_error=1 then

		ROLLBACK;

	else

		COMMIT;

	end if;

	select t_error;

end
*
*
*call addTeachEvaluate(4015201003,6015203105,2,1,"10|9|10|8|10|",1,"你好，我在跟您留言","1|2|3|4|5|");
*
* */

//增加评教和实现留言
exports.addTeachEvaluate = function(teacherID,studentID,courseID,ismarked,isSendMsg,dataStr,numStr,msg,time){
    console.log(arguments)
    return `
        call addTeachEvaluate(${teacherID},${studentID},${courseID},${ismarked},"${dataStr}",${isSendMsg},"${msg}","${numStr}","${time}")
    `
}



//查看留言

exports.findMessage = function(){
    return `
        select 
            s.name as "studentName",s.id as "studentID",
            d.name as "department",
            clas.name as "classes",
            m.time as "time",m.msg as "msg"
        from 
            message as m
        left join 
             student as s
        on
            m.sid=s.id
        left join 
            classes as clas
        on 
            clas.id=s.classid
        left join 
             department as d
        on
            d.id=s.depid
        where 
            m.tid=?
        ORDER BY m.time DESC
    `
}

//根据系名得到班级

exports.getClasses = function(){
    return `
        select 
            c.name as "classesName",c.id as "classesID"
        from 
            classes as c
        left join 
            department as d
        on d.id=c.depid
        
        where 
            d.id=?
    `
}

//得到所有班级评价
exports.getAllClassesEvaluato = function(){

}


//得到所有上过我的课的学生的评价
exports.getAllReadyClassEvaluato = function(){
    return `
        select 
	        g.tid as "teacherID",g.cid as "courseID",g.sumgrade as "sumGrade",
	        c.name as "courseName"
        from 
            grade as g
        left join 
            course as c
         on 
            c.id=g.cid
        where 
            g.ismarked=1
        and 
            g.tid=?
    `
}

exports.getAllTeacherEvaluato = function(){
    return `
         select 
			g.tid as "teacherID",g.cid as "courseID",g.sumgrade as "sumGrade",
			c.name as "courseName",
			t.name as "teacherName"
		from 
				grade as g
		left join 
				course as c
		 on 
				c.id=g.cid
		left join 
				teacher as t
		on
				t.id=g.tid
		where 
				g.ismarked=1


    `
}

//查询全部指标
exports.findassesslevel  = function(){
    return `
        select * from assessnumber
    `
}

exports.findnumbercontent = function(){
    return `
        
    `
}


//查询指定指标的相关内容
exports.findcontent_number = function(){
    return  `
        select 
            a.quota as quota,
            ass.assessContent  as assessContent,
            ass.id as assessContentID
        from 
            assessnumber as a 
        left join 
            gradetable as g 
        on 
            a.id=g.nid 
        left join 
            assesscontent as ass 
        on 
            g.cid=ass.id 
        where 
            a.id=?
    `
}

//修改教学质量评价内容
exports.updateTeachEvaluation = function(numberid,numberQuota,content_str,assesscontentID){
    return `
         call updateTeachEvaluation(${numberid},'${numberQuota}','${content_str}','${assesscontentID}')
    `
}

//寻找学生是多少届
exports.findsessionS = function(){
    return `
        select session from session where id=?
    `
}

exports.updateS = function(){
    return `
        update student set name=?,sex=?,phone=?,qq=?,email=?,address=?,introduction=? where id=?
    `
}


//返回指定的届
exports.findSession = function(){
    return `
        select id,session from session
    `
}

exports.insertPublish = function(){
    return `
        insert into publish(isPublish,msg,tip,sessionid,endtime,starttime,depid,time) value(?,?,?,?,?,?,?,?);
    `
}

//查询学生属于哪一届学生 //查询学生属于哪个系
exports.findStudentSaD = function(){
    return `
        select sessionid,depid from student where id=?;
    `
}

exports.findPublish = function(){
    return `
        select * from publish where sessionid=? and depid=? and time=?;
    `

}


