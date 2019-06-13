
let error = {
	msg:"",
	status:0
}

var sqlError = function(msg,status){
	error.msg = msg
	error.status = status
	return error
}


module.exports = sqlError