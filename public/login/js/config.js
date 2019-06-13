var	loginFlag = {
	u:0,
	p:0,
}
var accessFlag = 0
var	err = {
		tip:"请输入正确的账户和密码!",
		error:"账号密码不正确!"
}
var	restr = /^[0-9]{10}$/
var	regexp = (new RegExp()).compile(restr)