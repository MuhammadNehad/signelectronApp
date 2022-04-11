var empId = curuser.id;
var empCode = curuser.empCode;
const rolesapi = `${hostName}api/roles`;
const rolesapiURIQuery = `?curEmp.id=${empId}&curEmp.empCode=${empCode}`;

const permsapi = `${hostName}api/Permissions`;
const permsapiURIQuery = ``;

const roles_perms_relapi = `${hostName}api/roles_perms_rel`;
const roles_perms_relapiURIQuery = `?curEmp.id=${empId}&curEmp.empCode=${empCode}`;
let hasRolesUpdatePermission = false;
var containedPerms = {};
$(() => {

    checkPermission(permsapiURIQuery, 'permsNames', ['roles view'], function () {
        getRequest(permsapi + `/getByName` + permsapiURIQuery + permsQuery, function (res) {
            permsQuery = "";
            if (res["status"] == 200) {
                checkPermission(rolesapiURIQuery, 'permsid', res["permsL"], function () {



                    getRequest(rolesapi + rolesapiURIQuery + permsQuery, function (resr) {
                        // resr = resr.$values
                        var html = "";
                        var htmlsel = "";
                        permsQuery = "";
                        for (const role in resr) {
                            if (Object.hasOwnProperty.call(resr, role)) {
                                const element = resr[role];
                                html += `<li class="list-group-item" data-id='${element.id}'><input type='checkbox' onchange='clickedRole(${JSON.stringify(resr[role].roles_perms)},this,${JSON.stringify(element)})' class='rolesCheck m-2'/><label>${element.name}</label></li>`;
                                htmlsel += `<option value='${element.id}'><label>${element.name}</label></option>`;
                            }
                        }
                        $("#proles").append($(htmlsel));
                        $("#rolesList").append($(html));
                        getRequest(permsapi, function (resp) {
                            // resp =resp.$values
                            html = "";
                            for (const perm in resp) {
                                if (Object.hasOwnProperty.call(resp, perm)) {
                                    const element = resp[perm];
                                    html += `<li class="list-group-item" data-id='${element.id}'><input type='checkbox' class='permissionsCheck m-2'/><label>${element.ar_display_name}</label></li>`;
                                }
                            }

                            $("#permissionsList").append($(html));
                            $("#savePermissions").on("click", function (e) {
                                clearAlert();
                                var proleid = $("#proles").val()
                                if ($(".rolesCheck:checked").length <= 0) {

                                    $('.alert').addClass("alert-danger");
                                    $('.alert').text('select role');
                                } else {
                                    var checkedRoles = $(".rolesCheck:checked");
                                    var checkedPermissions = $(".permissionsCheck:checked");

                                    $(checkedRoles).each((l, elementr) => {
                                        var roleId = $(elementr).parent('li').attr('data-id');
                                        var roles_perms_rel = {}
                                        roles_perms_rel.role_id = Number.parseInt(roleId);
                                        var curRolePerms = containedPerms[roleId];
                                        $(checkedPermissions).each((k, elementPerm) => {


                                            var permId = $(elementPerm).parent('li').attr('data-id');
                                            var hasThePerm = curRolePerms.find(mperm => mperm.perm_id == permId)

                                            if (!hasThePerm) {


  
                                                roles_perms_rel.perm_id = Number.parseInt(permId);

                                                checkPermission(permsapiURIQuery, 'permsNames', ['roles edit'], function () {
                                                    getRequest(permsapi + `/getByName` + permsapiURIQuery + permsQuery, function (res) {
                                                        permsQuery = "";
                                                        if (res["status"] == 200) {
                                                            checkPermission(roles_perms_relapiURIQuery, 'permsid', res["permsL"], function () {

                                                                postRequest(roles_perms_relapi + roles_perms_relapiURIQuery + permsQuery, { "roles_perms_rel": roles_perms_rel }, function (res) {
                                                                    permsQuery = "";
                                                                    $('.alert').addClass("alert-success");
                                                                    $('.alert').text('permission saved');

                                                                }, function () {
                                                                    permsQuery = "";

                                                                })
                                                                hasRolesUpdatePermission = true;


                                                            })
                                                        }
                                                    }, function () {
                                                        permsQuery = "";

                                                    })
                                                })

                                            } else {

                                            }
                                        });
                                        if (proleid && proleid.trim().length > 0) {
                                
                                 if (proleid == roles_perms_rel.role_id) {
                                                alert("role can't be same of parent role");

                                            } else {
                                                checkPermission(permsapiURIQuery, 'permsNames', ['roles edit'], function () {
                                                    getRequest(permsapi + `/getByName` + permsapiURIQuery + permsQuery, function (res) {
                                                        permsQuery = "";
                                                        if (res["status"] == 200) {
                                                            checkPermission(roles_perms_relapiURIQuery, 'permsid', res["permsL"], function () {
                                                                putRequest(`${rolesapi}/${Number.parseInt(roleId)}` + rolesapiURIQuery + permsQuery, { roles: { id: Number.parseInt(roleId), name: null, proleId: (proleid == "" ? null : Number.parseInt(proleid)) } }, function (params) {
                                                                    permsQuery = "";
                                                                    clearAlert();
                                                                    $('.alert').addClass("alert-success");
                                                                    $('.alert').text('role changes saved');
                                                                }, function (params) {
                                                                    permsQuery = "";

                                                                })
                                                            })
                                                        }
                                                    }, function () {
                                                        permsQuery = "";

                                                    })
                                                })
                                            }
                                        }
                                        // for (const perm in checkedPermissions) {
                                        //     if (Object.hasOwnProperty.call(checkedPermissions, perm)) {


                                        //     }
                                        // }
                                    });
                                    //     for (const role in checkedRoles) {
                                    //         if (Object.hasOwnProperty.call(checkedRoles, role)) {
                                    //             const elementr = checkedRoles[role];


                                    //         }
                                    //     }
                                }
                                var uncheckedPermissions = $(".permissionsCheck:not(:checked)");
                                $(checkedRoles).each((l, elementr) => {
                                    var roleId = $(elementr).parent('li').attr('data-id');

                                    var curRolePerms = containedPerms[roleId];
                                    $(uncheckedPermissions).each((k, elementPerm) => {
                                        var permId = $(elementPerm).parent('li').attr('data-id');
                                        var foundThePerm = curRolePerms.find(mperm => mperm.perm_id == permId);
                                        if (foundThePerm) {
                                            checkPermission(roles_perms_relapiURIQuery, 'permsid', res["permsL"], function () {

                                                deleteRequest(roles_perms_relapi + `/${foundThePerm.id}`, null, function (res) {
                                                }, function () {
                                                    clearAlert();
                                                    $('.alert').addClass("alert-success");
                                                    $('.alert').text('role is deleted');
                                                    permsQuery = "";

                                                });
                                            }, function () {
                                                permsQuery = "";

                                            });
                                        }
                                    });
                                    if (proleid && proleid.trim().length < 0) {
                         

                                        if (proleid == roleId) {
                                            alert("role can't be same of parent role");

                                        } else {
                                            checkPermission(permsapiURIQuery, 'permsNames', ['roles edit'], function () {
                                                getRequest(permsapi + `/getByName` + permsapiURIQuery + permsQuery, function (res) {
                                                    permsQuery = "";
                                                    if (res["status"] == 200) {
                                                        checkPermission(roles_perms_relapiURIQuery, 'permsid', res["permsL"], function () {
                                                            putRequest(`${rolesapi}/${Number.parseInt(roleId)}` + rolesapiURIQuery + permsQuery, { roles: { id: Number.parseInt(roleId), name: null, proleId: (proleid == "" ? null : Number.parseInt(proleid)) } }, function (params) {
                                                                permsQuery = "";
                                                                clearAlert();
                                                                $('.alert').addClass("alert-success");
                                                                $('.alert').text('role changes saved');
                                                            }, function (params) {
                                                                permsQuery = "";

                                                            })
                                                        })
                                                    }
                                                }, function () {
                                                    permsQuery = "";

                                                })
                                            })
                                        }
                                    }
                                });
                            });

                        }, function () {
                            permsQuery = "";

                        });
                    }, function () {
                        permsQuery = "";

                    })
                })
            }

        }, function () {
            permsQuery = "";

        })
    })

    $('#addRole').on('click', function (e) {
        clearAlert();
        var rname = $("#roleName").val();
        if (rname && rname.trim().length > 0) {
            postRequest(rolesapi, { roles: { name: rname } }, function (res) {
                $('.alert').addClass("alert-success");
                $('.alert').text('role saved');

            }, function () {
                permsQuery = "";

            })
        } else {
            alert("fill role field");
        }
    })
})

function clearAlert() {
    var alertClassName = $('.alert').attr('class').split(" ").pop();
    if (alertClassName != "alert") {
        $('.alert').removeClass(alertClassName);
    }
}

function clickedRole(rolePerms, roleChecked, ele) {
    // rolePerms=rolePerms.$values

    var roleId = $(roleChecked).parent().attr("data-id");
    if (roleChecked.checked) {
        delete containedPerms[roleId]
        containedPerms[roleId] = rolePerms
        $('#proles').val(ele.proleId);
    }
    if ($(".permissionsCheck").length > 0) {
        $(".permissionsCheck").prop("checked", false);
        for (const key in rolePerms) {
            const element = rolePerms[key];
            $("#permissionsList li[data-id=" + element.perm_id + "] .permissionsCheck").prop("checked", roleChecked.checked);

        }
    }

}