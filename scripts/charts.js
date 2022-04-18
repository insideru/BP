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
    console.log("Updated cu proiectul " + chartedProjects[projID].name);
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