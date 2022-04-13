
const empsView = document.querySelector("#employeesTable");
const empsViewbody = document.querySelector("#eTBody");
var empId = curuser.id;
var empCode = curuser.empCode;
const elv = `${hostName}api/EmpsLocView`;

const empD = `${hostName}api/Emplyees/GetEmplyeesWithattendings`;
const empDURIQuery =`?curEmp.id=${empId}&curEmp.empCode=${empCode}`;

const permsapi =`${hostName}api/Permissions`;
const permsapiURIQuery = ``;
var empsData = {};
const getEmpsLocView = async () => {
     getRequest(elv,function(data)
     {
        permsQuery="";
        for(var key in data)
         {
            data[key]["totalHours"] =Number(data[key]["totalHours"])/60/60; 

         }
            loadDataInTable(data);
        });
}
const getEmpsData = async () => {
    var empName = $('#empName').val();
    var datetime = new Date(Date.now());
    var year = datetime.getFullYear();
    var month = datetime.getMonth();
    var day = datetime.getUTCDate();
    var fromdate = `${month}/${month==2 && day>3?day -3:day}/${year}`;
    var todate = `${month+1}/${day}/${year}`;
    var period = $("#period").val();
    var selectedfrDate = $("#fromdate").val();
    var selectedtoDate = $("#todate").val();
    if(selectedfrDate &&selectedfrDate.trim().length>0)
    {
        var frdatetime = new Date(selectedfrDate);
         year = frdatetime.getFullYear();
         month = frdatetime.getMonth();
         day = frdatetime.getUTCDate();
         fromdate = `${month+1}/${day}/${year}`;
        if(selectedtoDate &&selectedtoDate.trim().length>0)
        {
           var todatetime = new Date(selectedtoDate);
            year = todatetime.getFullYear();
            month = todatetime.getMonth();
            day = todatetime.getUTCDate();
            todate = `${month+1}/${day}/${year}`;
            if(todatetime<frdatetime)
            {
                alert("يجب ان يكون بداية الفترة اقل من نهاية الفترة");
                return;

            }
        }else{
            alert("يجب ادخال نهاية الفترة المحددة");
            return;
        }
    }
    

    checkPermission(permsapiURIQuery,'permsNames',['Emplyees view','roles view','EmpsLocation view'],function(){
        getRequest(permsapi+`/getByName`+permsapiURIQuery+permsQuery,function(res){
            permsQuery="";
            if(res["status"] == 200 )
          {
            
            checkPermission(empDURIQuery,'permsNames',res['permsL'],function(){

                    getRequest(empD+empDURIQuery+permsQuery+`&from=${fromdate}&to=${todate}&period=${period}&empName=${empName}&parentId=${curuser["mrole"][0]["id"]}`,function(data)
                        {
                            empsData = data;
                            dataHandles(data,period);
                        },function(res){

                        });
                    });

                    }
            }, function () {
                permsQuery = '';
            });
        });
}
loadDataInTable = (datas) => {
    var html = '';
    // for (const key in data) {
    //     if (Object.hasOwnProperty.call(data, key)) {
    //         const element = data[key];
            
    //         // html += `<tr><td>${element['eLocaddress']}</td><td>${element['empName']}</td><td>${element['empPhone']}</td><td>${element['empemail']}</td> </tr>`
    //         // empsViewbody.innerHTML +=html;
    //     }
    // }

    datatable =$('#employeesTable').DataTable();
datatable.clear();
datatable.rows.add(datas);
datatable.draw(false);
}

loadEmpDataInTable = (datas) => {
    var html = '';
    // for (const key in data) {
    //     if (Object.hasOwnProperty.call(data, key)) {
    //         const element = data[key];
            
    //         // html += `<tr><td>${element['eLocaddress']}</td><td>${element['empName']}</td><td>${element['empPhone']}</td><td>${element['empemail']}</td> </tr>`
    //         // empsViewbody.innerHTML +=html;
    //     }
    // }
    datatable =$('#employeesTableTimeable').DataTable({
        'aoColumns': [ 
            { sWidth: "20%", bSearchable: true, bSortable: false,data:"eLocaddress" }, 
            { sWidth: "10%", bSearchable: false, bSortable: false,data:"name" },
            { sWidth: "10%", bSearchable: false, bSortable: false ,data:"phone"},
            { sWidth: "10%", bSearchable: false, bSortable: false ,data:"email"},
            { sWidth: "10%", bSearchable: false, bSortable: false ,data:"from"},
            { sWidth: "10%", bSearchable: false, bSortable: false ,data:"to"},
            { sWidth: "7%", bSearchable: false, bSortable: false ,data:"Tardiness"},
            { sWidth: "7%", bSearchable: false, bSortable: false ,data:"additions"},
            { sWidth: "7%", bSearchable: false, bSortable: false ,data:"totalHours"},
            { sWidth: "7%", bSearchable: false, bSortable: false ,data:"date"},

            

            ],
            dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
            ]
    });
// $('#employeesTableTimeable').DataTable();
datatable.clear();
datatable.rows.add(datas);
datatable.draw(false);
}
calchours = ()=>
{
    
}



function dataHandles(data,period)
{
    permsQuery="";
    var options  ={
        timeZone:'Africa/Cairo',
        year:'numeric',
        month:'numeric',
        day:'numeric',
        hour:'numeric',
        minute:'numeric',
        second:'numeric'
    }
    formatter = new Intl.DateTimeFormat([],options);
    var datestart = new Date();
    datestart.setHours(9,15,0);
    var cstart =new Date(formatter.format(datestart)); 
    
    var dateend = new Date();
    dateend.setHours(17,30,0);
    var cend =new Date(formatter.format(dateend));
    var latestLoc ="";
    var showIngData = [];
    for(var key in data)
    {
        var subData = data[key];
        var userDay = subData[0];
        var curdateString="";
        var curDay;
        var dateChanged = true;
        userDay["Tardiness"]=0;               
        userDay["additions"]=0;
        userDay["totalHours"] =0;
        userDay["eLocaddress"] ="";
        for(var dk in subData)
        {
            
            curDay = subData[dk]["atdt"];
            datestart = new Date(curDay);
            if(curdateString != datestart.toDateString())
            {
                curdateString = datestart.toDateString();
                userDay["atdt"] = curDay;
                dateChanged =true;
   
            }
            datestart.setHours(9,15,0);
            cstart  =new Date(formatter.format(datestart));
            dateend = new Date(curDay);
            dateend.setHours(17,30,0);
            cend =new Date(formatter.format(dateend));


            if(period == "day")
            {
            userDay["date"] = curdateString;
              }else if(period == "month")
              {
            userDay["date"] = datestart.getFullYear() + "-" + (datestart.getMonth()+1);

              }
              else if(period == "year")
              {
            userDay["date"] = datestart.getFullYear();

              }

            if(!userDay["eLocaddress"].includes(userDay["location"]["address"].trim()))
            {
                if(userDay["eLocaddress"].trim().length>0)
                {
                    userDay["eLocaddress"]+=",";
                }
                userDay["eLocaddress"]+=subData[dk]["location"]["address"];
            }
            if(userDay)
            {
                if(dateChanged)
                {
                if(userDay.entering == true){
                    if(period == "day")
                    {
                    userDay["from"] = userDay["atdt"];
                      }
                    var attsDt = new Date(userDay["atdt"]);
                    if(attsDt>cstart)
                    {
                        userDay["Tardiness"]=userDay["Tardiness"]+((attsDt.getTime()-cstart.getTime())/(1000*60));
                        
                   dateChanged =false;
                    }
                }
                 }
            }
//            var etAtt =data[key][dk]["mAttendings"].find(at=>at.entering ==false)
            if(userDay){
                if(period == "day")
                {
                userDay["to"] =curDay;
                  }
                   if(userDay.entering == false){
                    if(dk == subData.length-1)
                var atteDt = new Date(curDay)
                    if(atteDt>cend)
                    {
                        userDay["additions"]=userDay["additions"]+Math.floor(((atteDt.getTime()-cend.getTime())/(1000*60)));

                    }
                }
            }

                userDay["totalHours"]+=(Number(subData[dk]["leaveAfter"])/60)/60;
                userDay["name"] = userDay["aemplyee"]["name"];
                userDay["phone"] = userDay["aemplyee"]["phone"];
                userDay["email"] = userDay["aemplyee"]["email"];
                userDay["empCode"] = userDay["aemplyee"]["empCode"];
                userDay["role"] = userDay["aemplyee"]["mrole"]["name"];
        
    }
    showIngData.push(userDay);
    }
    loadEmpDataInTable(showIngData);

}
$( function () {
    // $('#employeesTable').DataTable({
    //     'aoColumns': [ 
    //         { sWidth: "25%", bSearchable: true, bSortable: false,data:"eLocaddress" }, 
    //         { sWidth: "25%", bSearchable: false, bSortable: false,data:"empName" },
    //         { sWidth: "15%", bSearchable: false, bSortable: false ,data:"empPhone"},
    //         { sWidth: "20%", bSearchable: false, bSortable: false ,data:"empemail"},
    //         { sWidth: "15%", bSearchable: false, bSortable: false ,data:"totalHours"},

    //         ],
    //         dom: 'Bfrtip',
    //     buttons: [
    //         'copy', 'csv', 'excel', 'pdf', 'print'
    //         ]
    // });
    getEmpsData();
} );