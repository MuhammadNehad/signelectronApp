const employeesapi = `${hostName}api/Emplyees`;
var curuser = null;
if(localStorage.getItem("curuser"))
{
curuser = JSON.parse(localStorage.getItem("curuser"));
window.location.href="../views/index.html"

}
$(()=>{
    $("#login").on('click',function (e) {
        var data ={}
        data.empCode = $("#empCode").val() 
        data.password = $("#password").val()

        getRequest(employeesapi+`/Login/${data.empCode}/${data.password}`,function (res) {
           console.log(res); 
           if(res)
           {
           localStorage.setItem("curuser",JSON.stringify(res));
            window.location.href="../views/index.html"
            }else{
                alert("failed");
            }
        },function (res) {
            
        });
    })
});