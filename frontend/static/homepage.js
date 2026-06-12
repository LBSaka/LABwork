const jobForm = document.getElementById("jobForm");
const companyName = document.getElementById("companyName");
const position = document.getElementById("position");
const status = document.getElementById("status");
const dateApplied = document.getElementById("dateApplied");
const jobTable = document.getElementById("jobTable");
let jobs = [];

jobForm.addEventListener("submit", handleCreateJob);

function handleCreateJob(event) {
    event.preventDefault();
    const job = getJobFormData();
    jobs.push(job);
    renderJobs(jobs);
    jobForm.reset();
}

function getJobFormData() {
    return {
        id: Date.now(),
        company: companyName.value.trim(),
        position: position.value.trim(),
        status: status.value,
        dateApplied: dateApplied.value
    };
}

function renderJobs(jobsToRender){
    jobTable.innerHTML = "";
    jobsToRender.forEach(renderJobRow);
}

function renderJobRow(job) {
    const row = document.createElement("tr");
    row.innerHTML = "<td>" + job.company + "</td><td>" + job.position + "</td><td>" + job.status + "</td><td>" + job.dateApplied + "</td>";
    jobTable.appendChild(row);
}