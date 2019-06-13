const type = require("../config/type");

//{ TYPE: { student: 1, teacher: 2, manager: 3 } }
exports.func = function(t){
	for(var tt in type.TYPE){
		if(t == type.TYPE[tt])
			return tt
	}
}
