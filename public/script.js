const filenameInput = document.getElementById("filename");
const filecontentInput = document.getElementById("content");
console.log("Hello");

async function createFile(){
    const fileName = filenameInput.value;
    const filecontent = filecontentInput.value;
    console.log(fileName, filecontent);

    const response = await fetch("/api/createFile", {
        method : "POST",
        headers:{
            "content-type" : "application/json"
        },
        body:JSON.stringify({fileName:fileName, filecontent:filecontent})
    })

    const data = await response.json();
    console.log(data.message);
}


async function getFiles() {
    const fileList = document.getElementById("fileList");

    try {
        const response = await fetch("/api/files");

        if (!response.ok) {
            throw new Error("Failed to fetch files");
        }

        const files = await response.json();

        fileList.innerHTML = "";

        if (files.length === 0) {
            fileList.textContent = "No files found.";
            return;
        }

        files.forEach((file) => {
            
            const li = document.createElement("li");

            const fileName = document.createElement("span");
            fileName.textContent = file + " ";

            const readButton = document.createElement("button");
            readButton.textContent = "Read";

            readButton.addEventListener("click", () => {
                readFile(file);
            });

            li.appendChild(fileName);
            li.appendChild(readButton);
            fileList.appendChild(li);

        });
    } catch (error) {
        console.error(error);
        fileList.textContent = "Unable to load files.";
    }
}


async function readFile(filename) {
    try {
        const response = await fetch(
            `/api/readFile?name=${encodeURIComponent(filename)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        document.getElementById("message").textContent =
            `${data.filename}: ${data.content}`;
    } catch (error) {
        console.error(error);

        document.getElementById("message").textContent =
            error.message || "Unable to read file.";
    }
}



async function getSystemInfo() {
    const systemInfoElement = document.getElementById("systemInfo");

    try {
        const response = await fetch("/api/systemInfo");

        if (!response.ok) {
            throw new Error("Failed to fetch system information");
        }

        const info = await response.json();

        systemInfoElement.innerHTML = `
            <strong>Operating System:</strong> ${info.operatingSystem}<br>
            <strong>Platform:</strong> ${info.platform}<br>
            <strong>Architecture:</strong> ${info.architecture}<br>
            <strong>Hostname:</strong> ${info.hostname}<br>
            <strong>Total Memory:</strong> ${info.totalMemory}<br>
            <strong>Free Memory:</strong> ${info.freeMemory}<br>
            <strong>CPU Cores:</strong> ${info.numberOfCPUs}<br>
            <strong>System Uptime:</strong> ${info.uptime}
        `;
    } catch (error) {
        console.error(error);
        systemInfoElement.textContent =
            "Unable to load system information.";
    }
}
