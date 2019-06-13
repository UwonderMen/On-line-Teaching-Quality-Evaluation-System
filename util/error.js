let error = {
	msg:"",
	status:0,
}
let inputErr = function(status,msg){

	error.status = status
	error.msg = msg
	
	return error
}

module.exports = inputErr


