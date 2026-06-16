const jobForm = document.getElementById("jobForm");
const companyName = document.getElementById("companyName");
const position = document.getElementById("position");
const status = document.getElementById("status");
const dateApplied = document.getElementById("dateApplied");
const jobTable = document.getElementById("jobTable");
const newApplicationButton = document.getElementById("newApplicationButton")
const jobFormOverlay = document.getElementById("jobFormOverlay")
const cancelButton = document.getElementById("cancelButton");
let jobs = [];
let editingJobId = null;

newApplicationButton.addEventListener("click", function() {
    handleOpenForm("create");
});
cancelButton.addEventListener("click", handleCloseForm);
jobForm.addEventListener("submit", handleSubmitJob);
function handleOpenForm(mode, job = null) {
    jobFormOverlay.classList.remove("hidden");

    if (mode === "create") {
        editingJobId = null;
        jobForm.reset();
        return;
    }

    if (mode === "edit" && job !== null) {
        editingJobId = job.id;

        companyName.value = job.company;
        position.value = job.position;
        status.value = job.status;
        dateApplied.value = job.dateApplied;
    }


}
function handleCloseForm() {
    jobFormOverlay.classList.add("hidden");
    jobForm.reset();
    editingJobId = null;
}
function handleSubmitJob(event) {
    event.preventDefault();

    const formData = getJobFormData();

    if (editingJobId === null) {
        const newJob = {
            id: Date.now(),
            ...formData
        };

        jobs.push(newJob);
    } else {
        jobs = jobs.map(function(job) {
            if (job.id === editingJobId) {
                return {
                    id: job.id,
                    ...formData
                };
            }

            return job;
        });
    }

    renderJobs(jobs);
    handleCloseForm();
}
function deleteJob(id) {
    jobs = jobs.filter(function (job) {
        return job.id !== id;
    });
    renderJobs(jobs);
}

function editJob(id) {
    const jobToEdit = jobs.find(function(job) {
        return job.id === id;
    });

    if (!jobToEdit) {
        return;
    }

    handleOpenForm("edit", jobToEdit);
}

function getJobFormData() {
    return {
        company: companyName.value.trim(),
        position: position.value.trim(),
        status: status.value,
        dateApplied: dateApplied.value
    };
}

function renderJobs(jobsToRender) {
    jobTable.innerHTML = "";
    jobsToRender.forEach(renderJobRow);
}

function renderJobRow(job) {
    const row = document.createElement("tr");

    row.innerHTML =
        "<td>" + job.company + "</td>" +
        "<td>" + job.position + "</td>" +
        "<td>" + job.status + "</td>" +
        "<td>" + job.dateApplied + "</td>";

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", function() {
        editJob(job.id);
    });

    const editCell = document.createElement("td");
    editCell.appendChild(editButton);
    row.appendChild(editCell);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() {
        deleteJob(job.id);
    });

    const deleteCell = document.createElement("td");
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);

    jobTable.appendChild(row);
}