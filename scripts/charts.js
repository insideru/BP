function drawProjectsChart () {
    let chartSeriesDataOnTrack = [];
    let chartSeriesDataOffTrack = [];
    projectsObject.forEach(element => {
        if (element.active) {
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
              if (projActualTime>projBudget) {
                chartSeriesDataOffTrack.push(projChartData);
              } else {
                chartSeriesDataOnTrack.push(projChartData);
              }
        }
    });
    let chartOptions = {
        series: [
        {
          name: 'On Track',
          data: chartSeriesDataOnTrack
        },
        {
            name: 'Depasite',
            data: chartSeriesDataOffTrack
        }
      ],
        chart: {
        height: 'auto',
        type: 'bar'
      },
      plotOptions: {
        bar: {
          horizontal: true,
        }
      },
      colors: ['#00E396', '#e51c23'],
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
          fillColors: ['#00E396', '#e51c23', '#775DD0']
        }
      }
      };

    let chart = new ApexCharts(document.querySelector("#projectsChart"), chartOptions);
    chart.render();
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