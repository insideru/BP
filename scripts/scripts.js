clientsObject = [];
collabCatsObject = [];
projCatsObject = [];
collabsObject = [];
projectsObject = [];
activitiesObject = [];
timesheetsObject = [];
accountsObject = [];
alltimesheetsObject = [];
timesheetsArray = [];
holidayArray = [];
daysoffArray = [];
workedTime = 0;
pontajeObjectArray = [];
pontajPage = "/?page=ponteaza";
dashboardPage = "/";
concediuPage = "/?page=concediu";
nrZileLibere = selProjID = 0;
myTimesheets = [];
salariesObject = [];
permissionsObject = [];

$.fn.exists = function () {
    return this.length !== 0;
}

function arrayRemove(arr, value) { 
    
  return arr.filter(function(ele){ 
      return ele.id != value; 
  });
}

function removeProj(id) {
    $('#project_'+id).remove();
    timesheetsObject = arrayRemove(timesheetsObject, id);
    updatePB();
}

function getProjectType (name) {
    for (let element of projectsObject) {
        if (element.name==name) { 
            return element.type_id;
        }
    }
}

function getDBidFromName (name, cat) {
    switch (cat) {
      case "projCat":
        if (name=="Toate") {
          return 0;
        }
        for (let element of projCatsObject) {
          if (element.name==name) { return element.id;}
        }
      case "projClient":
        for (let element of clientsObject) {
          if (element.name==name) { return element.id;}
        }
      case "colabCat":
        for (let element of collabCatsObject) {
          if (element.name==name) { 
            return element.id;}
        }
      case "project":
        for (let element of projectsObject) {
            if (element.name==name) { 
                return element.id;}
            }
      case "collab":
        for (let element of collabsObject) {
          if (element.name==name) {
              return element.id;}
          }
    }
  }

function getDBNameFromId (id, cat) {
  switch (cat) {
    case "projCat":
      if (id==0) {
          return "Toate";
        }
      for (let element of projCatsObject) {
        if (element.id==id) { return element.name;}
      }
    case "projClient":
      for (let element of clientsObject) {
        if (element.id==id) { return element.name;}
      }
    case "colabCat":
      for (let element of collabCatsObject) {
        if (element.id==id) { return element.name;}
      }
    case "activity":
      for (let element of activitiesObject) {
        if (element.id==id) { return element.name;}
      }
    case "project":
      for (let element of projectsObject) {
        if (element.id==id) { return element.name;}
      }
    case "collab":
      for (let element of collabsObject) {
        if (element.id==id) { return element.name;}
      }
  }
}

function changeProjectCategory(name) {
    $("#projCat").html(name);
    selProjCat = name;
}

function changeProjectCategory2(name) {
    $("#actProjCat").html(name);
    selProjCat2 = name;
}

function changeClient(name) {
    $("#projClient").html(name);
    selClient = name;
}

function changeColabCategory(name) {
    $("#colabCat").html(name);
    selCollabCat = name;
}

function changeProjState(proj_id) {
  var formData = {
        'action'            : 'changeProjState',
        'proj_id'           : proj_id.substring(7)
    };
    $.ajax({
        type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
        url         : 'handler.php', // the url where we want to POST
        data        : formData, // our data object
        //dataType    : 'json', // what type of data do we expect back from the server
        encode      : true,
        success     : function(data) {
          $('#projTable').html('');
          $('#projInactiveTable').html('');
          projectsObject.forEach(element => {
            if (element.id == proj_id.substring(7)) {
              element.active = (element.active == 1 ? 0 : 1);
            }
          });
          populateProjects();
        }
    });
}

function changeUserState(proj_id) {
  var formData = {
        'action'            : 'changeUserState',
        'user_id'           : proj_id.substring(7)
    };
    $.ajax({
        type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
        url         : 'handler.php', // the url where we want to POST
        data        : formData, // our data object
        //dataType    : 'json', // what type of data do we expect back from the server
        encode      : true,
        success     : function(data) {
          //console.log("Ar trebui sa mearga! " + data);
        }
    });
}

function populateProjCat() {
  $('#projCatTable').html('');
  $('#dropdown_categorie_proiect').html('');
  $('#dropdown_categorie_proiect2').html('<li><a href="#!" onclick="changeProjectCategory2(this.innerHTML)">Toate</a></li>');
  projCatsObject.forEach(element => {
    $('#projCatTable').append('<tr><td class="tooltipped" data-position="top" data-tooltip="Apasa pentru redenumire" style="cursor:pointer" onclick="renameName(this.innerHTML, \'project_types\')">'+element.name+'</td></tr>');
    //initializare dropdown categorii proiecte
    $('#dropdown_categorie_proiect').append('<li><a href="#!" onclick="changeProjectCategory(this.innerHTML)">'+element.name+'</a></li>');
    $('#dropdown_categorie_proiect2').append('<li><a href="#!" onclick="changeProjectCategory2(this.innerHTML)">'+element.name+'</a></li>');
  });
}

function populateActivities() {
  $('#activityTable').html('');
  activitiesObject.forEach(element => {
    $('#activityTable').append('<tr><td class="tooltipped" data-position="top" data-tooltip="Apasa pentru redenumire" style="cursor:pointer" onclick="renameName(this.innerHTML, \'activities\')">'+element.name+"</td>"+'</td><td>'+getDBNameFromId(element.project_type, "projCat")+'</td></tr>');
  });
}

function populateColabCat() {
  $('#colabCatTable').html('');
  $('#dropdown_categorie_colaborator').html('');
  collabCatsObject.forEach(element => {
    $('#colabCatTable').append('<tr><td class="tooltipped" data-position="top" data-tooltip="Apasa pentru redenumire" style="cursor:pointer" onclick="renameName(this.innerHTML, \'collab_groups\')">'+element.name+"</td></tr>");
    //initializare dropdown clienti
    $('#dropdown_categorie_colaborator').append('<li><a href="#!" onclick="changeColabCategory(this.innerHTML)">'+element.name+'</a></li>');
  });
}

function populateClients() {
  $('#clientsTable').html('');
  $('#dropdown_client_proiect').html('');
  clientsObject.forEach(element => {
    $('#clientsTable').append('<tr><td class="tooltipped" data-position="top" data-tooltip="Apasa pentru redenumire" style="cursor:pointer" onclick="renameName(this.innerHTML, \'clients\')">'+element.name+"</td></tr>");
    //initializare dropdown clienti
    $('#dropdown_client_proiect').append('<li><a href="#!" onclick="changeClient(this.innerHTML)">'+element.name+'</a></li>');
  });
}

function populateCollabs() {
  $('#collabsTable').html('');
  collabsObject.forEach(element => {
    var bool = false;
    accountsObject.forEach(elem => {
      if (elem.collab_id==element.id && elem.account_username!="") {
        bool = true;
      }
    });
    if (bool) {
      //e adaugat user
      $('#collabsTable').append('<tr><td class="tooltipped" data-position="top" data-tooltip="Apasa pentru redenumire" style="cursor:pointer" onclick="renameName(this.innerHTML, \'collaborators\')">'+element.name+'</td><td>'+getDBNameFromId(element.collabCatID, "colabCat")+'</td><td></td></tr>');
    } else {
      $('#collabsTable').append('<tr><td class="tooltipped" data-position="top" data-tooltip="Apasa pentru redenumire" style="cursor:pointer" onclick="renameName(this.innerHTML, \'collaborators\')">'+element.name+'</td><td>'+getDBNameFromId(element.collabCatID, "colabCat")+'</td><td><a class="waves-effect waves-light btn modal-trigger btn-small" href="#newPontor" onclick="updatePermissionsDropdown(); addNewUserID=' + element.id +'">Adauga user</a></td></tr>');
      // var modalInstance = M.Modal.getInstance($(\'#newPontor\')); modalInstance.open();
    }
  });
}

function populateProjects() {
  $('#projTable').html('');
  projectsObject.forEach(element => {
    let isChecked = "";
    let tableName = '#projInactiveTable';
    if (element.active=="1") {
      isChecked = 'checked="checked" ';
      tableName = '#projTable';
    }
    $(tableName).append('<tr><td class="tooltipped" data-position="top" data-tooltip="Apasa pentru redenumire" style="cursor:pointer" onclick="renameName(this.innerHTML, \'projects\')">'+element.name+'</td>'+
    '<td>'+getDBNameFromId(element.type_id, "projCat")+'</td><td>'+getDBNameFromId(element.client_id, "projClient")+'</td>'+
    '<td><div id="projBudget_'+ element.id +'" class="chip tooltipped" data-position="top" data-tooltip="Numar ore bugetate" style="cursor:pointer" onclick="changeProjectBudget(this.id, $(this)[0].childNodes[0].nodeValue)">'+element.budget+'<i class="material-icons tiny" style="padding-left: 5px;">edit</i></div></td>'+
    '<td><div id="projStartDate_'+ element.id +'" class="chip tooltipped" data-position="top" data-tooltip="Data incepe proiect" style="cursor:pointer" onclick="changeProjectStartDate(this.id, $(this)[0].childNodes[0].nodeValue)">'+element.start_date+'<i class="material-icons tiny" style="padding-left: 5px;">edit</i></div></td>'+
    '<td><div id="projDeadline_'+ element.id +'" class="chip tooltipped" data-position="top" data-tooltip="Deadline" style="cursor:pointer" onclick="changeProjectDeadline(this.id, $(this)[0].childNodes[0].nodeValue)">'+element.deadline+'<i class="material-icons tiny" style="padding-left: 5px;">edit</i></div></td>'+
    '<td><label><input type="checkbox" id="projNo_' + element.id + '" onclick="changeProjState(this.id)"' + isChecked +' /><span></span></label></td></tr>');
  });
}

function populateHolidays() {
  $('#daysoffTable').html('');
  holidaysObject.forEach(element => {
    $('#daysoffTable').append('<tr><td class="tooltipped" data-position="top" data-tooltip="Apasa pentru redenumire" style="cursor:pointer" onclick="renameName(this.innerHTML, \'holidays\')">'+element.name+"</td>"+'</td><td>'+getFullDate(element.date)+'</td><td><i class="material-icons red-text" style="cursor:pointer" onClick="deleteHoliday(\'' + element.date + '\')">delete_forever</i></td></tr>');
  });
}

function populateUsers() {
  $('#usersTable').html('');
  accountsObject.forEach(element => {
    if (element.account_group!=0) {
      checkbox = '<label><input type="checkbox" id="userNo_' + element.account_id + '" onclick="changeUserState(this.id)"' + (element.account_enabled == "1" ? 'checked="checked" ' : '') +' /><span></span></label>';
    } else {
      checkbox = '';
    }
    $('#usersTable').append('<tr><td  class="tooltipped" data-position="top" data-tooltip="Apasa pentru schimbare parola" style="cursor:pointer" onclick="changePass(\''+element.account_id +'\')">'+element.account_username+'</td>'+
    '<td><div class="chip" style="cursor:pointer" onclick="changeGroup(\''+ element.account_id +'\', \''+element.account_group+'\')">'+element.account_group+'<i class="material-icons tiny" style="padding-left: 5px;">edit</i></div></td>'+
    '<td><a class="waves-effect waves-light btn modal-trigger btn-small" href="#salaryModal" onclick="userID=' + element.collab_id +'; resetSalaryForm();">Date Salariu</a></td>'+
    '<td><div class="chip tooltipped" data-position="top" data-tooltip="Total zile concediu" style="cursor:pointer" onclick="changeConcediu(\''+ element.account_id +'\', \''+element.zile_concediu+'\')">'+element.zile_concediu+'<i class="material-icons tiny" style="padding-left: 5px;">edit</i></div><div class="chip tooltipped" data-position="bottom" data-tooltip="Zile concediu reportate" style="cursor:pointer" onclick="changeReport(\''+ element.account_id +'\', \''+element.zile_report+'\')">'+element.zile_report+'<i class="material-icons tiny" style="padding-left: 5px;">edit</i></div><div class="chip tooltipped" data-position="top" data-tooltip="Zile concediu ramase" style="cursor:pointer" onclick="changeRamase(\''+ element.account_id +'\', \''+element.zile_ramase+'\')">'+element.zile_ramase+'<i class="material-icons tiny" style="padding-left: 5px;">edit</i></div></td>'+
    '<td>'+checkbox+'</td></tr>');
  });
}

function errorLog() {
  window.onerror = function(msg, url, line, col, error) {
    //console.log(msg + " || " + url + " || " + line + " || " + col + " || " + error);
  }
    
    /*js_error++;
    if (js_error<10) {
        var req = new XMLHttpRequest();
        var message = 'key=BP_ERROR_LOG&err=' + [
            'Time: ' + time,
            'Message: ' + msg,
            'Source: ' + source,
            'Line: ' + lineNo,
            'Column: ' + columnNo,
            'Error object: ' + JSON.stringify(error)
          ].join(' - ');
        req.open("POST", "errorlog.php");
        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        req.send(message);
    }*/
}

function getHolidays() {
  var guidCookie = getCookie("userGUID");
  $.get("handler.php?r=holidays&collab_guid="+guidCookie, function(data, status) {
    rcvData = JSON.parse(data);
    holidaysData = rcvData.holidays;
    daysoffData = rcvData.daysoff;
    timesheetsData = rcvData.pontaje;
    holidayArray = [];
    daysoffArray = [];
    timesheetsArray = [];
    holidaysData.forEach(element => {
        dt = new Date(element.date);
        dt.setHours(0, 0, 0);
        holidayArray.push(dt);
    });
    daysoffData.forEach(element => {
       dStart = new Date(element.startdate);
       dStart.setHours(0, 0, 0);
       dEnd = new Date(element.enddate);
       dEnd.setHours(0, 0, 0);
       daysoffArray.push([dStart, dEnd]);
    });
    timesheetsData.forEach(element => {
      dt = new Date(element.date);
      dt.setHours(0, 0, 0);
      timesheetsArray.push(dt);
  });
});
}

function compareDateRanges (StartA, EndA, StartB, EndB) {
  if ((StartA <= EndB) && (EndA >= StartB)) {
    return true;
  } else {
    return false;
  }
}

function deleteHoliday(date) {
  if (confirm("Sigur vrei sa stergi ziua de " + getFullDate(date) + "?")) {
    holidaysObject.forEach(element => { 
      if (element.date == date) {
        $.get("handler.php?r=deleteHoliday&date="+date, function(data, status) {
          if (data.substring(0,8)=="Success!") {
            holidaysObject.splice(holidaysObject.indexOf(element), 1);
            $('#daysoffTable').html("");
            populateHolidays();
          } else {
            M.toast({html: data});
          }
        });
      }
    });
  }
}

function getFullDate(selectedDate) {
  dateArray = selectedDate.split("-");

  //ziua e prima cifra
  ziua = dateArray[2];

  //luna o transformam in numar
  switch (dateArray[1].slice(0,3)) {
      case '01'  : luna = "Ianuarie"; break;
      case '02'  : luna = "Februarie"; break;
      case '03'  : luna = "Martie"; break;
      case '04'  : luna = "Aprilie"; break;
      case '05'  : luna = "Mai"; break;
      case '06'  : luna = "Iunie"; break;
      case '07'  : luna = "Iulie"; break;
      case '08'  : luna = "August"; break;
      case '09'  : luna = "Septembrie"; break;
      case '10'  : luna = "Octombrie"; break;
      case '11'  : luna = "Noiembrie"; break;
      case '12'  : luna = "Decembrie"; break;
  }

  //anul e ultima
  an = dateArray[0];
  return ziua + " " + luna + " " + an;
}

function changeRangeVal(rangeID, rangeValue) {
  for (let element of timesheetsObject) {
    if (element.id==rangeID.split('_')[0])
    {
      element[rangeID.split('_')[1]] = rangeValue;
      wrkdHours = calculateHours(rangeID.split('_')[0]);
      $("#" + rangeID.split('_')[0] + "_totalHours").html(wrkdHours != 1 ? wrkdHours + " ore" : wrkdHours + " ora");
    }
  }
  updatePB();
}

function calculateHours (id) {
  var wrkdHours=0;
  for (let element of timesheetsObject) {
    if (element.id==id || id=="toate" ? 1 : 0)
    {
      for (const property in element) {
        if (property!="id") {
          wrkdHours+=Number(element[property]);
        }
      }
    }
  }
  return isNaN(wrkdHours) ? 0 : wrkdHours;
}

function initRange(elemID) {
  var slider = document.getElementById(elemID);
  noUiSlider.create(slider, {
  start: 0,
  step: 0.5,
  tooltips: true,
  range: {
      'min': 0,
      'max': 15
  },
  connect: 'lower',
  behaviour: 'none',
  pips: {
    mode: 'values',
        values: [0, 3, 6, 9, 12, 15],
        density: 6
  },
  format: wNumb( { decimals: 1 })
  });

  slider.noUiSlider.on('update', function (values, handle) {
    changeRangeVal(slider.id, values[handle]);
});
}

function addNewProjTimesheet(projName) {
  //console.log('adaug proiectul ' + projName + ' care are idul ' + getDBidFromName(projName, "project"));
  if ($("#project_" + getDBidFromName(projName, "project")).exists()) {
      M.toast({html: 'Proiectul este deja adaugat!'});
      return;
  }
  $('#projTimesheet').append('<li id="project_' + getDBidFromName(projName, "project") + '"><div class="collapsible-header"><i class="material-icons">filter_drama</i>' + projName + '<span class="badge" id="' + getDBidFromName(projName, "project") + "_totalHours" + '">0 ore</span><a href="#!" class="secondary-content"><i class="material-icons red-text" onclick="removeProj(\'' + getDBidFromName(projName, "project") + '\');">remove_circle</i></a></div></li>');
  $('#project_' + getDBidFromName(projName, "project")).append('<div class="collapsible-body"><div id="' + 'project_' + getDBidFromName(projName, "project") + "_activities" + '" class="row"></div></div>');
  projType = getProjectType(projName);
  activitiesObject.forEach(element => {
      if (element.project_type==projType) {
          $("#project_" + getDBidFromName(projName, "project") + "_activities").append('<div class="section"><h5>' + element.name + '</h5></div><p><div id="' + getDBidFromName(projName, "project") + '_' + element.id + '"></div></p>');
          initRange(getDBidFromName(projName, "project") + '_' + element.id);
      }
  });
  //initialize range sliders
  
  var instance = M.Collapsible.getInstance($('.collapsible'));
  //add timesheet object
  var tmSht = {};
  tmSht["id"] = getDBidFromName(projName, "project");
  timesheetsObject.push(tmSht);
  instance.open(timesheetsObject.length - 1);
  document.getElementById("addProjDD").value = "";
}

function populateActiveProjects() {
  projectsObject.forEach(element => {
    isChecked = "";
    if (element.active=="1") {
      $('#addProjDD').append('<li><a href="#!" onclick="addNewProjTimesheet(this.innerHTML)">' + element.name + '</a></li>');
    }
  });
}

function populateActiveDropdown() {
  projectsObject.forEach(element => {
    isChecked = "";
    if (element.active=="1") {
      $('#addProjDD').append('<option value="'+element.name+'">' + element.name + '</option>');
    }
  });
}

function getSelectedDate(selectedDate) {
  dateArray = selectedDate.split(" ");

  //ziua e prima cifra
  ziua = dateArray[0];

  //luna o transformam in numar
  switch (dateArray[1].slice(0,3)) {
      case 'Ian'  : luna = "01"; break;
      case 'Feb'  : luna = "02"; break;
      case 'Mar'  : luna = "03"; break;
      case 'Apr'  : luna = "04"; break;
      case 'Mai'  : luna = "05"; break;
      case 'Iun'  : luna = "06"; break;
      case 'Iul'  : luna = "07"; break;
      case 'Aug'  : luna = "08"; break;
      case 'Sep'  : luna = "09"; break;
      case 'Oct'  : luna = "10"; break;
      case 'Noi'  : luna = "11"; break;
      case 'Dec'  : luna = "12"; break;
  }

  //anul e ultima
  an = dateArray[2];
  return ziua + "-" + luna + "-" + an;
}

function getSelectedISODate(selectedDate) {
  dateArray = selectedDate.split(" ");

  //ziua e prima cifra
  ziua = dateArray[0];

  //luna o transformam in numar
  switch (dateArray[1].slice(0,3)) {
      case 'Ian'  : luna = "01"; break;
      case 'Feb'  : luna = "02"; break;
      case 'Mar'  : luna = "03"; break;
      case 'Apr'  : luna = "04"; break;
      case 'Mai'  : luna = "05"; break;
      case 'Iun'  : luna = "06"; break;
      case 'Iul'  : luna = "07"; break;
      case 'Aug'  : luna = "08"; break;
      case 'Sep'  : luna = "09"; break;
      case 'Oct'  : luna = "10"; break;
      case 'Noi'  : luna = "11"; break;
      case 'Dec'  : luna = "12"; break;
  }

  //anul e ultima
  an = dateArray[2];
  return an + "-" + luna + "-" + ziua;
}

function validateTime (time) {
  if (time.length==5) {
    timeArray = time.split(":");
    if (Number(timeArray[0])<24 && Number(timeArray[1])<60) {
      return true;
    }
  }
  else {
    return false;
  }
}

function validateDate (data) {
  dateArray = data.split(" ");
  if (dateArray.length==3)
  {
    if (Number(dateArray[0])<32 && Number(dateArray[2])> 2019 && ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie','Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'].includes(dateArray[1])) {
      return true;
    }
  }
  else
  {
    return false;
  }
}

function validatePontaj () {
  var data = $("#data-pontaj").val();
  var valid = true;
  if (!validateDate(data)) {
    valid = false;
    $("#data-pontaj").addClass("invalid");
  } else {
    $("#data-pontaj").addClass("valid");
  }
  var oraVenire = $("#ora-venire").val();
  if (!validateTime(oraVenire)) {
    valid = false;
    $("#ora-venire").addClass("invalid");
  } else {
    $("#ora-venire").addClass("valid");
  }
  var oraPlecare = $("#ora-plecare").val();
  if (!validateTime(oraPlecare)) {
    valid = false;
    $("#ora-plecare").addClass("invalid");
  } else {
    $("#ora-plecare").addClass("valid");
  }
  if (validateDate(data)) {
    daysoffArray.forEach(element => {
      dt = new Date(data);
      dt.setHours(0, 0, 0);
      if (compareDateRanges(dt, dt, element[0], element[1])) {
        M.toast({html: 'Nu poti ponta intr-o zi de concediu!'});
        valid = false;
      }
    });
  }

  if (!valid) {
    return valid;
  }

  if (timesheetsObject.length==0) {
    valid = false;
    M.toast({html: 'Adauga cel putin un proiect la care ai lucrat!'});
  } else {
    if (calculateHours("toate")==0) {
      valid = false;
      M.toast({html: 'Alege cel putin o activitate la care ai lucrat!'});
    }
    if (calculateHours("toate") * 60 > workedTime) {
      valid = false;
      M.toast({html: 'Pontajul depaseste perioada de lucru aleasa!'});
    }
  }
  return valid;
}

function validateConcediu () {
  var valid = true;
  if (!validateDate($("#startDate").val())) {
    valid = false;
    $("#startDate").addClass("invalid");
  } else {
    $("#startDate").addClass("valid");
  }
  if (!validateDate($("#endDate").val())) {
    valid = false;
    $("#endDate").addClass("invalid");
  } else {
    $("#endDate").addClass("valid");
  }
  let data1 = getSelectedDate($("#startDate").val()).split('-');
  let data2 = getSelectedDate($("#endDate").val()).split('-');
  if (valid) {
    d1 = new Date(data1[2], data1[1]-1, data1[0], 0, 0, 0);
    d2 = new Date(data2[2], data2[1]-1, data2[0], 0, 0, 0);
    if (d1 > d2) {
      valid = false;
      M.toast({html: 'Data de inceput nu poate fi dupa data de sfarsit a concediului!'});
      return false;
    }
    if (d1 - d2 == 0) {
      //valid = false;
      //M.toast({html: 'Data de inceput si de sfarsit a concediului nu pot fi aceeasi!'});
      //return false;
      nrZileLibere = getNoDaysOff(new Date(data1[2], data1[1]-1, data1[0], 0, 0, 0), new Date(data2[2], data2[1]-1, data2[0], 0, 0, 0));
    }
    if (d2 > d1) {
      nrZileLibere = getNoDaysOff(new Date(data1[2], data1[1]-1, data1[0], 0, 0, 0), new Date(data2[2], data2[1]-1, data2[0], 0, 0, 0));
      daysoffArray.forEach(element => {
        if (compareDateRanges(d1, d2, element[0], element[1])) {
          M.toast({html: 'Perioada aleasa se suprapune cu un alt concediu!'});
          return false;
        }
      });
      if (nrZileLibere<1) {
        M.toast({html: 'In perioada aleasa toate zilele sunt libere!'});
        return false;
      }
    }
    var overlap = false;
    timesheetsArray.forEach(element => {
      if (compareDateRanges(d1, d2, element, element)) {
        overlap = true;
      }
    });
    if (overlap) {
      M.toast({html: 'In perioada aleasa exista zile pontate!'});
      return false;
    }
  }
  return valid;
}

function getVars () {
  var $_GET = {};
    if(document.location.toString().indexOf('?') !== -1) {
        var query = document.location
                      .toString()
                      // get the query string
                      .replace(/^.*?\?/, '')
                      // and remove any existing hash string (thanks, @vrijdenker)
                      .replace(/#.*$/, '')
                      .split('&');

        for(var i=0, l=query.length; i<l; i++) {
          var aux = decodeURIComponent(query[i]).split('=');
          $_GET[aux[0]] = aux[1];
        }
    }
  return $_GET;
}

function getNoDaysOff(data1, data2) {
  var zileLibere = 0;
  data1.setHours(0, 0, 0);
  data2.setHours(0, 0, 0);
  for (var d = data1; d <= data2; d.setDate(d.getDate() + 1)) {
    if (d.getDay()>0 && d.getDay()<6 && !isInArray(holidayArray, d)) {
      zileLibere = zileLibere + 1;
    }
  }
  return zileLibere;
}

function isInArray(array, value) {
  return !!array.find(item => {return item.getTime() == value.getTime();});
}

function changeSelectedDate() {
  //newDate = getSelectedDate();
  //for (i=0;i<timeWorked.length; i++) {
  //    timeWorked[i][4] = newDate;
  //}
  //console.log("Ja ca merge data!");
}

function changeSelectedTime () {
  var oraVenire = $('#ora-venire').val();
  var oraPlecare = $('#ora-plecare').val();
  if (validateTime(oraVenire) && validateTime(oraPlecare)) {
    var d1 = new Date();
    var d2 = new Date();
    d1.setHours(oraVenire.split(":")[0], oraVenire.split(":")[1], 0, 0);
    d2.setHours(oraPlecare.split(":")[0], oraPlecare.split(":")[1], 0, 0);
    if (d1>d2) { d2.setDate(d2.getDate() + 1); }
    var wrkHours = Math.floor((d2-d1)/3600000);
    var wrkMinutes = Math.floor(((d2-d1)-(wrkHours*3600000))/60000);
    workedTime = wrkHours * 60 + wrkMinutes;
    updateText(wrkHours, wrkMinutes);
  }
}

function buildEventsObject(eventsArray) {
  var retObject={};
  eventsArray.forEach(element => {
    retObject[element.date] = (isNaN(Number(retObject[element.date])) ? 0 : Number(retObject[element.date])) + Number(element.time);
  });
  return retObject;
}

function buildTimesheetCalendarEvents(eventsArray, projectsArray) {
  var eventsObject = buildEventsObject(eventsArray);
  for(let key in eventsObject){
    let datedDate = new Date(key);
    datedDate.setHours(0, 0, 0);
    pontajeObjectArray.push({date: datedDate, hours: eventsObject[key]});
    //console.log("Adaug pontaj pentru data de " + key + " cu timpul " + eventsObject[key]);
    addCalendarEvent("pontaj-" + key, Number(eventsObject[key]) + (Number(eventsObject[key]) == 1 ? " ora" : " ore"), "Apasa pentru a sterge pontarea", key, key, "pontare", "#8773c1");
 }
 projectsArray.forEach(element =>{
   //daca e inactiv sau daca e extern NU
    addCalendarEvent('predare-'+element.deadline, "Predare", "Predare " + element.name, element.deadline, element.deadline, "Predari", "#ff0000");
});

$('.day').each(function(i, obj) {
  if ($(this).find('.type-Predari').length !== 0) {
    $(this).addClass('predare');
  }
});
}

function buildCalendarHolidays(doArray, hdArray) {
  daysoffArray = [];
  holidayArray = [];
  hdArray.forEach(element => {
    dt = new Date(element.date);
    dt.setHours(0, 0, 0);
    holidayArray.push(dt);
  });
  doArray.forEach(element => {
    dStart = new Date(element.startdate);
    dStart.setHours(0, 0, 0);
    dEnd = new Date(element.enddate);
    dEnd.setHours(0, 0, 0);
    daysoffArray.push([dStart, dEnd]);
  });
  doArray.forEach(element => {
    curDays = getNoDaysOff(new Date(element.startdate), new Date(element.enddate));
    addCalendarEvent('dayoff-'+element.startdate, "Concediu", "Concediu " + (curDays > 1 ? curDays + " zile" : curDays + " zi"), element.startdate, element.enddate, "dayoff", "#77bfe9");
  });
  hdArray.forEach(element => {
    addCalendarEvent('holiday-'+element.date, element.name, "Zi libera", element.date, element.date, "Holidays", "#57d110");
  });
}

function addCalendarEvent(eventID, eventName, eventDescription, startDate, endDate, eventType, color) {
  $('#calendar').evoCalendar('addCalendarEvent', {
    id: eventID,
    name: eventName,
    description: eventDescription,
    date: [startDate, endDate],
    type: eventType,
    color: color
  });
}

function deletePontaj (date) {
  if (!confirm("Orele pontate pentru aceasta zi vor fi sterse. Continua?")) {
    return;
  }
  var guidCookie = getCookie("userGUID");
  var formData = {
    'action'            : 'deleteTimesheets',
    'collab_guid'       : guidCookie, //trebuie luat din cookie sau cumva
    'date'              : date
};
$.ajax({
    type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
    url         : 'handler.php', // the url where we want to POST
    data        : formData, // our data object
    //dataType    : 'json', // what type of data do we expect back from the server
    encode      : true,
    success     : function(data) {
      if (data.substring(0,8)=="Success!") {
        //$('#calendar').evoCalendar('removeCalendarEvent', "pontaj-" + date);
        $('#calendar').evoCalendar('destroy');
        initCalendar();
        $('#calendar').evoCalendar('selectDate', date);
      }
    },
    error: function(){
        //
    }
});
}

function deleteConcediu (date, days, selDate) {
  if (!confirm("Concediul selectat va fi sters. Continua?")) {
    return;
  }
  var guidCookie = getCookie("userGUID");
  var formData = {
    'action'            : 'deleteDayoff',
    'collab_guid'       : guidCookie, //trebuie luat din cookie sau cumva
    'days'              : days,
    'date'              : date.substring(7)
};
$.ajax({
    type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
    url         : 'handler.php', // the url where we want to POST
    data        : formData, // our data object
    //dataType    : 'json', // what type of data do we expect back from the server
    encode      : true,
    success     : function(data) {
      if (data.substring(0,8)=="Success!") {
        //$('#calendar').evoCalendar('removeCalendarEvent', "pontaj-" + date);
        $('#calendar').evoCalendar('destroy');
        initCalendar();
        $('#calendar').evoCalendar('selectDate', selDate);
      }
    },
    error: function(){
        //
    }
});
}

function vizualizareWithDate(date) {
  $("#viewPontajModalTitle").html('Pontare ' + getFullDate(date));
  drawPontajChart(date);
}

function ponteazaWithDate(date) {
  if (typeof(Storage) !== "undefined") {
    // Store
    localStorage.setItem("dataPontaj", date);
      window.location.href = location.protocol + "//" + location.host + pontajPage;
    }
}

function initCalendar() {
  //initialize calendar
  $('#calendar').evoCalendar({
    theme: 'Blueprint',
    language: 'ro',
    format:	'yyyy-mm-dd',
    eventHeaderFormat: 'dd MM yyyy',
    firstDayOfWeek: 1,
    //theme: 'Orange Coral'
  });
  $('#calendar').evoCalendar('toggleEventList', true);
  $('#calendar').on('selectEvent', function(event, activeEvent) {
    if (activeEvent['type']=="pontare") {
      //if (confirm("Orele pontate pentru aceasta zi vor fi sterse. Continua?")) {
      //  deletePontaj(activeEvent['date']);
      //}
    }
    if (activeEvent['type']=="Holidays") {
      //daca e zi speciala
    }
    if (activeEvent['type']=="dayoff") {
      //daca e zi de concediu
    }

    //M.toast({html: "Sterg pontajul din data de " + activeEvent['date']});
    //$('#calendar').evoCalendar('removeCalendarEvent', activeEvent['id']);
  });
  //get pontaje for current user
  var guidCookie = getCookie("userGUID");
  var formData = {
    'action'            : 'getTimesheets',
    'collab_guid'       : guidCookie, //trebuie luat din cookie sau cumva
  };
  $.ajax({
      type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
      url         : 'handler.php', // the url where we want to POST
      data        : formData, // our data object
      //dataType    : 'json', // what type of data do we expect back from the server
      encode      : true,
      success     : function(data) {
        //console.log(data);
        rvdData = JSON.parse(data);
        if (typeof(rvdData) === 'object') {
          myTimesheets = rvdData.timesheets;
          buildTimesheetCalendarEvents(rvdData.timesheets, rvdData.projects);
          buildCalendarHolidays(rvdData.daysoff, rvdData.holidays);
          activitiesObject = rvdData.activities;
          projectsObject = rvdData.projects;
          //$('#calendar').evoCalendar('selectDate', new Date());
        } else {
          M.toast({html: data.substring(15)});
        }
      },
      error: function(){
          //
      }
  });
}

function addLinks() {
  $('#linkDashboard').attr("href", dashboardPage);
  $('#linkPontaj').attr("href", pontajPage);
  $('#linkConcediu').attr("href", concediuPage);
}

function updateText(ore, minute) {
  $('#maxPontaj').text("Ponteaza cel mult " + ore + (ore == 1 ? " ora " : " ore ") + minute + (minute == 1 ? " minut." : " minute."));
}

function updatePB() {
  var maxCurrentValue = calculateHours("toate") * 60;
  //var PBValue = Math.floor(maxCurrentValue);
  if ($('#maxPontaj').text()!="") {
    document.getElementById("workPB").style.width = Math.floor((maxCurrentValue/workedTime)*100) + '%';
    if (Math.floor((maxCurrentValue/workedTime)*100)>100) {
      $('#workPB').addClass("red");
    } else {
      $('#workPB').removeClass("red");
    }
  }
}

function validateAdduser () {
  var newUsername = $("#userAdd").val();
  var newPass1 = $("#userPass1").val();
  var newPass2 = $("#userPass2").val();
  var newRights = $("#userRights").val();

  if (newPass1!=newPass2) {
    $("#addUserError").html('Parolele nu sunt identice!');
    return;
  }

  if (newPass1.length<6) {
    $("#addUserError").html('Parola trebuie sa aiba cel putin 6 caractere!');
    return;
  }

  if (newUsername.length<4) {
    $("#addUserError").html('Usernameul trebuie sa aiba cel putin 4 caractere!');
    return;
  }

  if (newRights<1) {
    $("#addUserError").html('Trebuie aleasa o categorie de drepturi!');
    return;
  }

  var formData = {
    'action'            : 'addNewUser',
    'collab_id'         : addNewUserID, 
    'username'          : newUsername,
    'passwd'            : newPass1,
    'group'             : newRights
  };

  $.ajax({
    type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
    url         : 'handler.php', // the url where we want to POST
    data        : formData, // our data object
    //dataType    : 'json', // what type of data do we expect back from the server
    encode      : true,
    success     : function(data) {
      //console.log(data);
      rcvData = JSON.parse(data);
      if (rcvData.newAccount.substring(0, 21) == "The new account ID is") {
        //a mers
        var modalInstance = M.Modal.getInstance($('#newPontor'));
        modalInstance.close();
        accountsObject = rcvData.accounts;
        $('#collabsTable').html("");
        populateCollabs();
        $("#userAdd").val('');
        $("#userPass1").val('');
        $("#userPass2").val('');
        $("#userRights").val('');
        $("#addUserError").html('');
        M.toast({html: "Utilizator adaugat cu succes!"});
      } else {
        $("#addUserError").html(rcvData.newAccount);
        return;
      }
    }
  });
  //
}

function getCookie(cookiename) 
  {
  // Get name followed by anything except a semicolon
  var cookiestring=RegExp(cookiename+"=[^;]+").exec(document.cookie);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
  }

function renameName (curName, curTable) {
  let response = prompt("Introdu un nou nume:", curName);
  if (typeof response === 'string') { response = response.trim(); }
  if (response == null || response == "" || response == curName) {
    //a dat cancel sau a bagat fix acelasi lucru
    return "Fail";
  }
  //console.log("a bagat ceva! voi redenumi " + curName + " in " + response + " in tabela " + curTable);
  var formData = {
    'action'        : 'reName',
    'table'         : curTable, 
    'oldname'       : curName,
    'newname'       : response
  };
  $.ajax({
    type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
    url         : 'handler.php', // the url where we want to POST
    data        : formData, // our data object
    //dataType    : 'json', // what type of data do we expect back from the server
    encode      : true,
    success     : function(data) {
      if (data.substring(0, 8) == "Success!") {
        //a mers
        switch (curTable) {
          case "project_types":
            replaceName(projCatsObject, curName, response);
            populateProjCat();
            break;
          case "activities":
            replaceName(activitiesObject, curName, response);
            populateActivities();
            break;
          case "projects":
            replaceName(projectsObject, curName, response);
            populateProjects();
            break;
          case "collab_groups":
            replaceName(collabCatsObject, curName, response);
            populateColabCat();
            break;
          case "collaborators":
            replaceName(collabsObject, curName, response);
            populateCollabs();
            break;
          case "clients":
            replaceName(clientsObject, curName, response);
            populateClients();
            break;
          case "holidays":
            replaceName(holidaysObject, curName, response);
            populateHolidays();
            break;
        }
      } else {
        M.toast({html: data});
        return;
      }
    }
  });
}

function changePass (userID) {
  let response = prompt("Introdu parola noua:");
  if (typeof response === 'string') { response = response.trim(); }
  if (response == null || response == "") {
    //a dat cancel sau a bagat fix acelasi lucru
    return "Fail";
  }
  //console.log("a bagat ceva! voi redenumi " + curName + " in " + response + " in tabela " + curTable);
  var formData = {
    'action'        : 'changePass',
    'userid'        : userID, 
    'newpass'       : response
  };
  $.ajax({
    type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
    url         : 'handler.php', // the url where we want to POST
    data        : formData, // our data object
    //dataType    : 'json', // what type of data do we expect back from the server
    encode      : true,
    success     : function(data) {
      if (data.substring(0, 8) == "Success!") {
        //a mers
        M.toast({html: 'Parola a fost schimbata cu succes!'});
      } else {
        M.toast({html: data});
        return;
      }
    }
  });
}

function replaceName (array, curName, newName) {
  array.forEach(element => {
    if (element.name == curName) {
      element.name = newName;
    }
  });
}

function changeConcediu (accID, oldValue) {
  let response = prompt("Introdu numarul de zile de concediu:", oldValue);
  if (typeof response === 'string') { response = response.trim(); }
  if (response == null || isNaN(response)) {
    //a dat cancel sau a bagat fix acelasi lucru
    return "Fail";
  }
  var formData = {
    'action'    : 'changeConcediu',
    'id'        : accID, 
    'column'    : "zile_concediu",
    'value'     : response
  };
  $.ajax({
    type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
    url         : 'handler.php', // the url where we want to POST
    data        : formData, // our data object
    //dataType    : 'json', // what type of data do we expect back from the server
    encode      : true,
    success     : function(data) {
      if (data.substring(0, 8) == "Success!") {
        //a mers
        changeAccountsObject("concediu", accID, response);
        populateUsers();
      } else {
        M.toast({html: data});
        return;
      }
    }
  });
}

function buildMonthlyData(month) {
  //$('.monthlyData').addClass('event-container');
  let stoul = "stourile cele mai tari";
  //$('.monthlyData').html('</p><div class="event-icon"><div class="event-bullet-pontare-bilunara" style="background-color:#8773c1"></div></div><div class="event-info"><p class="event-title">Pontaje 1-15</p><p class="event-desc">' + stoul + '</p></div></div></p>');
  //$('.monthlyData').append('</p><div class="event-icon"><div class="event-bullet-pontare-bilunara" style="background-color:#8773c1"></div></div><div class="event-info"><p class="event-title">Pontaje 15-31</p><p class="event-desc">' + stoul + '</p></div></div></p>');
  //let markup = '<table class="calendar-table"><tbody>><tr class="calendar-header"><td class="calendar-header-day">1-15</td><td class="calendar-header-day">15-31</td></tr><tr class="calendar-body center-align"><td style="font-size: 14px;">'+stoul+'</td><td style="font-size: 14px;">'+stoul+'</td></tr></tbody></table>';
  let wrkDate = getSelectedDate("01 " + month).split('-');
  let primaParte = hoursWorked(month, 1);
  let adouaParte = hoursWorked(month, 2);
  let markup = '<ul class="collapsible"><li><div class="collapsible-header"><i class="material-icons">timeline</i>Ore lucrate</div><div class="collapsible-body">'+
                '<table class="striped centered"><thead><tr><th>1-15</th><th>16-'+getLastDayOfMonth(wrkDate[1])+'</th></tr></thead><tbody>'+
                '<tr><td> ore 2x: ' + primaParte[0] + '</td>'+
                '<td> ore 2x: ' + adouaParte[0] + '</td></tr>'+
                '<tr><td> ore 1,5x: ' + primaParte[1] + '</td>'+
                '<td> ore 1,5x: ' + adouaParte[1] + '</td></tr>'+
                '<tr><td> ore 1x: ' + primaParte[2] + '</td>'+
                '<td> ore 1x: ' + adouaParte[2] + '</td></tr>'+
                '<tr><td> Total: ' + (primaParte[0]*2 + primaParte[1]*1.5 + primaParte[2]) + '</td>'+
                '<td> Total: ' + (adouaParte[0]*2 + adouaParte[1]*1.5 + adouaParte[2]) + '</td>'+
                '</tr></tbody></table></div></li></ul>';
  $('.monthlyData').html(markup);
  $('.collapsible').collapsible();
}

function changeReport (accID, oldValue) {
  let response = prompt("Introdu numarul de zile de concediu reportate:", oldValue);
  if (typeof response === 'string') { response = response.trim(); }
  if (response == null || isNaN(response)) {
    //a dat cancel sau a bagat fix acelasi lucru
    return "Fail";
  }
  var formData = {
    'action'    : 'changeConcediu',
    'id'        : accID, 
    'column'    : "zile_report",
    'value'     : response
  };
  $.ajax({
    type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
    url         : 'handler.php', // the url where we want to POST
    data        : formData, // our data object
    //dataType    : 'json', // what type of data do we expect back from the server
    encode      : true,
    success     : function(data) {
      if (data.substring(0, 8) == "Success!") {
        //a mers
        changeAccountsObject("report", accID, response);
        populateUsers();
      } else {
        M.toast({html: data});
        return;
      }
    }
  });
}

function changeRamase (accID, oldValue) {
  let response = prompt("Introdu numarul de zile de concediu ramase:", oldValue);
  if (typeof response === 'string') { response = response.trim(); }
  if (response == null || isNaN(response)) {
    //a dat cancel sau a bagat fix acelasi lucru
    return "Fail";
  }
  var formData = {
    'action'    : 'changeConcediu',
    'id'        : accID, 
    'column'    : "zile_ramase",
    'value'     : response
  };
  $.ajax({
    type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
    url         : 'handler.php', // the url where we want to POST
    data        : formData, // our data object
    //dataType    : 'json', // what type of data do we expect back from the server
    encode      : true,
    success     : function(data) {
      if (data.substring(0, 8) == "Success!") {
        //a mers
        changeAccountsObject("ramase", accID, response);
        populateUsers();
      } else {
        M.toast({html: data});
        return;
      }
    }
  });
}

function changeGroup (accID, oldValue) {
  let response = prompt("Introdu noul grup de permisii:", oldValue);
  if (typeof response === 'string') { response = response.trim(); }
  if (response == null || isNaN(response)) {
    //a dat cancel sau a bagat fix acelasi lucru
    return "Fail";
  }
  changeAccountsObject("grup", accID, response);
}

function changeAccountsObject(elementName, accID, value) {
  accountsObject.forEach(element => {
    if (element.account_id == accID) {
      switch (elementName) {
        case "concediu":
          element.zile_concediu = value;
          break;
        case "report":
          element.zile_report = value;
          break;
        case "ramase":
          element.zile_ramase = value;
          break;
      }
    }
  });
}

function changeProjectBudget(projID, projBudget) {
  let project_dbid = Number(projID.substring(11));
  let response = prompt("Introdu numarul de ore bugetate pentru proiect:", projBudget);
  if (typeof response === 'string') { response = response.trim(); }
  if (response == null || isNaN(response)) {
    //a dat cancel sau a bagat fix acelasi lucru
    return "Fail";
  }
  var formData = {
    'action'      : 'setProjectBudget',
    'proj_id'     : project_dbid, 
    'new_budget'  : response
  };
  $.ajax({
    type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
    url         : 'handler.php', // the url where we want to POST
    data        : formData, // our data object
    //dataType    : 'json', // what type of data do we expect back from the server
    encode      : true,
    success     : function(data) {
      if (data.substring(0, 8) == "Success!") {
        //a mers
        $('#' + projID).html(response + '<i class="material-icons tiny" style="padding-left: 5px;">edit</i>');
      } else {
        M.toast({html: data});
        return;
      }
    }
  });
}

function changeProjectDeadline (projID, projOldDate) {
  selProjID = Number(projID.substring(13));
  let instance = M.Datepicker.getInstance($('#newProjectDeadline'));
  let instanceDate = projOldDate.split('-');
  instance.setDate(new Date(Number(instanceDate[0]), Number(instanceDate[1])-1, Number(instanceDate[2])));
  instance.open();
}

function changeProjectStartDate (projID, projOldDate) {
  selProjID = Number(projID.substring(14));
  let instance = M.Datepicker.getInstance($('#newProjectStartDate'));
  let instanceDate = projOldDate.split('-');
  instance.setDate(new Date(Number(instanceDate[0]), Number(instanceDate[1])-1, Number(instanceDate[2])));
  instance.open();
}

function setProjectDeadline (newDate) {
  var formData = {
    'action'      : 'setProjectDeadline',
    'proj_id'     : selProjID,
    'deadline'    : getSelectedDate(newDate)
  };
  $.ajax({
    type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
    url         : 'handler.php', // the url where we want to POST
    data        : formData, // our data object
    //dataType    : 'json', // what type of data do we expect back from the server
    encode      : true,
    success     : function(data) {
      if (data.substring(0, 8) == "Success!") {
        //a mers
        $('#projDeadline_' + selProjID).html(getSelectedISODate(newDate) + '<i class="material-icons tiny" style="padding-left: 5px;">edit</i>');
      } else {
        M.toast({html: data});
        return;
      }
    }
  });
}

function setProjectStartDate (newDate) {
  var formData = {
    'action'      : 'setProjectStartDate',
    'proj_id'     : selProjID,
    'startdate'    : getSelectedDate(newDate)
  };
  $.ajax({
    type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
    url         : 'handler.php', // the url where we want to POST
    data        : formData, // our data object
    //dataType    : 'json', // what type of data do we expect back from the server
    encode      : true,
    success     : function(data) {
      if (data.substring(0, 8) == "Success!") {
        //a mers
        $('#projStartDate_' + selProjID).html(getSelectedISODate(newDate) + '<i class="material-icons tiny" style="padding-left: 5px;">edit</i>');
      } else {
        M.toast({html: data});
        return;
      }
    }
  });
}

function getLastDayOfMonth(month) {
  let noOfDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return noOfDays[Number(month)-1];
} 

function hoursWorked(month, part) {
  let wrkDate = getSelectedDate("01 " + month).split('-');
  let res = [0, 0, 0];
  if (part==1) {
    //1-15
    var intervalStart = new Date(wrkDate[2], Number(wrkDate[1])-1, 1, 0, 0, 0);
    var intervalEnd = new Date(wrkDate[2], Number(wrkDate[1])-1, 15, 0, 0, 0);
  } else {
    //16-31
    var intervalStart = new Date(wrkDate[2], Number(wrkDate[1])-1, 16, 0, 0, 0);
    var intervalEnd = new Date(wrkDate[2], Number(wrkDate[1])-1, getLastDayOfMonth(wrkDate[1]), 0, 0, 0);
  }
  pontajeObjectArray.forEach(element => {
    if (element.date>=intervalStart && element.date<=intervalEnd) {
      //avem 3 variante
      if (isInArray(holidayArray, element.date)) {
        //e 2x
        res[0]+= element.hours;
      } else if (element.date.getDay()==0 || element.date.getDay()==6) {
        //e 1,5x
        res[1]+= element.hours;
      } else {
        //e 1x
        res[2]+= element.hours;
      }
    }
  });
  return res;
}

function resetSalaryForm() {
  $('#numeSalariat').html(getDBNameFromId(userID, 'collab'));
  $('#addNewSalaryDiv').removeClass('hide');
  $('#addHourlySalary').removeClass("invalid");
  $('#addMonthlySalary').removeClass("invalid");
  $('#addHourlySalary').val('');
  $('#addMonthlySalary').val('');
  var instance = M.Datepicker.getInstance($('#addSalaryDate'));
  instance.setDate(new Date());
  $('#addSalaryDate').val(instance.toString());
  populateSalaryTable(userID);
}

function addNewSalary(user_id) {
  let newHS = $('#addHourlySalary').val();
  if (typeof newHS === 'string') { newHS = newHS.trim(); }
  if (newHS == null || newHS == "" || isNaN(newHS)) {
    //newHS nu e ce trebuie
    $('#addHourlySalary').addClass("invalid");
    return 0;
  } else {
    $('#addHourlySalary').removeClass("invalid");
  }
  let newMS = $('#addMonthlySalary').val();
  if (typeof newMS === 'string') { newMS = newMS.trim(); }
  if (newMS == null || newMS == "" || isNaN(newMS)) {
    //newHS nu e ce trebuie
    $('#addMonthlySalary').addClass("invalid");
    return 0;
  } else {
    $('#addMonthlySalary').removeClass("invalid");
  }
  
  var formData = {
    'action'    : 'addSalary',
    'collab_id' : user_id, 
    'hourly'    : newHS,
    'monthly'   : newMS,
    'date'      : getSelectedDate($('#addSalaryDate').val())
  };
  $.ajax({
    type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
    url         : 'handler.php', // the url where we want to POST
    data        : formData, // our data object
    //dataType    : 'json', // what type of data do we expect back from the server
    encode      : true,
    success     : function(data) {
      if (data.substring(0, 8) == "Success:") {
        //a mers
        $('#addNewSalaryDiv').addClass('hide');
        let insertID = data.substring(8);
        salariesObject.push({id: insertID, collab_id: user_id, hourly: newHS, monthly: newMS, date: getSelectedISODate($('#addSalaryDate').val())});
        populateSalaryTable(user_id);
      } else {
        M.toast({html: data});
        return;
      }
    }
  });
}

function populateSalaryTable(user_id) {
  $('#salaryTable').html('');
  let contor=0;
  salariesObject.forEach(element => {
    if (element.collab_id == user_id) {
      $('#salaryTable').append('<tr><td class="input-field">'+
          '<input style="text-align:center;" id="hourlySalary_'+element.id+'_'+ contor +'" type="text" class="validate" value="'+element.hourly+'">'+
        '<td class="input-field">'+
          '<input style="text-align:center;" id="monthlySalary_'+element.id+'_'+ contor +'" type="text" class="validate" value="'+element.monthly+'">'+
        '<td class="input-field">'+
          '<input style="text-align:center;" type="text" id="modifySalaryDate_'+element.id+'_'+ contor +'" class="datepicker"></td>)'+
        '<td><a class="waves-effect waves-light btn btn-small" onclick="modifiySalary('+element.id+', '+ contor +')">Modifica</a></td>');
        var elems = $('#modifySalaryDate_'+element.id+'_'+ contor++);
        let tmpDate = element.date.split('-');
        var instances = M.Datepicker.init(elems, {
        defaultDate: new Date(tmpDate[0], tmpDate[1]-1, tmpDate[2]),    
        setDefaultDate: true,
        format: 'dd mmmm yyyy',
        firstDay: 1,
        i18n: {
            weekdays: ['Duminica','Luni','Marti','Miercuri','Joi','Vineri','Sambata'],
            weekdaysShort: ['Dum','Lun','Mar','Mie','Joi','Vin','Sam'],
            weekdaysAbbrev: ['D','L','M','M','J','V','S'],
            months: ['Ianuarie','Februarie','Martie','Aprilie','Mai','Iunie','Iulie','August','Septembrie','Octombrie','Noiembrie','Decembrie'],
            monthsShort: ['Ian','Feb','Mar','Apr','Mai','Iun','Iul','Aug','Sep','Oct','Noi','Dec']
        }
    });
    }
  });
}

function modifiySalary(id, contor) {
  let newHS = $('#hourlySalary_'+id+'_'+contor).val();
  if (typeof newHS === 'string') { newHS = newHS.trim(); }
  if (newHS == null || newHS == "" || isNaN(newHS)) {
    //newHS nu e ce trebuie
    $('#hourlySalary_'+id+'_'+contor).addClass("invalid");
    return 0;
  } else {
    $('#hourlySalary_'+id+'_'+contor).removeClass("invalid");
  }
  let newMS = $('#monthlySalary_'+id+'_'+contor).val();
  if (typeof newMS === 'string') { newMS = newMS.trim(); }
  if (newMS == null || newMS == "" || isNaN(newMS)) {
    //newHS nu e ce trebuie
    $('#monthlySalary_'+id+'_'+contor).addClass("invalid");
    return 0;
  } else {
    $('#monthlySalary_'+id+'_'+contor).removeClass("invalid");
  }
  
  var formData = {
    'action'    : 'modifySalary',
    'id'        : id,
    'hourly'    : newHS,
    'monthly'   : newMS,
    'date'      : getSelectedDate($('#modifySalaryDate_'+id+'_'+ contor).val())
  };
  $.ajax({
    type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
    url         : 'handler.php', // the url where we want to POST
    data        : formData, // our data object
    //dataType    : 'json', // what type of data do we expect back from the server
    encode      : true,
    success     : function(data) {
      if (data.substring(0, 8) == "Success!") {
        //a mers
        salariesObject.forEach(element => {
          if (element.id == id) {
            element.hourly = newHS;
            element.monthly = newMS;
            element.date = getSelectedISODate($('#addSalaryDate').val());
            M.toast({html: "Salariul a fost modificat cu succes!"});
          }
        });
      } else {
        M.toast({html: data});
        return;
      }
    }
  });
}

function populatePermissions () {
  permissionsObject.forEach(element => {
    $('#permissionsTable').append('<tr><td>'+element.id+'</td>'+
    '<td><label><input type="checkbox" class="filled-in" '+(element.id==1 ? ' disabled="disabled"' : '')+' onclick="changePermissions(\'admin\', '+element.id+')"' + (element.admin==1 ? ' checked="checked""' : '') +' /><span></span></label></td>'+
    '<td><label><input type="checkbox" class="filled-in" onclick="changePermissions(\'bonus\', '+element.id+')"' + (element.bonus==1 ? ' checked="checked""' : '') +' /><span></span></label></td>'+
    '<td><label><input type="checkbox" class="filled-in" onclick="changePermissions(\'external\', '+element.id+')"' + (element.external==1 ? ' checked="checked""' : '') +' /><span></span></label></td>'+
    '<td><label><input type="checkbox" class="filled-in" onclick="changePermissions(\'holiday\', '+element.id+')"' + (element.holiday==1 ? ' checked="checked""' : '') +' /><span></span></label></td>'+
    '<td><label><input type="checkbox" class="filled-in" onclick="changePermissions(\'timesheet\', '+element.id+')"' + (element.timesheet==1 ? ' checked="checked""' : '') +' /><span></span></label></td>'+
    '</tr>');  
  });
}

function changePermissions(column, row) {
  var formData = {
    'action'    : 'changePermissionItem',
    'row'       : row, 
    'column'    : column
  };
  $.ajax({
    type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
    url         : 'handler.php', // the url where we want to POST
    data        : formData, // our data object
    //dataType    : 'json', // what type of data do we expect back from the server
    encode      : true,
    success     : function(data) {
      if (data.substring(0, 8) == "Success!") {
        //a mers
        console.log(permissionsObject);
        permissionsObject[row-1][column] = permissionsObject[row-1][column] == 0 ? 1 : 0;
        console.log(permissionsObject);
      } else {
        M.toast({html: data});
        return;
      }
    }
  });
}

function addPermissionGroup() {
  var formData = {
    'action'    : 'addPermissionsGroup'
  };
  $.ajax({
    type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
    url         : 'handler.php', // the url where we want to POST
    data        : formData, // our data object
    //dataType    : 'json', // what type of data do we expect back from the server
    encode      : true,
    success     : function(data) {
      if (data.substring(0, 8) == "Success:") {
        //a mers
        $('#permissionsTable').append('<tr><td>'+data.substring(8)+'</td>'+
        '<td><label><input type="checkbox" class="filled-in" onclick="changePermissions(\'admin\', '+data.substring(8)+')"' + ' /><span></span></label></td>'+
        '<td><label><input type="checkbox" class="filled-in" onclick="changePermissions(\'bonus\', '+data.substring(8)+')"' + ' /><span></span></label></td>'+
        '<td><label><input type="checkbox" class="filled-in" onclick="changePermissions(\'external\', '+data.substring(8)+')"' + ' /><span></span></label></td>'+
        '<td><label><input type="checkbox" class="filled-in" onclick="changePermissions(\'holiday\', '+data.substring(8)+')"' + ' /><span></span></label></td>'+
        '<td><label><input type="checkbox" class="filled-in" onclick="changePermissions(\'timesheet\', '+data.substring(8)+')"' + ' /><span></span></label></td>'+
        '</tr>');
        permissionsObject.push({id: data.substring(8), admin: 0, bonus: 0, external: 0, holiday: 0, timesheet: 0});
      } else {
        M.toast({html: data});
        return;
      }
    }
  });
}

function updatePermissionsDropdown() {
  $('#userRights').html('<option value="" disabled selected>Categorie drepturi</option>');
  permissionsObject.forEach(element => {
    $('#userRights').append('<option value="'+element.id+'">'+element.id+' - '+(element.admin==1?"Admin":"")+(element.bonus==1?" + Bonus":"")+(element.external==1?" + Externae":"")+(element.holiday==1?" + Concediu":"")+(element.timesheet==1?" + timesheet":"")+'</option>');
  });
}