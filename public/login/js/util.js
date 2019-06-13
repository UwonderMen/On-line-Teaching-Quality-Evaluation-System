//----账户密码检查----//
function syntaxCheck(){
		var username = ""
		var pwd = ""
		$("#username").blur(function(){
			username = $(this).val()
			if(username.length == 0|| regexp.exec(username) == null){
				loginFlag.u = 0
				$(this).addClass("error")
				return false
			}else{
				$("#username").removeClass("error")
				loginFlag.u = 1
			}
		})
		$("#username").focus(function(){
			$("div.report").get(0).style.display = "none"
		})
		$("#password").focus(function(){
			$("div.report").get(0).style.display = "none"
		})
		$("#password").blur(function(){
			pwd = $(this).val()
			//限制密码的长度
			if( pwd.length == 0 || pwd.length < 2){
				loginFlag.p = 0
				$(this).addClass("error")
				return false
			}else{
				$(this).removeClass("error")
				loginFlag.p = 1
			}
		})

		$("#button").on("click",function(){
			accessFlag = 0
			for(key in loginFlag){
				if(loginFlag[key] == 1){
					accessFlag++
				}
			}
			if(accessFlag !== 2){
				$("div.report").get(0).style.display = 'block'
				$("div.report span").html(err.tip)
				$("#password").addClass("error")
				$("#username").addClass("error")
				return false
			}else{
				login()
		}
	})
}

//-----登陆处理-----
var login = function(){
    var username = $("#username").val()
    var password = $("#password").val()
    var type = $("input[type='radio']:checked").val()

	$ele = $("input[type='radio']:checked")
	if($ele.length == 1 ){
			$("div.report").get(0).style.display = "none"
		    var user = {
		      username:username,
		      password:password,
		      type:type
		    }
		    $("div#flag").addClass("model")
			$("body").css({
                "overflow":"scroll",
				"overflow-y":"hidden"
			})
		    $.ajax({
		        url:"/login/dologin",
		        type:"post",
		        data:user,
		        dataType:"json",
		        // timeout:60,
		        success:function(res){
		        	if(res.status === 200){
		        		$("div#flag").removeClass("model")
		        		location.href = res.path
		        	}
		        },
		        error:function(err){
		        	console.log(err)
		            if(err.responseJSON.state === 1000){
		            	$("div#flag").removeClass("model")
		            	$("#password").addClass("error")
						$("#username").addClass("error")
						$("div.report").get(0).style.display = "block"
                        $("body").css({
                            "overflow":"scroll",
                            "overflow-y":"block"
                        })
		            	$("div.report span").html(err.responseJSON.ms)
		            }
		        }
		    })
		}else{
			$("div.report").get(0).style.display = "block"
			$("div.report span").html("请选择您的角色！")
			return
		}


}
