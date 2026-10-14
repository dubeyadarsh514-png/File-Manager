const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    const filePath = path.join(__dirname, "public", "index.html");

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error loading HTML file");
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
    return;
  }

  if (req.method === "GET" && req.url === "/style.css") {
    const filePath = path.join(__dirname, "public", "style.css");

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.end("Error loading CSS file");
      } else {
        res.setHeader("content-type", "text/css");
        res.end(data);
      }
    });
    return;
  }

  if (req.method === "GET" && req.url === "/script.js") {
    const filePath = path.join(__dirname, "public", "script.js");

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.end("Error loading JS file");
      } else {
        res.setHeader("content-type", "text/js");
        res.end(data);
      }
    });
    return;
  }

  if (req.method === "POST" && req.url === "/api/createFile") {
    let data = "";
    req.on("data", (chunk) => {
      data = data + chunk;
    });

    req.on("end", () => {
      const fileData = JSON.parse(data);
      console.log(data);
      const filename = fileData.fileName;
      const filepath = path.join(__dirname, "data", filename);

      const filecontent = fileData.filecontent;
      fs.writeFile(filepath, filecontent, (err) => {
        if (err) {
          res.end(
            JSON.stringify({ message: "Something went wrong in writing file" }),
          );
        } else {
          res.end(JSON.stringify({ message: "File created succesfully" }));
        }
      });
    });
  }

  if (req.method === "GET" && req.url === "/api/files") {
    const dirPath = path.join(__dirname, "data");

    fs.readdir(dirPath, (err, files) => {
      if (err) {
        res.writeHead(500, {
          "Content-Type": "application/json",
        });

        return res.end(
          JSON.stringify({
            message: "Unable to read files",
          }),
        );
      }

      res.writeHead(200, {
        "Content-Type": "application/json",
      });

      res.end(JSON.stringify(files));
    });

    return;
  }

  if (req.method === "GET" && req.url.startsWith("/api/readFile")) {
    const url = new URL(req.url, "http://localhost:3000");
    const filename = url.searchParams.get("name");

    if (!filename || path.basename(filename) !== filename) {
      res.writeHead(400, {
        "Content-Type": "application/json",
      });

      return res.end(
        JSON.stringify({
          message: "Invalid filename",
        }),
      );
    }

    const filePath = path.join(__dirname, "data", filename);

    fs.readFile(filePath, "utf8", (err, content) => {
      if (err) {
        res.writeHead(err.code === "ENOENT" ? 404 : 500, {
          "Content-Type": "application/json",
        });

        return res.end(
          JSON.stringify({
            message:
              err.code === "ENOENT" ? "File not found" : "Unable to read file",
          }),
        );
      }

      res.writeHead(200, {
        "Content-Type": "application/json",
      });

      res.end(
        JSON.stringify({
          filename: filename,
          content: content,
        }),
      );
    });

    return;
  }

  if (req.method === "GET" && req.url === "/api/systemInfo") {
    const systemInfo = {
      operatingSystem: os.type(),
      platform: os.platform(),
      architecture: os.arch(),
      hostname: os.hostname(),
      totalMemory: (os.totalmem() / 1024 ** 3).toFixed(2) + " GB",
      freeMemory: (os.freemem() / 1024 ** 3).toFixed(2) + " GB",
      numberOfCPUs: os.cpus().length,
      uptime: (os.uptime() / 3600).toFixed(2) + " hours",
    };

    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify(systemInfo));
    return;
  }
});

server.listen(3000, () => {
  console.log("Server is running at port 3000");
});
