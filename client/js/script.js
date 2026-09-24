async function validateReport() {
    let name = document.getElementById("citizenName").value.trim();
    let mobile = document.getElementById("mobile").value.trim();
    let damage = document.getElementById("damageType").value;
    let location = document.getElementById("location").value.trim();
    let description = document.getElementById("description").value.trim();
    let imageFile = document.getElementById("image").files[0];

    if (
        name === "" ||
        mobile === "" ||
        damage === "" ||
        location === "" ||
        description === "" ||
        !imageFile
    ) {
        alert("Please fill all fields.");
        return false;
    }

    if (!/^\d{10}$/.test(mobile)) {
        alert("Enter a valid 10-digit mobile number.");
        return false;
    }

    let reader = new FileReader();

    reader.onload = async function (event) {
        try {
            let complaint = {
                citizenName: name,
                mobile: mobile,
                damageType: damage,
                location: location,
                description: description,
                image: event.target.result,
                status: "Pending"
            };

            let response = await fetch(
                "http://localhost:5000/api/complaints",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(complaint)
                }
            );

            let result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to submit complaint."
                );
            }

            alert("Complaint Submitted Successfully!");
            window.location = "complaint.html";

        } catch (error) {
            console.error("Complaint submission error:", error);
            alert(
                "Unable to submit complaint. Please make sure the server is running."
            );
        }
    };

    reader.readAsDataURL(imageFile);

    return false;
}

async function loadComplaints() {
    let table = document.getElementById("tableBody");

    if (!table) {
        return;
    }

    try {
        let response = await fetch(
            "http://localhost:5000/api/complaints"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch complaints");
        }

        let complaints = await response.json();

        table.innerHTML = "";

        if (complaints.length === 0) {
            table.innerHTML = `
                <tr>
                    <td colspan="7">No complaints submitted yet.</td>
                </tr>
            `;
            return;
        }

        complaints.forEach(function (item) {
            table.innerHTML += `
                <tr>
                    <td>${item._id}</td>
                    <td>${item.citizenName}</td>
                    <td>${item.damageType}</td>
                    <td>${item.location}</td>
                    <td>${item.description}</td>
                    <td>
                        ${
                            item.image
                                ? `<img src="${item.image}" width="100" height="70" style="object-fit:cover; border-radius:5px;">`
                                : "No Image"
                        }
                    </td>
                    <td>${item.status}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error loading complaints:", error);

        table.innerHTML = `
            <tr>
                <td colspan="7">Unable to load complaints.</td>
            </tr>
        `;
    }
}

async function loadAdminComplaints() {
    let table = document.getElementById("adminTableBody");
    let total = document.getElementById("totalComplaints");

    if (!table) {
        return;
    }

    try {
        let response = await fetch(
            "http://localhost:5000/api/complaints"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch complaints");
        }

        let complaints = await response.json();

        if (total) {
            total.innerText = complaints.length;
        }

        table.innerHTML = "";

        if (complaints.length === 0) {
            table.innerHTML = `
                <tr>
                    <td colspan="8">No complaints submitted yet.</td>
                </tr>
            `;
            return;
        }

        complaints.forEach(function (item) {
            table.innerHTML += `
                <tr>
                    <td>${item._id}</td>
                    <td>${item.citizenName}</td>
                    <td>${item.mobile}</td>
                    <td>${item.damageType}</td>
                    <td>${item.location}</td>
                    <td>${item.description}</td>
                    <td>${item.status}</td>
                    <td>
                        <select onchange="changeStatus('${item._id}', this.value)">
                            <option value="Pending"
                                ${item.status === "Pending" ? "selected" : ""}>
                                Pending
                            </option>

                            <option value="In Progress"
                                ${item.status === "In Progress" ? "selected" : ""}>
                                In Progress
                            </option>

                            <option value="Resolved"
                                ${item.status === "Resolved" ? "selected" : ""}>
                                Resolved
                            </option>
                        </select>

                        <br><br>

                        <button onclick="deleteComplaint('${item._id}')">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error loading admin complaints:", error);

        table.innerHTML = `
            <tr>
                <td colspan="8">Unable to load complaints.</td>
            </tr>
        `;
    }
}

async function filterComplaints() {
    let searchBox = document.getElementById("searchComplaint");
    let table = document.getElementById("adminTableBody");

    if (!searchBox || !table) {
        return;
    }

    let search = searchBox.value.toLowerCase().trim();

    try {
        let response = await fetch(
            "http://localhost:5000/api/complaints"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch complaints");
        }

        let complaints = await response.json();

        let filtered = complaints.filter(function (item) {
            return (
                item.citizenName.toLowerCase().includes(search) ||
                item.damageType.toLowerCase().includes(search) ||
                item.location.toLowerCase().includes(search)
            );
        });

        table.innerHTML = "";

        if (filtered.length === 0) {
            table.innerHTML = `
                <tr>
                    <td colspan="8">No matching complaints found.</td>
                </tr>
            `;
            return;
        }

        filtered.forEach(function (item) {
            table.innerHTML += `
                <tr>
                    <td>${item._id}</td>
                    <td>${item.citizenName}</td>
                    <td>${item.mobile}</td>
                    <td>${item.damageType}</td>
                    <td>${item.location}</td>
                    <td>${item.description}</td>
                    <td>${item.status}</td>
                    <td>
                        <select onchange="changeStatus('${item._id}', this.value)">
                            <option value="Pending"
                                ${item.status === "Pending" ? "selected" : ""}>
                                Pending
                            </option>

                            <option value="In Progress"
                                ${item.status === "In Progress" ? "selected" : ""}>
                                In Progress
                            </option>

                            <option value="Resolved"
                                ${item.status === "Resolved" ? "selected" : ""}>
                                Resolved
                            </option>
                        </select>

                        <br><br>

                        <button onclick="deleteComplaint('${item._id}')">
                            Delete
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Search error:", error);

        table.innerHTML = `
            <tr>
                <td colspan="8">Unable to search complaints.</td>
            </tr>
        `;
    }
}

async function changeStatus(id, newStatus) {
    try {
        let response = await fetch(
            `http://localhost:5000/api/complaints/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: newStatus
                })
            }
        );

        let result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Failed to update status."
            );
        }

        alert("Complaint status updated successfully.");

        loadAdminComplaints();
        loadStatistics();

    } catch (error) {
        console.error("Status update error:", error);
        alert("Unable to update complaint status.");
    }
}

async function deleteComplaint(id) {
    let answer = confirm(
        "Are you sure you want to delete this complaint?"
    );

    if (!answer) {
        return;
    }

    try {
        let response = await fetch(
            `http://localhost:5000/api/complaints/${id}`,
            {
                method: "DELETE"
            }
        );

        let result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Failed to delete complaint."
            );
        }

        alert("Complaint deleted successfully.");

        loadAdminComplaints();
        loadStatistics();

    } catch (error) {
        console.error("Delete error:", error);
        alert("Unable to delete complaint.");
    }
}

function registerUser() {
    let name = document.getElementById("registerName").value;
    let email = document.getElementById("registerEmail").value;
    let mobile = document.getElementById("registerMobile").value;
    let password = document.getElementById("registerPassword").value;
    let confirmPassword = document.getElementById("confirmPassword").value;

    if (password != confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }

    if (!/^\d{10}$/.test(mobile)) {
        alert("Enter a valid 10-digit mobile number.");
        return false;
    }

    let user = {
        name: name,
        email: email,
        mobile: mobile,
        password: password
    };

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );

    alert("Registration successful!");

    window.location = "login.html";

    return false;
}

function loginUser() {
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    let user = JSON.parse(
        localStorage.getItem("user")
    );

    if (user == null) {
        alert(
            "No registered account found. Please register first."
        );

        return false;
    }

    if (
        email == user.email &&
        password == user.password
    ) {
        localStorage.setItem(
            "loggedIn",
            "true"
        );

        alert("Login successful!");

        window.location = "index.html";

        return false;
    }

    alert("Invalid email or password.");

    return false;
}

function logoutUser() {
    localStorage.removeItem("loggedIn");

    alert("You have been logged out.");

    window.location = "login.html";
}

function showUserName() {
    let user = JSON.parse(
        localStorage.getItem("user")
    );

    let loggedIn = localStorage.getItem("loggedIn");

    let userName = document.getElementById("userName");
    let logoutButton = document.getElementById("logoutButton");

    if (
        userName &&
        user &&
        loggedIn == "true"
    ) {
        userName.innerText = "Welcome, " + user.name;
    }

    if (
        logoutButton &&
        loggedIn == "true"
    ) {
        logoutButton.style.display = "inline-block";
    }
}

function checkLogin() {
    let loggedIn = localStorage.getItem("loggedIn");

    if (loggedIn != "true") {
        alert("Please login first.");
        window.location = "login.html";
    }
}

function checkAdmin() {
    let adminLoggedIn =
        localStorage.getItem("adminLoggedIn");

    if (adminLoggedIn != "true") {
        alert(
            "Please login as administrator first."
        );

        window.location = "admin-login.html";

        return false;
    }

    return true;
}

function adminLogin() {
    let username =
        document.getElementById("adminUsername").value;

    let password =
        document.getElementById("adminPassword").value;

    let adminUsername = "admin";
    let adminPassword = "admin123";

    if (
        username == adminUsername &&
        password == adminPassword
    ) {
        localStorage.setItem(
            "adminLoggedIn",
            "true"
        );

        alert("Admin login successful!");

        window.location = "admin.html";

        return false;
    }

    alert(
        "Invalid admin username or password."
    );

    return false;
}

function adminLogout() {
    localStorage.removeItem("adminLoggedIn");

    alert("Admin logged out successfully.");

    window.location = "admin-login.html";
}

async function loadStatistics() {
    try {
        let response = await fetch(
            "http://localhost:5000/api/complaints"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch complaints");
        }

        let complaints = await response.json();

        let total = complaints.length;
        let pending = 0;
        let progress = 0;
        let resolved = 0;

        complaints.forEach(function (item) {
            if (item.status === "Pending") {
                pending++;
            }

            if (item.status === "In Progress") {
                progress++;
            }

            if (item.status === "Resolved") {
                resolved++;
            }
        });

        let totalCount =
            document.getElementById("totalCount");

        let pendingCount =
            document.getElementById("pendingCount");

        let progressCount =
            document.getElementById("progressCount");

        let resolvedCount =
            document.getElementById("resolvedCount");

        if (totalCount) {
            totalCount.innerText = total;
        }

        if (pendingCount) {
            pendingCount.innerText = pending;
        }

        if (progressCount) {
            progressCount.innerText = progress;
        }

        if (resolvedCount) {
            resolvedCount.innerText = resolved;
        }

    } catch (error) {
        console.error(
            "Statistics error:",
            error
        );
    }
}

window.addEventListener("load", function () {
    loadComplaints();
    loadAdminComplaints();
    showUserName();
    loadStatistics();
});