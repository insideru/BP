var chartedProjects = [];

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
            return `${val} / ${goals[0].value}`
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
    let wrkData = getActivitiesAndCollabs (projID);

    //graficul pe activitati
    let activitiesData = wrkData[0];
    console.log(activitiesData);
    let activitiesChartData = {
        series: [
        {
          data: activitiesData
        }
      ],
        legend: {
        show: false
      },
      chart: {
        height: 'auto',
        type: 'treemap'
      },
      title: {
        text: chartedProjects[projID].name
      }
      };

      let activitiesChart = new ApexCharts(document.querySelector("#projectsActivityChart"), activitiesChartData);
      activitiesChart.render();

      //graficul pe muluci
      let collabData = wrkData[1];
      console.log(collabData);
      let collabChartData = {
        series: [
        {
          data: collabData
        }
      ],
        legend: {
        show: false
      },
      chart: {
        height: 'auto',
        type: 'treemap'
      },
      title: {
        text: chartedProjects[projID].name
      }
      };

      let collabChart = new ApexCharts(document.querySelector("#projectsCollabChart"), collabChartData);
      collabChart.render();

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

function getActivitiesAndCollabs (projID) {
    let tmpActivities = {};
    let tmpCollabs = {};
    let res = [];
    let res0 = [];
    let res1 = [];
    alltimesheetsObject.forEach(element => {
        if (Number(element.project_id) == projID) {
            tmpActivities[getActivityNameFromID(element.activity_id)] += Number(element.time);
            tmpCollabs[getCollabNameFromID(element.collab_id)] += Number(element.time);
        }
    });
    Object.keys(tmpActivities).forEach(function(key,index) {
        res0.push({x: key, Y: tmpActivities[key]});
    });
    Object.keys(tmpCollabs).forEach(function(key,index) {
        res1.push({x: key, Y: tmpCollabs[key]});
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