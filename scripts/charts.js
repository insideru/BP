function drawProjectsChart () {
    let options = 0;
    projectsObject.forEach(element => {
        if (element.active) {
            let projDetails = buildProjectWorkHours(element.id);
            console.log(element.name, projDetails);
        }
    });
    //let chart = new ApexCharts(document.querySelector("#projectsChart"), options);
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