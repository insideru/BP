var chartedProjects = [];
var secondCharts = false;

function drawProjectsChart () {
    let chartSeriesData = [];
    let colorArray = [];
    chartedProjects = [];

    projectsObject.forEach(element => {
        if (Number(element.active)) {
            let projActualTime = buildProjectWorkHours(element.id);
            let projName = element.name;
            let projBudget = Number(element.budget);

            let projChartData = {
                x: projName,
                y: projActualTime,
                goals: [
                  {
                    name: 'Ore bugetate',
                    value: projBudget,
                    strokeWidth: 5,
                    strokeHeight: 10,
                    strokeColor: '#775DD0'
                  }
                ]
              };
              chartedProjects.push(element);
              chartSeriesData.push(projChartData);
              if (projActualTime>projBudget) {
                colorArray.push('#E51C23');
              } else {
                colorArray.push('#00E396');
              }
        }
    });
    let chartHeight = (chartSeriesData.length+1)*40;
    let chartOptions = {
        series: [
        {
          data: chartSeriesData
        }
      ],
        chart: {
        height: chartHeight,
        type: 'bar',
        events: {
            click: function(event, chartContext, config) {
              // The last parameter config contains additional information like `seriesIndex` and `dataPointIndex` for cartesian charts
                updateProjectCharts(config.dataPointIndex);
            }
          },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
        }
      },
      colors: colorArray,
      dataLabels: {
        formatter: function(val, opt) {
          const goals =
            opt.w.config.series[opt.seriesIndex].data[opt.dataPointIndex]
              .goals
      
          if (goals && goals.length) {
            return `${val} / ${goals[0].value}`;
          }
          return val
        }
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        customLegendItems: ['On track', 'Buget depasit', 'Durata bugetata'],
        markers: {
          fillColors: ['#00E396', '#E51C23', '#775DD0']
        }
      }
      };

    let chart = new ApexCharts(document.querySelector("#projectsChart"), chartOptions);
    chart.render();
}

function updateProjectCharts (projID) {
    //console.log("Updated cu proiectul " + chartedProjects[projID].name);
    if (projID == -1) { return; }
    let wrkData = getActivitiesAndCollabs (chartedProjects[projID].id);
    buildProjetTimeline(chartedProjects[projID].id);

    //graficul pe activitati
    let activitiesData = wrkData[0];
    let activitiesChartData = {
        series: [
        {
          data: activitiesData
        }
      ],
        legend: {
        show: false
      },
      colors: ['#50369b'],
      chart: {
        height: 'auto',
        type: 'treemap'
      },
      title: {
        text: chartedProjects[projID].name
      }
      };

      //graficul pe muluci
      let collabData = wrkData[1];
      let collabChartData = {
        series: [
        {
          data: collabData
        }
      ],
        legend: {
        show: false
      },
      colors: ['#136267'],
      chart: {
        height: 'auto',
        type: 'treemap'
      },
      title: {
        text: chartedProjects[projID].name
      }
      };
      
      if (!secondCharts) {
        activitiesChart = new ApexCharts(document.querySelector("#projectsActivityChart"), activitiesChartData);
        activitiesChart.render();
        collabChart = new ApexCharts(document.querySelector("#projectsCollabChart"), collabChartData);
        collabChart.render();
        secondCharts = true;
      } else {
        activitiesChart.updateOptions ({title: {text: chartedProjects[projID].name}}, true, true, true);
        activitiesChart.updateSeries ([{data: activitiesData}], true);
        collabChart.updateOptions ({title: {text: chartedProjects[projID].name}}, true, true, true);
        collabChart.updateSeries ([{data: collabData}], true);
      }
}

function buildProjectWorkHours (projID) {
  let retval = 0;
  alltimesheetsObject.forEach(element => {
      if (element.project_id == projID) {
          retval+=Number(element.time);
      }
  });
  return retval;
}

function buildProjetTimeline (projID) {
  let projectTimesheets = new Array(activitiesObject.length);
  alltimesheetsObject.forEach(element => {
    if (element.project_id == projID) {
      if (typeof projectTimesheets[element.activity_id] === 'undefined') {
        projectTimesheets[element.activity_id] = new Array;
      }
      if (!projectTimesheets[element.activity_id].includes(element.date)) {
        projectTimesheets[element.activity_id].push(element.date);
      }
    }
  });
  projectTimesheets.forEach((element, index, _array) => {
    let primu = true;
    let iStart = iEnd = new Date;
    for (i=0; i<element.length; i++) {
      let _date = element[i].split('-');
      if (primu) {
        iStart = new Date (Number(_date[0]), Number(_date[1])-1, Number(_date[2]), 0, 0, 0);
        iEnd = new Date (Number(_date[0]), Number(_date[1])-1, Number(_date[2]), 0, 0, 0);
        primu = false;
      } else {
        let curDate = new Date (Number(_date[0]), Number(_date[1])-1, Number(_date[2]), 0, 0, 0);
        curDate.setDate(curDate.getDate() - 1);
        if (curDate - iEnd == 0) {
          iEnd = new Date(Number(_date[0]), Number(_date[1])-1, Number(_date[2]), 0, 0, 0);
        } else {
          primu = true;
          i--;
          if (iStart - iEnd == 0) {
            iEnd.setDate(iEnd.getDate()+1);
          }
          console.log(getActivityNameFromID(activitiesObject[index]), iStart, iEnd);
        }
      }
    }
    if (!primu) {
      if (iStart - iEnd == 0) {
        iEnd.setDate(iEnd.getDate()+1);
      }
      console.log(getActivityNameFromID(activitiesObject[index]), iStart, iEnd);
    }
  })
}

function getActivitiesAndCollabs (projID) {
    let tmpActivities = {};
    let tmpCollabs = {};
    let res = [];
    let res0 = [];
    let res1 = [];
    alltimesheetsObject.forEach(element => {
        if (Number(element.project_id) == projID) {
            let tmpAct = getActivityNameFromID(element.activity_id);
            let tmpCollab = getCollabNameFromID(element.collab_id);
            if (isNaN(tmpActivities[tmpAct])) {
                tmpActivities[tmpAct] = Number(element.time);
            } else {
                tmpActivities[tmpAct] += Number(element.time);
            }
            if (isNaN(tmpCollabs[tmpCollab])) {
                tmpCollabs[tmpCollab] = Number(element.time);
            } else {
                tmpCollabs[tmpCollab] += Number(element.time);
            }
        }
    });
    Object.keys(tmpActivities).forEach(function(key,index) {
        res0.push({x: key, y: tmpActivities[key]});
    });
    Object.keys(tmpCollabs).forEach(function(key,index) {
        res1.push({x: key, y: tmpCollabs[key]});
    });
    res.push(res0);
    res.push(res1);
    return res;
}

function getActivityNameFromID (activityID) {
    let res="";
    activitiesObject.forEach(element => {
        if (Number(element.id) == activityID) {
            res = element.name;
        }
    });
    return res;
}

function getCollabNameFromID (collabID) {
    let res="";
    collabsObject.forEach(element => {
        if (Number(element.id) == collabID) {
            res = element.name;
        }
    });
    return res;
}