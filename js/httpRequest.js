var permsQuery = "";


function getRequest(url,response,alwaysFunc,data =null) {
    $.get(url,data,function(res){
        response(res);
    },"json").always(function() {
        alwaysFunc();
      })
}

function postRequest(url, data, response,alwaysFunc,authenticatedata=null) {
    $.post(url, data,
        function (res) {
            response(res);
        }
    ).setRequestHeader((xhr)=> {
        xhr.setRequestHeader ("Authorization", (authenticatedata?("Basic " + window.atob(authenticatedata.username + ":" + authenticatedata.password)):null));
    },).always(function() {
        alwaysFunc();
      })
}

function putRequest(url, data, response,alwaysFunc) {
    $.ajax({
        url: url, type: 'PUT'
        , data: data,
        success: function (res) {
            response(res);
        }
    }
    ).always(function() {
        alwaysFunc();
      })
}

function deleteRequest(url,data,response,alwaysFunc) {
    $.ajax({
        url: url, type: 'DELETE'
        , 
        success: function (res) {
            response(res);
        }
    }
    ).always(function() {
        alwaysFunc();
      })
}

function logout() {
    localStorage.removeItem("curuser")
    window.location.href="../views/login.html";

}

function checkPermission(api,paramname,perms,afterWardFunc)
{

  var permsLen =perms.length;
  if(perms.length >0)
  {
    if(api.includes("?") || permsQuery.includes("?"))
    {
      permsQuery+="&"
    }else{
    permsQuery +="?"
    }
    var i =0;
    for (const key in perms) {
      permsQuery += `${paramname}[${i}]=${perms[key]}`
      if(i<permsLen-1)
      {
        permsQuery+=`&`;
        i++;
      }
    }
  }
  afterWardFunc()
}
$(()=>{
    $("#logout").on("click",function(e) {
        logout();
    })
    if(typeof curuser != 'undefined' && curuser != null )
    {
        if(curuser.mrole[0]["name"] == "admin")
        {

                
            if($("nav").length >0)
            {
                $("nav div ul.navbar-nav").append('<li class="nav-item">'+
                '<a class="nav-link" href="secretData.html" id="addAuthdata">Auth Data</a>'
                +'</li>')
            }else{
                if($("#addAuthdata")!= null && $("#addAuthdata").length >0)
                {
                    $("#addAuthdata").remove();
                }
            }
    }
    }
})
if($.fn.dataTable){
$.fn.dataTable.ext.errMode = 'none';
}