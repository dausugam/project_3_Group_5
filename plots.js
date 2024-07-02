// Use d3.json to fetch data from the Flask endpoint
d3.json("http://127.0.0.1:5000/data")
  .then(function (data) {
    console.log(data);
  })
  .catch(function (error) {
    console.error("Error fetching data:", error);
  });
