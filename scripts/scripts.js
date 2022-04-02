clientsObject = [];
collabCatsObject = [];
projCatsObject = [];
collabsObject = [];
projectsObject = [];
activitiesObject = [];
timesheetsObject = [];
holidayArray = [];
daysoffArray = [];

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
          //console.log("Ar trebui sa mearga! " + data);
        }
    });
}

function populateProjCat() {
  $('#dropdown_categorie_proiect2').html('<li><a href="#!" onclick="changeProjectCategory2(this.innerHTML)">Toate</a></li>');
  projCatsObject.forEach(element => {
    $('#projCatTable').append("<tr><td>"+element.name+"</td></tr>");
    //initializare dropdown categorii proiecte
    $('#dropdown_categorie_proiect').append('<li><a href="#!" onclick="changeProjectCategory(this.innerHTML)">'+element.name+'</a></li>');
    $('#dropdown_categorie_proiect2').append('<li><a href="#!" onclick="changeProjectCategory2(this.innerHTML)">'+element.name+'</a></li>');
  });
}

function populateActivities() {
  activitiesObject.forEach(element => {
    $('#activityTable').append("<tr><td>"+element.name+"</td>"+'</td><td>'+getDBNameFromId(element.project_type, "projCat")+'</td></tr>');
  });
}

function populateColabCat() {
  collabCatsObject.forEach(element => {
    $('#colabCatTable').append("<tr><td>"+element.name+"</td></tr>");
    //initializare dropdown clienti
    $('#dropdown_categorie_colaborator').append('<li><a href="#!" onclick="changeColabCategory(this.innerHTML)">'+element.name+'</a></li>');
  });
}

function populateClients() {
  clientsObject.forEach(element => {
    $('#clientsTable').append("<tr><td>"+element.name+"</td></tr>");
    //initializare dropdown clienti
    $('#dropdown_client_proiect').append('<li><a href="#!" onclick="changeClient(this.innerHTML)">'+element.name+'</a></li>');
  });
}

function populateCollabs() {
  collabsObject.forEach(element => {
    $('#collabsTable').append("<tr><td>"+element.name+"</td><td>"+getDBNameFromId(element.collabCatID, "colabCat")+"</td></tr>");
  });
}

function populateProjects() {
  projectsObject.forEach(element => {
    isChecked = "";
    if (element.active=="1") { isChecked = 'checked="checked" ';}
    $('#projTable').append('<tr><td>'+element.name+'</td><td>'+getDBNameFromId(element.type_id, "projCat")+'</td><td>'+getDBNameFromId(element.client_id, "projClient")+'</td><td><label><input type="checkbox" id="projNo_' + element.id + '" onclick="changeProjState(this.id)"' + isChecked +' /><span></span></label></td></tr>');
  });
}

function populateHolidays() {
  holidaysObject.forEach(element => {
    $('#daysoffTable').append("<tr><td>"+element.name+"</td>"+'</td><td>'+getFullDate(element.date)+'</td><td><i class="material-icons red-text" style="cursor:pointer" onClick="deleteHoliday(\'' + element.date + '\')">delete_forever</i></td></tr>');
  });
}

function getHolidays() {
  collab_id = 0; //se va lua collab_idul de unde o fi el
  $.get("handler.php?r=holidays&collab_id=" + collab_id, function(data, status) {
    rcvData = JSON.parse(data);
    console.log(rcvData);
    holidaysData = rcvData.holidays;
    daysoffData = rcvData.daysoff;
    holidayArray = [];
    daysoffArray = [];
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
      return isNaN(wrkdHours) ? 0 : wrkdHours;
    }
  }
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
  behaviour: 'tap-drag',
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

function validateTime (time) {
  if (time.length==5) {
    timeArray = time.split(":");
    if (Number(timeArray[0])<23 && Number(timeArray[1])<60) {
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
  if (timesheetsObject.length==0) {
    valid = false;
    M.toast({html: 'Adauga cel putin un proiect la care ai lucrat!'});
  } else {
    if (calculateHours("toate")==0) {
      valid = false;
      M.toast({html: 'Alege cel putin o activitate la care ai lucrat!'});
    }
  }
  return valid;
}

function validateConcediu () {
  var data1 = $("#startDate").val();
  var valid = true;
  if (!validateDate(data1)) {
    valid = false;
    $("#startDate").addClass("invalid");
  } else {
    $("#startDate").addClass("valid");
  }
  var data2 = $("#endDate").val();
  if (!validateDate(data2)) {
    valid = false;
    $("#endDate").addClass("invalid");
  } else {
    $("#endDate").addClass("valid");
  }
  if (valid) {
    data1 = new Date(data1);
    data2 = new Date(data2);
    if (data1 > data2) {
      valid = false;
      M.toast({html: 'Data de inceput nu poate fi dupa data de sfarsit a concediului!'});
    }
    if (data1 - data2 == 0) {
      valid = false;
      M.toast({html: 'Data de inceput si de sfarsit a concediului nu pot fi acceasi!'});
    }
    if (data2 > data1) {
      nrZileLibere = getNoDaysOff(data1, data2);
      //console.log(nrZileLibere);
      daysoffArray.forEach(element => {
        if (compareDateRanges(data1, data2, element[0], element[1])) {
          M.toast({html: 'Perioada aleasa se suprapune cu un alt concediu!'});
        }
      });
    }
  }
  else {
    return valid;
  }
}

function getNoDaysOff(data1, data2) {
  var zileLibere = 0;
  for (var d = data1; d <= data2; d.setDate(d.getDate() + 1)) {
    if (d.getDay()>0 && d.getDay()<6 && !isInArray(holidayArray, d)) {
      zileLibere = zileLibere + 1;
    }
  }
  return zileLibere;
}

function isInArray(array, value) {
  return !!array.find(item => {return item.getTime() == value.getTime()});
}

function changeSelectedDate() {
  //newDate = getSelectedDate();
  //for (i=0;i<timeWorked.length; i++) {
  //    timeWorked[i][4] = newDate;
  //}
}

function buildEventsObject(eventsArray) {
  var retObject={};
  eventsArray.forEach(element => {
    retObject[element.date] = (isNaN(Number(retObject[element.date])) ? 0 : Number(retObject[element.date])) + Number(element.time);
  });
  return retObject;
}

function buildTimesheetCalendarEvents(eventsArray) {
  var eventsObject = buildEventsObject(eventsArray);
  for(let key in eventsObject){
    //console.log("Adaug pontaj pentru data de " + key + " cu timpul " + eventsObject[key]);
    addCalendarEvent("pontaj-" + key, Number(eventsObject[key]) + (Number(eventsObject[key]) == 1 ? " ora" : " ore"), "Apasa pentru a sterge pontarea", key, "pontare", "#8773c1");
 }
}

function buildCalendarHolidays(daysoffArray, holidaysArray) {
  daysoffArray.forEach(element => {
    curDays = getNoDaysOff((new Date(element.startdate)).setHours(0, 0, 0), (new Date(element.enddate)).setHours(0, 0, 0));
    addCalendarEvent('dayoff-'+element.startdate, Concediu, "Concediu " + curDays + curDays == 1 ? curDays + " zile" : curDays + " zi", element.startdate, element.enddate, "Holidays", "#77bfe9");
  });
  holidaysArray.forEach(element => {
    addCalendarEvent('holiday-'+element.date, element.name, "", element.date, element.date, "Holidays", "#57d110");
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
  var formData = {
    'action'            : 'deleteTimesheets',
    'collab_id'         : 0, //trebuie luat din cookie sau cumva
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

function initCalendar() {
  //initialize calendar
  $('#calendar').evoCalendar({
    language: 'ro',
    format:	'yyyy-mm-dd',
    eventHeaderFormat: 'dd MM yyyy',
    firstDayOfWeek: 1,
    //theme: 'Orange Coral'
  });
  $('#calendar').evoCalendar('toggleEventList', true);
  $('#calendar').on('selectEvent', function(event, activeEvent) {
    if (activeEvent['type']=="pontare") {
      if (confirm("Orele pontate pentru aceasta zi vor fi sterse. Continui?")) {
        deletePontaj(activeEvent['date']);
      }
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
  var formData = {
    'action'            : 'getTimesheets',
    'collab_id'         : 0, //trebuie luat din cookie sau cumva
  };
  $.ajax({
      type        : 'POST', // define the type of HTTP verb we want to use (POST for our form)
      url         : 'handler.php', // the url where we want to POST
      data        : formData, // our data object
      //dataType    : 'json', // what type of data do we expect back from the server
      encode      : true,
      success     : function(data) {
        rvdData = JSON.parse(data);
        if (typeof(rvdData) === 'object') {
          buildTimesheetCalendarEvents(rvdData.timesheets);
          buildCalendarHolidays(rvdData.daysoff, rvdData.holidays);
        } else {
          M.toast({html: data.substring(15)});
        }
      },
      error: function(){
          //
      }
  });
}