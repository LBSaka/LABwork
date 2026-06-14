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
function deleteJob(id) { 
    jobs = jobs.filter(function(job) {
         return job.id !== id; 
        });
         renderJobs(jobs); 
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
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() { deleteJob(job.id); });
    const deleteCell = document.createElement("td");
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);
    jobTable.appendChild(row);
}