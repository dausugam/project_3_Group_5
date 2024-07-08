// Array to store school data fetched from the server
let schoolsData = [];

// Get DOM elements for school select dropdown, chart context, postcode select dropdown, and school table
const schoolSelect = document.getElementById("school-select");
const studentChartCtx = document
  .getElementById("student-chart")
  .getContext("2d");
const postcodeSelect = document.getElementById("postcode-select");
const schoolTable = document.getElementById("school-table");
const tableBody = schoolTable.querySelector("tbody");

// Variables for the student chart and data
let studentChart;
let data;

// Function to fetch data from the server using D3.js
function fetchData() {
  d3.json("./data.json")
    .then(function (data) {
      schoolsData = data;
      schoolMap();
      populateSchoolNameDropdown();
      showDefaultChart();
      createDoughnut();
      populatePostcodeDropdown(data);
      postcodeSelect.addEventListener("change", () => updateTable(data));
      updateTable(data); // Initialize table with default selection
    })
    .catch(function (error) {
      console.error("Error fetching data:", error);
    });
}

// Create and configure the map object using Leaflet.js
let markerClusterMap = L.map("map", {
  center: [-26.59696821, 120.2259056], // Center coordinates
  zoom: 5, // Initial zoom level
});

// Add tile layer to the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(markerClusterMap);

// Function to create and display markers on the map
function schoolMap() {
  let school_markers = L.markerClusterGroup(); // Create a marker cluster group

  // Loop through school data and add markers to the cluster group
  for (let i = 1; i < schoolsData.length; i++) {
    let popupText = `<h4>${schoolsData[i].School_Name}</h4><hr><p>
                Classification: ${schoolsData[i].Classification_Group}<br>
                Region: ${schoolsData[i].Education_Region}<br>
                School Code: ${schoolsData[i].Code}
            </p>`;

    let school_marker = L.marker([
      schoolsData[i].Latitude,
      schoolsData[i].Longitude,
    ]);

    school_marker.bindPopup(popupText);
    school_markers.addLayer(school_marker);
  }

  markerClusterMap.addLayer(school_markers); // Add marker cluster group to the map
}

// Function to populate the postcode dropdown with unique postcodes
function populatePostcodeDropdown(data) {
  const postcodes = [...new Set(data.map((school) => school.Postcode))];
  postcodes.forEach((postcode) => {
    const option = document.createElement("option");
    option.value = postcode;
    option.textContent = postcode;
    postcodeSelect.appendChild(option);
  });
}

// Function to update the school table based on the selected postcode
function updateTable(data) {
  const selectedPostcode = postcodeSelect.value;
  const filteredSchools = data.filter(
    (school) => school.Postcode == selectedPostcode
  );

  tableBody.innerHTML = ""; // Clear existing rows

  filteredSchools.forEach((school) => {
    const tr = document.createElement("tr");

    const tdName = createCell(school.School_Name);
    const tdCode = createCell(school.Code);
    const tdAddress = createCell(school.Address);
    const tdSuburb = createCell(school.Suburb);
    const tdPhone = createCell(school.Phone);
    const tdRegion = createCell(school.Education_Region);
    const tdClassification = createCell(school.Classification_Group);
    const tdTotal = createCell(school.Total_Students);

    tr.append(
      tdName,
      tdCode,
      tdAddress,
      tdSuburb,
      tdPhone,
      tdRegion,
      tdClassification,
      tdTotal
    );
    tableBody.appendChild(tr);
  });

  adjustTableHeight(filteredSchools.length); // Adjust table height based on the number of rows
}

// Helper function to create table cells
function createCell(text) {
  const td = document.createElement("td");
  td.textContent = text;
  return td;
}

// Function to adjust the table height based on the number of rows
function adjustTableHeight(numRows) {
  const rowHeight = 42; // Approximate height of each row (adjust as needed)
  const maxRows = 5; // Maximum number of rows to show
  const height = Math.min(numRows, maxRows) * rowHeight;
  tableBody.style.height = `${height}px`;
}

// Function to populate the school select dropdown with school names
function populateSchoolNameDropdown() {
  // Sort schoolsData by School_Name alphabetically
  schoolsData.sort((a, b) => a.School_Name.localeCompare(b.School_Name));

  schoolsData.forEach((school) => {
    const option = document.createElement("option");
    option.value = school.Code;
    option.textContent = `${school.School_Name}`;
    schoolSelect.appendChild(option);
  });
}

// Function to show the default chart for the first school in the list
function showDefaultChart() {
  if (schoolsData.length > 0) {
    schoolSelect.value = schoolsData[0].Code;
    updateChart();
  }
}

// Function to update the student chart based on the selected school
function updateChart() {
  const selectedCode = parseInt(schoolSelect.value);
  const school = schoolsData.find((s) => s.Code === selectedCode);

  if (studentChart) {
    studentChart.destroy();
  }

  if (school) {
    studentChart = new Chart(studentChartCtx, {
      type: "bar",
      data: {
        labels: [
          "Students_KIN",
          "Students_PPR",
          "Students_Y01",
          "Students_Y02",
          "Students_Y03",
          "Students_Y04",
          "Students_Y05",
          "Students_Y06",
          "Students_Y07",
          "Students_Y08",
          "Students_Y09",
          "Students_Y10",
          "Students_Y11",
          "Students_Y12",
        ],
        datasets: [
          {
            label: "Number of Students",
            data: [
              school.Students_KIN,
              school.Students_PPR,
              school.Students_Y01,
              school.Students_Y02,
              school.Students_Y03,
              school.Students_Y04,
              school.Students_Y05,
              school.Students_Y06,
              school.Students_Y07,
              school.Students_Y08,
              school.Students_Y09,
              school.Students_Y10,
              school.Students_Y11,
              school.Students_Y12,
            ],
            backgroundColor: "rgba(0, 0, 137, 0.8)",
            borderColor: "rgba(0, 0, 137, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Update school details in the detail section
    document.getElementById("detail-code").textContent = school.Code;
    document.getElementById("detail-name").textContent = school.School_Name;
    document.getElementById("detail-address").textContent = school.Address;
    document.getElementById("detail-phone").textContent = school.Phone;
    document.getElementById("detail-classification").textContent =
      school.Classification_Group;
    document.getElementById("detail-total").textContent = school.Total_Students;
  }
}

// Function to create a doughnut chart showing the number of schools by region
function createDoughnut() {
  let regions = [];

  // Loop through school data and collect regions
  for (let i = 1; i < schoolsData.length; i++) {
    regions.push(schoolsData[i].Education_Region);
  }

  // Get unique regions and count occurrences
  let uniqueRegions = [...new Set(regions)];
  let regionsCount = {};
  regions.forEach((value) => {
    regionsCount[value] = (regionsCount[value] || 0) + 1;
  });

  let uniqueRegionsCount = uniqueRegions.map((value) => regionsCount[value]);

  // Define colors for the chart
  let colors = [
    "#00aeef",
    "#7757be",
    "#ed008c",
    "#f23c69",
    "#f67846",
    "#fff000",
    "#807800",
    "#000000",
  ];

  // Get the canvas element for the doughnut chart
  let doughnutChart = document.getElementById("doughnut");

  // Define the data for the doughnut chart
  let data = {
    labels: uniqueRegions,
    datasets: [
      {
        label: "Number of Schools",
        backgroundColor: colors,
        data: uniqueRegionsCount,
        hoverOffset: 6,
      },
    ],
  };

  // Create the doughnut chart using Chart.js
  new Chart(doughnutChart, {
    type: "doughnut",
    data: data,
    options: {
      plugins: {
        legend: { position: "bottom" },
        title: {
          display: true,
          text: "Schools by Region",
          font: {
            size: 26,
          },
        },
      },
    },
  });
}

// Function to initialize the dashboard
function init() {
  fetchData();
}

// Initialize the dashboard on page load
init();
