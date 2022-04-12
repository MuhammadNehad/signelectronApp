let map;
let geocoder;
let marker;
let emplyees;
let isEdit=false;
var empId = curuser.id;
var empCode = curuser.empCode;
const locationapi =`${hostName}api/EmpsLocations`;
const locationapiURIQuery =`?curEmp.id=${empId}&curEmp.empCode=${empCode}`;
const employeesapi =`${hostName}api/Emplyees`;
const employeesapiURIQuery = `?curEmp.id=${empId}&curEmp.empCode=${empCode}`;
const permsapi =`${hostName}api/Permissions`;
const permsapiURIQuery = ``;

var  savedlocation ={};
var permEmpLocView = curuser.mrole[0].roles_perms_rel.find(rpr=>rpr.perm.name =="EmpsLocation view");
var permEmpLocEdit = curuser.mrole[0].roles_perms_rel.find(rpr=>rpr.perm.name =="EmpsLocation edit");
var permEmpLocAdd = curuser.mrole[0].roles_perms_rel.find(rpr=>rpr.perm.name =="EmpsLocation add");
var permEmpLocDel = curuser.mrole[0].roles_perms_rel.find(rpr=>rpr.perm.name =="EmpsLocation delete");

var googleMapApi = localStorage.getItem("googleMap_apiKey");
function loadMap()
{
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?key='+googleMapApi+'&callback=initMap';
document.body.appendChild(script);
}
window.onload = loadMap;
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 30.105966703671758, lng:  31.6292893715865 },
    zoom: 8,
    zoomControlOptions:{position:google.maps.ControlPosition.LEFT_TOP},
    streetViewControlOptions:{position: google.maps.ControlPosition.LEFT_CENTER}
  });
  map.addListener('click',(e)=>{
    placeMarkerandPanTo(e.latLng,map);
    fillLocationForm(e.latLng.lat(),e.latLng.lng());
 })

//  checkPermission(permsapiURIQuery,'permsNames',['Emplyees view'],function(){
//   getRequest(permsapi+`/getByName`+permsapiURIQuery+permsQuery,function(res){
//     if(res["status"] == 200 )
//     {
//       checkPermission(employeesapiURIQuery,'permsid',res["permsL"],function(){


//         getRequest(employeesapi+employeesapiURIQuery+permsQuery,function(res)
//         {
//             var optionsHtml="<option value=''>Select Employee</option>";
//             for(let key in res)
//             {
//                 optionsHtml+=`<option value='${res[key].id}'>${res[key].name}</option>`;
//             }
//             $('#employees').append($(optionsHtml))
//             emplyees = res;
//         },function()
//         {
//           permsQuery="";

//         })
//       });
//         }
//       },function()
//       {
//         permsQuery="";

//       })
    // })

    checkPermission(permsapiURIQuery,'permsNames',['EmpsLocation view'],function(){
      getRequest(permsapi+`/getByName`+permsapiURIQuery+permsQuery,function(res){
        if(res["status"] == 200 )
        {
          permsQuery="";

          checkPermission(locationapiURIQuery,'permsid',res["permsL"],function(){
    
      getRequest(locationapi + locationapiURIQuery+permsQuery,function(res)
      {
          var locl =document.getElementById("locslist")
          var optionsHtml="<option value=''>Select location</option>";
          if(permEmpLocView)
          {
            var listul =`` ;
              for(let key in res)
              {
                if(res[key].isParent == true)
                {
                  optionsHtml+=`<option value='${res[key].id}'  data-lat='${res[key].latitude}' data-lng='${res[key].lngtude}'>${res[key].address}</option>`;
                }

                  listul +=  `<li class="list-group-item">${res[key].address} `
                  if(permEmpLocEdit)
                  {
                    listul +=`<button class="btn btn-sm btn-outline-info w-100" onclick='editLocation(${JSON.stringify(res[key])},this)'>edit</button>`;
                  }
                  listul +=`</li>`;
                }
            }
          $('.locations').append($(optionsHtml))
          $('#locslist').append($(listul))

      },function(){
        permsQuery="";

      })
        })
      }
      },function()
      {
        permsQuery="";

      })
    })

}

function placeMarkerandPanTo (latlng, map)
{
     geocoder = new google.maps.Geocoder();
     if(marker)
     {
         marker.setPosition(latlng)
     }else{
     marker =new google.maps.Marker({
        position: latlng,
        map: map,
      });
    }
      map.panTo(latlng);
      const infowindow = new google.maps.InfoWindow({
        content: "secretMessage",
      });
      marker.addListener("click", () => {
        infowindow.open(marker.get("map"), marker);
      });
}
function fillLocationForm(lat ,lng)
{
    var bm = document.getElementById("bottom-Modal-locations");
    var bme = document.getElementById("bottom-Modal-employees");
    var latin = document.getElementById("latitude");
    var lngin = document.getElementById("lngtude");
    latin.value = lat;
    lngin.value =lng;
    bm.style.height ='20%';
    var mq = window.matchMedia('(max-height:850px)')
    var mq2 = window.matchMedia('(max-height:600px)')
    var mq3= window.matchMedia('(max-height:350px)')

      if(mq.matches)
      {
        bm.style.height ='25%';

      }
    if(mq2.matches)
    {
      bm.style.height ='35%';

    }
    if(mq3.matches)
    {
      bm.style.height ='55%';
      
    }
    if(isEdit)
    {
      $("#elatitude").val(lat);
      $("#elngtude").val(lng);
    }
}


$(function(){
  if(permEmpLocAdd)
  {
    $("#saveLoc").on('click',function(){
        var fdata={}
        fdata.latitude =$('#latitude').val();
        fdata.lngtude =$('#lngtude').val();
        fdata.address =$('#address').val();
        fdata.isParent =  $('#isParent').is(":checked");
        fdata.area =  parseInt($('#radius').val());
        checkPermission(permsapiURIQuery,'permsNames',['EmpsLocation add'],function(){
          getRequest(permsapi+`/getByName`+permsapiURIQuery+permsQuery,function(res){
            if(res["status"] == 200 )
            {
              permsQuery="";

              checkPermission(locationapiURIQuery,'permsid',res["permsL"],function(){

                postRequest(locationapi+locationapiURIQuery+permsQuery,{empsLocation:fdata},function(data){
                 var bm = document.getElementById("bottom-Modal-locations");
                  var bme = document.getElementById("bottom-Modal-employees");
                  
                  bm.style.height =0;
                  if(data.isParent == true)
                  {
                    var optionsHtml=`<option value='${data.Id}' data-lat='${data.latitude}' data-lng='${data.lngtude}'>${data.address}</option>`;
                    
                    $('.locations').append($(optionsHtml))
                  }
                },function(){
                  permsQuery="";

                });
              });
            }
        },function(){
          permsQuery="";

        })
      })
    });
  }
    $('#update_emp').on('click',function()
    {
        var selectedempId = $('#employees').val();
        var selectedlocId = $('#locations').val();

        var emp  = emplyees.find(e=>e.id==selectedempId); 
        emp.locationKey=Number(selectedlocId);
        checkPermission(permsapiURIQuery,'permsNames',['Emplyees edit'],function(){
          getRequest(permsapi+`/getByName`+permsapiURIQuery+permsQuery,function(res){
            if(res["status"] == 200 )
            {
              permsQuery="";

              checkPermission(employeesapiURIQuery,'permsid',res["permsL"],function(){

                putRequest(employeesapi+"/"+emp.id+employeesapiURIQuery+permsQuery,emp,function(res){

                },function(){
                  permsQuery="";
        
                });
                });
              }
            },function(){
              permsQuery="";
    
            });
          });

        
    });
    // https://maps.googleapis.com/maps/api/distancematrix/json?origins=40.6655101%2C-73.89188969999998&destinations=40.659569%2C-73.933783%7C40.729029%2C-73.851524%7C40.6860072%2C-73.6334271%7C40.598566%2C-73.7527626&key=YOUR_API_KEY'
    // $('#trlclisttoggle').on('click',function(e){
    //   var from =$("#fromLoc").val();   
    //   var to =$("#toLoc").val();   

    //   if(from.trim().length >0 && to.trim().length >0)
    //     {
    //       var fromLat = $("#fromLoc option:selected").attr('data-lat');
    //       var fromlng = $("#fromLoc option:selected").attr('data-lng');
    //       var toLat = $("#toLoc option:selected").attr('data-lat');
    //       var tolng = $("#toLoc option:selected").attr('data-lng');
    //       getRequest(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${fromLat}%2C${fromlng}&destinations=${toLat}%2C${tolng}&key=`,function(e){
    //         var duration = e['rows'][0]['elements'][0]['duration']['text'];
    //         $("#duration").html(duration)
    //         var options  ={
    //           timeZone:'Africa/Cairo',
    //           year:'numeric',
    //           month:'numeric',
    //           day:'numeric',
    //           hour:'numeric',
    //           minute:'numeric',
    //           second:'numeric'
    //       }
    //       formatter = new Intl.DateTimeFormat([],options);
    //       var time = new Date();
    //       var ctime =new Date(formatter.format(time)); 

    //         postRequest(`${hostName}api/trafficLogs`,{trafficLog:{fromLocId:from,tolocId:to,time:ctime.toLocaleString(),duration:e['rows'][0]['elements'][0]['duration']["value"]}},function(e){},function(e){

    //         })
    //       },function(){

    //       });
    //     }
    // });
    $('#lclisttoggle').on('click',function (e) {
      $('#locslist').toggle(function (params) {
        $('#locslist').css("height",'50%')
      },function (params) {
        $('#locslist').css("height",'0%')
      });
    });
    $("#ecancelupdateLoc").on("click",function (e) {
      if(!$("#editForm").hasClass("d-none")){
      $("#editForm").addClass("d-none");
      }
      isEdit =false;
    });
});

function editLocation(location,e)
{
  isEdit =true;
  $("#editForm").appendTo($(e).parent("li"));
  if($("#editForm").hasClass("d-none"))
  {$("#editForm").removeClass("d-none");
  }
  $("#elatitude").val(location.latitude);
  $("#elngtude").val(location.lngtude);
  $("#eaddress").val(location.address);
  $("#eradius").val(location.area);
  $("#eisParent").prop('checked',location.isParent);
  $("#esaveLoc").off().on("click",function (e) {
    location.latitude = $("#elatitude").val();
    location.lngtude = $("#elngtude").val();
    location.address = $("#eaddress").val();
    location.isParent =  $('#eisParent').is(":checked");
    location.area =  parseInt($('#eradius').val());
     checkPermission(permsapiURIQuery,'permsNames',['EmpsLocation view','EmpsLocation edit'],function(){
      getRequest(permsapi+"/getByName"+permsapiURIQuery+permsQuery,function(res){

        if(res["status"]==200)
        {

            permsQuery="";

            checkPermission(locationapiURIQuery,'permsid',res["permsL"],function(){
              putRequest(locationapi+`/${location.id}`+locationapiURIQuery+permsQuery,{empsLocation:location},function (e) {
                if(e["status"]==200)
                {
                  alert("Location Edited");
                }
              },function(){
                permsQuery="";
      
              });
            });

          } 
        },function(){
          permsQuery="";

        });
      });

  });
}




