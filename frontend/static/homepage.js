const jobForm = document.getElementById("jobForm");
const companyName = document.getElementById("companyName");
const position = document.getElementById("position");
const status = document.getElementById("status");
const dateApplied = document.getElementById("dateApplied");
const jobTable = document.getElementById("jobTable");
const newApplicationButton = document.getElementById("newApplicationButton")
const jobFormOverlay = document.getElementById("jobFormOverlay")
const cancelButton = document.getElementById("cancelButton");
const statusDetailFields = document.getElementById("statusDetailFields");
const statusDetail = document.getElementById("statusDetail");
const interviewFields = document.getElementById("interviewFields");
const interviewRound = document.getElementById("interviewRound");
const interviewDate = document.getElementById("interviewDate");
const notes = document.getElementById("notes");
const applicationSearch = document.getElementById("applicationSearch");
const statusFilter = document.getElementById("statusFilter");
const sortableHeaders = document.querySelectorAll("th[data-sort]");

let jobs = [];
let editingJobId = null;
let sortField = "dateApplied";
let sortDirection = "desc";
const statusDetailOptions = {
    Applied: [
        "Awaiting Reply",
        "Follow-up Needed",
        "Interview Scheduled"
    ]
};


status.addEventListener("change", function () {
    updateStatusDetailOptions();
});

statusDetail.addEventListener("change", updateInterviewFieldVisibility);
newApplicationButton.addEventListener("click", function () {
    handleOpenForm("create");
});
cancelButton.addEventListener("click", handleCloseForm);
jobForm.addEventListener("submit", handleSubmitJob);

function updateStatusDetailOptions(selectedDetail = "") {
    const selectedStatus = status.value;

    if (selectedStatus !== "Applied") {
        statusDetailFields.classList.add("hidden");
        statusDetail.innerHTML = "<option value=''>None</option>";
        statusDetail.value = "";
        updateInterviewFieldVisibility();
        return;
    }

    statusDetailFields.classList.remove("hidden");

    const options = statusDetailOptions[selectedStatus] || [];

    statusDetail.innerHTML = "<option value=''>None</option>";

    options.forEach(function (optionText) {
        const option = document.createElement("option");
        option.value = optionText;
        option.textContent = optionText;

        if (optionText === selectedDetail) {
            option.selected = true;
        }

        statusDetail.appendChild(option);
    });

    updateInterviewFieldVisibility();
}

function updateInterviewFieldVisibility() {
    const shouldShowInterviewFields =
        status.value === "Applied" &&
        statusDetail.value === "Interview Scheduled";

    if (shouldShowInterviewFields) {
        interviewFields.classList.remove("hidden");
    } else {
        interviewFields.classList.add("hidden");
        interviewRound.value = "";
        interviewDate.value = "";
    }
}

function handleOpenForm(mode, job = null) {
    jobFormOverlay.classList.remove("hidden");

    if (mode === "create") {
        editingJobId = null;
        jobForm.reset();
        updateStatusDetailOptions();
        return;
    }

    if (mode === "edit" && job !== null) {
        editingJobId = job.id;

        companyName.value = job.company;
        position.value = job.position;
        status.value = job.status;
        dateApplied.value = job.dateApplied;
        updateStatusDetailOptions(job.statusDetail);

        interviewRound.value = job.interviewRound || "";
        interviewDate.value = job.interviewDate || "";
        notes.value = job.notes || "";
    }


}



function handleCloseForm() {
    jobFormOverlay.classList.add("hidden");
    jobForm.reset();
    editingJobId = null;
    updateStatusDetailOptions();

}

async function loadApplications() {
    const res = await fetch("/api/applications");
    const data = await res.json();

    if (res.status === 401) {
        window.location.href = "/";
        return;
    }

    if (!res.ok) {
        console.error(data.error || "Failed to load applications");
        return;
    }

    jobs = data.applications;
    applyFiltersAndSort();
}

async function createApplication(payload) {
    const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to create application");
    }

    return data.application;
}
async function updateApplication(id, payload) {
    const res = await fetch("/api/applications/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to update application");
    }

    return data.application;
}

async function archiveJob(id) {
    const confirmed = confirm("Archive this application?");

    if (!confirmed) {
        return;
    }

    const res = await fetch("/api/applications/" + id + "/archive", {
        method: "POST"
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.error || "Failed to archive application");
        return;
    }

    await loadApplications();
}

async function deleteJob(id) {
    const res = await fetch("/api/applications/" + id, {
        method: "DELETE"
    });

    const data = await res.json();

    if (!res.ok) {
        console.error(data.error || "Failed to delete application");
        return;
    }

    await loadApplications();
}

async function handleSubmitJob(event) {
    event.preventDefault();

    const formData = getJobFormData();

    if (editingJobId === null) {
        await createApplication(formData);
    } else {
        await updateApplication(editingJobId, formData);
    }

    await loadApplications();
    handleCloseForm();
}

function editJob(id) {
    const jobToEdit = jobs.find(function (job) {
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
        statusDetail: statusDetail.value,
        dateApplied: dateApplied.value,
        interviewRound: interviewRound.value,
        interviewDate: interviewDate.value,
        notes: notes.value.trim()
    };
}

function applyFiltersAndSort() {
    const searchText = applicationSearch
        ? applicationSearch.value.trim().toLowerCase()
        : "";

    const selectedStatus = statusFilter
        ? statusFilter.value
        : "";

    let filteredJobs = jobs.filter(function(job) {
        const company = job.company.toLowerCase();
        const position = job.position.toLowerCase();

        const matchesSearch =
            company.includes(searchText) ||
            position.includes(searchText);

        const matchesStatus =
            selectedStatus === "" ||
            job.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    filteredJobs.sort(function(a, b) {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (sortField === "dateApplied") {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        } else {
            aValue = String(aValue).toLowerCase();
            bValue = String(bValue).toLowerCase();
        }

        if (aValue < bValue) {
            return sortDirection === "asc" ? -1 : 1;
        }

        if (aValue > bValue) {
            return sortDirection === "asc" ? 1 : -1;
        }

        return 0;
    });

    console.log("Rendering filtered jobs:", filteredJobs.length, "sort:", sortField, sortDirection);

    updateSortHeaders();
    renderJobs(filteredJobs);
}

function updateSortHeaders() {
    sortableHeaders.forEach(function(header) {
        const label = header.dataset.label;
        const field = header.dataset.sort;

        if (field !== sortField) {
            header.textContent = label;
            return;
        }

        if (sortDirection === "asc") {
            header.textContent = label + " ↑";
        } else {
            header.textContent = label + " ↓";
        }
    });
}
function setupSortAndFilterControls() {
    if (applicationSearch !== null) {
        applicationSearch.addEventListener("input", function() {
            console.log("Search changed:", applicationSearch.value);
            applyFiltersAndSort();
        });
    } else {
        console.log("applicationSearch not found");
    }

    if (statusFilter !== null) {
        statusFilter.addEventListener("change", function() {
            console.log("Status filter changed:", statusFilter.value);
            applyFiltersAndSort();
        });
    } else {
        console.log("statusFilter not found");
    }

    console.log("Sortable headers found:", sortableHeaders.length);

    sortableHeaders.forEach(function(header) {
        header.addEventListener("click", function() {
            const clickedField = header.dataset.sort;

            console.log("Header clicked:", clickedField);

            if (sortField === clickedField) {
                if (sortDirection === "asc") {
                    sortDirection = "desc";
                } else {
                    sortDirection = "asc";
                }
            } else {
                sortField = clickedField;

                if (sortField === "dateApplied") {
                    sortDirection = "desc";
                } else {
                    sortDirection = "asc";
                }
            }

            applyFiltersAndSort();
        });
    });
}

function updateSortHeaders() {
    sortableHeaders.forEach(function(header) {
        const label = header.dataset.label;
        const field = header.dataset.sort;

        if (field !== sortField) {
            header.textContent = label;
            return;
        }

        if (sortDirection === "asc") {
            header.textContent = label + " ↑";
        } else {
            header.textContent = label + " ↓";
        }
    });
}

function renderJobs(jobsToRender) {
    jobTable.innerHTML = "";
    jobsToRender.forEach(renderJobRow);
}

function renderJobRow(job) {
    const summaryRow = document.createElement("tr");
    const detailsRow = document.createElement("tr");

    summaryRow.innerHTML =
        "<td>" + job.company + "</td>" +
        "<td>" + job.position + "</td>" +
        "<td>" + job.status + "</td>" +
        "<td>" + job.dateApplied + "</td>";

    detailsRow.classList.add("hidden");

    detailsRow.innerHTML =
        "<td colspan='4'>" +
        "<div class='jobDetails'>" +
        "<p><strong>Status Detail:</strong> " + (job.statusDetail || "None") + "</p>" +
        "<p><strong>Interview Round:</strong> " + (job.interviewRound || "None") + "</p>" +
        "<p><strong>Interview Date:</strong> " + (job.interviewDate || "None") + "</p>" +
        "<p><strong>Notes:</strong> " + (job.notes || "None") + "</p>" +
        "</div>" +
        "</td>";

    const detailsBox = detailsRow.querySelector(".jobDetails");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", function (event) {
        event.stopPropagation();
        editJob(job.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function (event) {
        event.stopPropagation();
        deleteJob(job.id);
    });

    const archiveButton = document.createElement("button");
    archiveButton.textContent = "Archive";
    archiveButton.addEventListener("click", function (event) {
        event.stopPropagation();
        archiveJob(job.id);
    });

    detailsBox.appendChild(editButton);
    detailsBox.appendChild(deleteButton);
    detailsBox.appendChild(archiveButton);

    summaryRow.addEventListener("click", function () {
        detailsRow.classList.toggle("hidden");
    });

    jobTable.appendChild(summaryRow);
    jobTable.appendChild(detailsRow);
}

setupSortAndFilterControls();
updateStatusDetailOptions();
loadApplications();