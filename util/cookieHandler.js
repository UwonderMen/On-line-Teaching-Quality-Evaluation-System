let  options = {
	maxAge:6400,
	path:'/',
	secure:false,
	httpOnly:true,
	overwrite:false
}

exports.setCookie = function(ctx,data){
	ctx.cookies.set(data["key"],data["val"])
}

exports.getCookie = function(ctx,name){
	return ctx.cookies.get(name)
}

exports.modifyCookieConfig = function(config,key,ctx){
	for(var con in options){
		for(var op in config){
			if(con === op){
				options[op] = config[op]
				break
			}
		}
	}
    ctx.cookies.set(key,"",options)
}