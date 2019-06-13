const mysql = require("mysql"),
	DBconfig = require("../config/DBconfig");
let pool = ""

//---创建一个数据库连接池---//
pool = mysql.createPool(DBconfig)

	//---从连接池获取一个连接实例----//
	function fn(func,sql,param){
		return new Promise((resolve,reject)=>{
			pool.getConnection((err,connection)=>{
				if(err){
					reject(err)
					console.log("创建连接池失败")
				}
				else{
					func(connection,sql,param).then(res=>{
						connection.release()
						resolve(res)
					}).catch(q_err=>{
						reject(q_err)
					})
				}
			})
		})
	}

module.exports = {
	fn
}

