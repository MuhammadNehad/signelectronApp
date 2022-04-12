var empId = curuser.id;
var empCode = curuser.empCode;
const employeesapi = `${hostName}api/Emplyees`;
const employeesapiURIQuery = `?curEmp.id=${empId}&curEmp.empCode=${empCode}`;

const rolesapi = `${hostName}api/roles`;
const rolesapiURIQuery = `?curEmp.id=${empId}&curEmp.empCode=${empCode}`;


const permsapi = `${hostName}api/Permissions`;
const permsapiURIQuery = ``;

var edit = false;
var selectedUserId = 0;
var selectedUser = {}
function addEmployee() {
    var employee = {};
    employee.empCode = $("#empCode").val();
    employee.email = $("#email").val();
    employee.name = $("#name").val();
    employee.phone = $("#phone").val();

    if (employee.empCode && employee.empCode.trim() != '' && employee.empCode.trim() != ""
        && employee.email && employee.email.trim() != '' && employee.email.trim() != ""
        && employee.name && employee.name.trim() != '' && employee.name.trim() != ""
        && employee.phone && employee.phone.trim() != '' && employee.phone.trim() != "") {
        checkPermission(permsapiURIQuery, 'permsNames', ['roles view'], function () {
            getRequest(permsapi + `/getByName` + permsapiURIQuery + permsQuery, function (res) {
                permsQuery = '';
                if (res["status"] == 200) {
                    checkPermission(employeesapiURIQuery, 'permsid', res["permsL"], function () {


                        postRequest(employeesapi + employeesapiURIQuery + permsQuery, employee, function (res) {

                        }, function () {
                            permsQuery = '';
                        });
                    });
                }
            }, function () {
                permsQuery = '';
            });
        });

    } else {
        alert('type all required fields');
    }
}
$(() => {
    checkPermission(permsapiURIQuery, 'permsNames', ['roles view'], function () {
        getRequest(permsapi + `/getByName` + permsapiURIQuery + permsQuery, function (res) {
            permsQuery = '';
            if (res["status"] == 200) {
                checkPermission(rolesapiURIQuery, 'permsid', res["permsL"], function () {


                    getRequest(rolesapi + rolesapiURIQuery + permsQuery, function (res) {
                        permsQuery = '';
                        for (const key in res) {
                            if (Object.hasOwnProperty.call(res, key)) {
                                const element = res[key];
                                $("#role").append($(`<option value="${element.id}">${element.name}</option>`))
                            }
                        }
                        var permEmpAdd = curuser.mrole[0].roles_perms_rel.find(rpr => rpr.perm.name == "Emplyees add")
                        if (permEmpAdd) {
                            $("#addEmployee").on('click', function () {
                                var empCodev = $("#empCode").val();
                                var emailv = $("#email").val();
                                var empNamev = $("#empName").val();
                                var passwordv = $("#password").val();
                                var confirmpasswordv = $("#confirmpassword").val();
                                var phonev = $("#phone").val();
                                var role = $("#role").val();

                                if (passwordv != confirmpasswordv && empCodev && empCodev.trim() <= 0
                                    && emailv && emailv.trim() <= 0 && empNamev && empNamev.trim() <= 0
                                    && phonev && phonev.trim() <= 0 && role && role.trim() <= 0 &&
                                    passwordv && passwordv.trim() <= 0 && confirmpasswordv && confirmpasswordv.trim() <= 0) {
                                    alert("review data");

                                    return;
                                }
                                var user = {
                                    empCode: empCodev, email: emailv,
                                    password: passwordv, name: empNamev,
                                    phone: phonev, role: role
                                }
                                checkPermission(permsapiURIQuery, 'permsNames', ['Emplyees add'], function () {
                                    getRequest(permsapi + `/getByName` + permsapiURIQuery + permsQuery, function (res) {
                            permsQuery = '';
                            if (res["status"] == 200) {
                                            checkPermission(employeesapiURIQuery, 'permsid', res["permsL"], function () {

                                                postRequest(employeesapi + employeesapiURIQuery + permsQuery, { emplyees: user }, function (res) {
                                                    $('.alert').addClass("alert-success");
                                                    $('.alert').text('employee saved');

                                                }, function () {
                                                    permsQuery = '';

                                                })
                                            })
                                        }
                                    }, function () {
                                        permsQuery = '';

                                    })
                                })

                            })
                        }
                    }, function () {
                        permsQuery = '';

                    })
                })
            }
        }, function () {
            permsQuery = '';

        })
    })

    var permEmpView = curuser.mrole[0].roles_perms_rel.find(rpr => rpr.perm.name == "Emplyees view")
    if (permEmpView) {
        prepareEmpsTable();
        var permEmpEdit = curuser.mrole[0].roles_perms_rel.find(rpr => rpr.perm.name == "Emplyees edit")
        if (permEmpEdit) {
            $("#editEmployee").on("click", function (params) {
                if (edit) {
                    var empCodev = $("#empCode").val();
                    var emailv = $("#email").val();
                    var empNamev = $("#empName").val();
                    var passwordv = $("#password").val();
                    var confirmpasswordv = $("#confirmpassword").val();
                    var phonev = $("#phone").val();
                    var role = $("#role").val();

                    if (empCodev && empCodev.trim() <= 0
                        && emailv && emailv.trim() <= 0 && empNamev && empNamev.trim() <= 0
                        && phonev && phonev.trim() <= 0 && role && role.trim() <= 0 &&
                     confirmpasswordv !=passwordv ) {
                        alert("review data");

                        return;
                    }
                    
                    var user = {}

                    user.id = selectedUserId;
                    user.empCode = empCodev;
                    user.password = passwordv;
                    if (emailv.trim() != selectedUser.email.trim()) {
                        user.email = emailv;
                    }
                    if (empNamev.trim() != selectedUser.name.trim()) {
                        user.name = empNamev;
                    }
                    if (phonev.trim() != selectedUser.phone.trim()) {
                        user.phone = phonev;
                    }
                    if (role != selectedUser.role) {
                        user.role = role
                    }
                    if (empCodev.trim() != selectedUser.empCode.trim()) {
                        alert("you can't change the code ");
                        return;
                    }
                    checkPermission(permsapiURIQuery, 'permsNames', ['Emplyees edit'], function () {
                        getRequest(permsapi + `/getByName` + permsapiURIQuery + permsQuery, function (res) {
                            permsQuery = '';
                            if (res["status"] == 200) {
                                checkPermission(employeesapiURIQuery, 'permsid', res["permsL"], function () {
                                    putRequest(employeesapi + `/${selectedUserId}` + employeesapiURIQuery + permsQuery, { emplyees: user }, function (res) {
                                        $('.alert').addClass("alert-success");
                                        $('.alert').text('employee updated');
                                        edit = false;

                                    }, function () {
                                        permsQuery = '';

                                    })
                                })
                            }
                        }, function () {
                            permsQuery = '';

                        })
                    })

                }
            })
        }
        $("#canceledit").on("click", function (e) {
            edit = false;
            $(".edit-control").addClass("d-none");
            $("#addEmployee").removeClass("d-none");
            $("#empCode").removeAttr("disabled");
            $("#password").removeAttr("disabled");
            $("#confirmpassword").removeAttr("disabled");
            $("input").val("");
        })
    }
})

function prepareEmpsTable() {
    checkPermission(permsapiURIQuery, 'permsNames', ['Emplyees edit'], function () {
        getRequest(permsapi + `/getByName` + permsapiURIQuery + permsQuery, function (res) {
            permsQuery = '';
            if (res["status"] == 200) {
                checkPermission(employeesapiURIQuery, 'permsid', res["permsL"], function () {

                    getRequest(employeesapi+employeesapiURIQuery+permsQuery, function (res) {
                        // res = res.$values;
                        html = "";
                        for (const key in res) {
                            if (Object.hasOwnProperty.call(res, key)) {
                                const element = res[key];
                                html += `<tr>` +
                                    `<td> ${element.empCode}</td>` +
                                    `<td> ${element.name}</td>` +
                                    `<td> ${element.phone}</td>`
                                var permEmpEdit = curuser.mrole[0].roles_perms_rel.find(rpr => rpr.perm.name == "Emplyees edit")
                                if (permEmpEdit) {

                                    html += `<td> <button class="btn" onclick='editEmp(${JSON.stringify(element)})'>edit</button></td>`
                                }

                                var permEmpDelete = curuser.mrole[0].roles_perms_rel.find(rpr => rpr.perm.name == "Emplyees delete")
                                if (permEmpDelete) {
                                    html += `<td> <button class="btn" onclick='deleteEmp(${element.id})'>delete</button></td>`

                                }
                                html += `</tr>`
                            }
                        }
                        $("#empsTable tbody").append($(html));

                    }, function () {
                        permsQuery = '';

                    })
                })
            }
        }, function () {
            permsQuery = '';

        })
    })

}

function deleteEmp(id) {
    checkPermission(permsapiURIQuery, 'permsNames', ['Emplyees delete'], function () {
        getRequest(permsapi + `/getByName` + permsapiURIQuery + permsQuery, function (res) {
            permsQuery = '';
            if (res["status"] == 200) {
                checkPermission(employeesapiURIQuery, 'permsid', res["permsL"], function () {
                    deleteRequest(employeesapi+"/"+id+employeesapiURIQuery+permsQuery,{},function(res){
                      },function(){
            permsQuery = '';
            clearAlert();
              $('.alert').addClass("alert-success");
            $('.alert').text('employee deleted');
                      })
                    },function(res){
            permsQuery = '';

                    })
                }else{
                    alert("you can't delete employees")
                }
            },function(res){
            permsQuery = '';

            })
    
    },function(res){
        permsQuery = '';

        })
}
function clearAlert() {
    var alertClassName = $('.alert').attr('class').split(" ").pop();
    if (alertClassName != "alert") {
        $('.alert').removeClass(alertClassName);
    }
}
function editEmp(emp) {
    edit = true;
    selectedUserId = emp.id;
    selectedUser = emp;
    $("#empCode").val(emp.empCode);
    $("#email").val(emp.email);
    $("#empName").val(emp.name);
    $("#phone").val(emp.phone);
    $("#role option[value='" + emp.role + "']").prop('selected', true);
    $("#empCode").attr("disabled", "disabled");
    $(".edit-control").removeClass("d-none");
    $("#addEmployee").addClass("d-none");
}