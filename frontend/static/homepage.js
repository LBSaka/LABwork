const jobForm = document.getElementById("jobForm");
const companyName = document.getElementById("companyName");
const position = document.getElementById("position");
const status = document.getElementById("status");
const dateApplied = document.getElementById("dateApplied");
const jobTable = document.getElementById("jobTable");
const newApplicationButton = document.getElementById("newApplicationButton");
const jobFormOverlay = document.getElementById("jobFormOverlay");
const cancelButton = document.getElementById("cancelButton");
const cancelButtonBottom = document.getElementById("cancelButtonBottom");
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
        {
            value: "Awaiting Reply",
            labelKey: "awaitingReply"
        },
        {
            value: "Follow-up Needed",
            labelKey: "followUpNeeded"
        },
        {
            value: "Interview Scheduled",
            labelKey: "interviewScheduled"
        }
    ]
};

function t(key) {
    if (window.LABWORK && typeof window.LABWORK.t === "function") {
        return window.LABWORK.t(key);
    }

    return key;
}

function statusLabel(statusValue) {
    if (window.LABWORK && typeof window.LABWORK.statusLabel === "function") {
        return window.LABWORK.statusLabel(statusValue);
    }

    return statusValue || "";
}

function detailLabel(detailValue) {
    if (window.LABWORK && typeof window.LABWORK.detailLabel === "function") {
        return window.LABWORK.detailLabel(detailValue);
    }

    return detailValue || "None";
}

function escapeHtml(value) {
    return String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function updateStatusDetailOptions(selectedDetail = "") {
    if (!status || !statusDetail || !statusDetailFields) {
        return;
    }

    const selectedStatus = status.value;

    statusDetail.innerHTML = "";

    const noneOption = document.createElement("option");
    noneOption.value = "";
    noneOption.textContent = t("none");
    statusDetail.appendChild(noneOption);

    if (selectedStatus !== "Applied") {
        statusDetailFields.classList.add("hidden");
        statusDetail.value = "";
        updateInterviewFieldVisibility();
        return;
    }

    statusDetailFields.classList.remove("hidden");

    const options = statusDetailOptions[selectedStatus] || [];

    options.forEach(function (optionData) {
        const option = document.createElement("option");
        option.value = optionData.value;
        option.textContent = t(optionData.labelKey);

        if (optionData.value === selectedDetail) {
            option.selected = true;
        }

        statusDetail.appendChild(option);
    });

    updateInterviewFieldVisibility();
}

function updateInterviewFieldVisibility() {
    if (!status || !statusDetail || !interviewFields || !interviewRound || !interviewDate) {
        return;
    }

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
    if (!jobFormOverlay || !jobForm) {
        return;
    }

    jobFormOverlay.classList.remove("hidden");

    if (mode === "create") {
        editingJobId = null;
        jobForm.reset();
        updateStatusDetailOptions();
        return;
    }

    if (mode === "edit" && job !== null) {
        editingJobId = job.id;

        companyName.value = job.company || "";
        position.value = job.position || "";
        status.value = job.status || "NYA";
        dateApplied.value = job.dateApplied || "";
        updateStatusDetailOptions(job.statusDetail || "");

        interviewRound.value = job.interviewRound || "";
        interviewDate.value = job.interviewDate || "";
        notes.value = job.notes || "";
    }
}

function handleCloseForm() {
    if (!jobFormOverlay || !jobForm) {
        return;
    }

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
        console.error(data.error || t("failedToLoadApplications"));
        return;
    }

    jobs = data.applications || [];
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
        throw new Error(data.error || t("failedToCreateApplication"));
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
        throw new Error(data.error || t("failedToUpdateApplication"));
    }

    return data.application;
}

async function archiveJob(id) {
    const confirmed = confirm(t("archiveConfirm"));

    if (!confirmed) {
        return;
    }

    const res = await fetch("/api/applications/" + id + "/archive", {
        method: "POST"
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.error || t("failedToArchiveApplication"));
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
        alert(data.error || t("failedToDeleteApplication"));
        return;
    }

    await loadApplications();
}

async function handleSubmitJob(event) {
    event.preventDefault();

    const formData = getJobFormData();

    try {
        if (editingJobId === null) {
            await createApplication(formData);
        } else {
            await updateApplication(editingJobId, formData);
        }

        await loadApplications();
        handleCloseForm();
    } catch (error) {
        alert(error.message);
    }
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
    if (!jobTable) {
        return;
    }

    const searchText = applicationSearch
        ? applicationSearch.value.trim().toLowerCase()
        : "";

    const selectedStatus = statusFilter
        ? statusFilter.value
        : "";

    let filteredJobs = jobs.filter(function (job) {
        const jobCompany = String(job.company || "").toLowerCase();
        const jobPosition = String(job.position || "").toLowerCase();

        const matchesSearch =
            jobCompany.includes(searchText) ||
            jobPosition.includes(searchText);

        const matchesStatus =
            selectedStatus === "" ||
            job.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    filteredJobs.sort(function (a, b) {
        let aValue = a[sortField] || "";
        let bValue = b[sortField] || "";

        if (sortField === "dateApplied") {
            aValue = aValue ? new Date(aValue) : new Date(0);
            bValue = bValue ? new Date(bValue) : new Date(0);
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

    updateSortHeaders();
    renderJobs(filteredJobs);
}

function getHeaderLabel(header) {
    const labelKey = header.dataset.labelKey;

    if (labelKey) {
        return t(labelKey);
    }

    return header.dataset.label || header.textContent;
}

function updateSortHeaders() {
    sortableHeaders.forEach(function (header) {
        const label = getHeaderLabel(header);
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
    if (applicationSearch) {
        applicationSearch.addEventListener("input", applyFiltersAndSort);
    }

    if (statusFilter) {
        statusFilter.addEventListener("change", applyFiltersAndSort);
    }

    sortableHeaders.forEach(function (header) {
        header.addEventListener("click", function () {
            const clickedField = header.dataset.sort;

            if (sortField === clickedField) {
                sortDirection = sortDirection === "asc" ? "desc" : "asc";
            } else {
                sortField = clickedField;
                sortDirection = sortField === "dateApplied" ? "desc" : "asc";
            }

            applyFiltersAndSort();
        });
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
        "<td>" + escapeHtml(job.company) + "</td>" +
        "<td>" + escapeHtml(job.position) + "</td>" +
        "<td>" + escapeHtml(statusLabel(job.status)) + "</td>" +
        "<td>" + escapeHtml(job.dateApplied) + "</td>";

    detailsRow.classList.add("hidden");

    detailsRow.innerHTML =
        "<td colspan='4'>" +
        "<div class='jobDetails'>" +
        "<p><strong>" + escapeHtml(t("statusDetail")) + ":</strong> " + escapeHtml(detailLabel(job.statusDetail || "")) + "</p>" +
        "<p><strong>" + escapeHtml(t("interviewRound")) + ":</strong> " + escapeHtml(job.interviewRound || t("none")) + "</p>" +
        "<p><strong>" + escapeHtml(t("interviewDate")) + ":</strong> " + escapeHtml(job.interviewDate || t("none")) + "</p>" +
        "<p><strong>" + escapeHtml(t("notes")) + ":</strong> " + escapeHtml(job.notes || t("none")) + "</p>" +
        "</div>" +
        "</td>";

    const detailsBox = detailsRow.querySelector(".jobDetails");

    const editButton = document.createElement("button");
    editButton.textContent = t("edit");
    editButton.addEventListener("click", function (event) {
        event.stopPropagation();
        editJob(job.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = t("delete");
    deleteButton.addEventListener("click", function (event) {
        event.stopPropagation();
        deleteJob(job.id);
    });

    const archiveButton = document.createElement("button");
    archiveButton.textContent = t("archive");
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

if (status) {
    status.addEventListener("change", function () {
        updateStatusDetailOptions();
    });
}

if (statusDetail) {
    statusDetail.addEventListener("change", updateInterviewFieldVisibility);
}

if (newApplicationButton) {
    newApplicationButton.addEventListener("click", function () {
        handleOpenForm("create");
    });
}

if (cancelButton) {
    cancelButton.addEventListener("click", handleCloseForm);
}

if (cancelButtonBottom) {
    cancelButtonBottom.addEventListener("click", handleCloseForm);
}

if (jobForm) {
    jobForm.addEventListener("submit", handleSubmitJob);
}

document.addEventListener("labwork:languagechange", function () {
    updateStatusDetailOptions(statusDetail ? statusDetail.value : "");
    applyFiltersAndSort();
});

setupSortAndFilterControls();
updateStatusDetailOptions();
loadApplications();
