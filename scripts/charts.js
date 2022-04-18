function drawProjectsChart () {
    let chartSeriesData = [];
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
                    strokeWidth: 2,
                    strokeDashArray: 2,
                    strokeColor: '#775DD0'
                  }
                ]
              };
              chartSeriesData.push(projChartData);
        }
    });
    let chartOptions = {
        series: [
        {
          name: 'Actual',
          data: chartSeriesData
        }
      ],
        chart: {
        height: 350,
        type: 'bar'
      },
      plotOptions: {
        bar: {
          horizontal: true,
        }
      },
      colors: ['#00E396'],
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
        customLegendItems: ['Actual', 'Expected'],
        markers: {
          fillColors: ['#00E396', '#775DD0']
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