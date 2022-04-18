function drawProjectsChart () {
    let chartSeriesData = [];
    let colorArray = [];
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
              chartSeriesData.push(projChartData);
              if (projActualTime>projBudget) {
                colorArray.push('#00E396');
              } else {
                colorArray.push('#E51C23');
              }
        }
    });
    console.log(colorArray);
    let chartHeight = (chartSeriesData.length+1)*50;
    let chartOptions = {
        series: [
        {
          name: 'Proiecte',
          data: chartSeriesData
        }
      ],
        chart: {
        height: chartHeight,
        type: 'bar'
      },
      plotOptions: {
        bar: {
          horizontal: true,
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