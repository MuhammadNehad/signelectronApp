var curuser = null;
if(localStorage.getItem("curuser"))
{
    curuser = JSON.parse(localStorage.getItem("curuser"));

}else{
    window.location.href="../views/login.html"
}


if(!localStorage.getItem("googleMap_apiKey") || !localStorage.getItem("googleApp_MailAddress") || !localStorage.getItem("googleApp_Password")||!localStorage.getItem("IPAddress"))
{
getRequest(hostName+"api/myKeys",(res)=> {
    localStorage.setItem("googleMap_apiKey",res[0]["googleMap_apiKey"]);
    localStorage.setItem("googleApp_MailAddress",res[0]["googleApp_MailAddress"]);
    localStorage.setItem("googleApp_Password",res[0]["googleApp_Password"]);
    localStorage.setItem("IPAddress",res[0]["IPAddress"]);
},()=>{});
}