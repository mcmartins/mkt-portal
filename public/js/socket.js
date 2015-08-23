(function () {
  var socket = io();
  var total = 0;
  var radarChart;

  socket.on('job succeeded', function (data) {
    total++;
    radarChart.datasets[0].points[0].value++;
    radarChart.update();
  });
  socket.on('job retrying', function (data) {
    total++;
    radarChart.datasets[0].points[2].value++;
    radarChart.update();
  });
  socket.on('job failed', function (data) {
    total++;
    radarChart.datasets[0].points[1].value++;
    radarChart.update();
  });
  socket.on('error', console.error.bind(console));
  socket.on('message', console.log.bind(console));

  function generateRadarChart() {
    var ctx = document.getElementById("radarChart").getContext("2d");
    var data = {
      labels: ["Processed", "Failed", "Retrying"],
      datasets: [
        {
          label: "Queue State",
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: [0, 0, 0]
        }
      ]
    };
    radarChart = new Chart(ctx).Radar(data, {animation: true});
  }

  function generateBarChart(data) {
    var ctx = document.getElementById("barChart").getContext("2d");
    var labels = [];
    var values = [];
    data.forEach(function (el) {
      labels.push(el._id.from + ' / ' + el._id.to);
      values.push(el.count);
    });
    if (labels.length == 0 || values.length == 0) {
      labels.push(0);
      values.push(0);
    }
    new Chart(ctx).Bar({
      labels: labels,
      datasets: [
        {
          label: "Queue State",
          fillColor: "rgba(220,220,220,0.2)",
          strokeColor: "rgba(220,220,220,1)",
          pointColor: "rgba(220,220,220,1)",
          pointStrokeColor: "#fff",
          pointHighlightFill: "#fff",
          pointHighlightStroke: "rgba(220,220,220,1)",
          data: values
        }
      ]
    }, {animation: true});
  }

  function fillTable(data) {
    document.getElementById('table').innerHTML = '';
    data.forEach(function (el) {
      var tr = document.createElement('tr');
      var td = document.createElement('td');
      td.innerHTML = el.timePlaced;
      tr.appendChild(td);
      td = document.createElement('td');
      td.innerHTML = el.originatingCountry;
      tr.appendChild(td);
      td = document.createElement('td');
      td.innerHTML = el.currencyFrom;
      tr.appendChild(td);
      td = document.createElement('td');
      td.innerHTML = el.currencyTo;
      tr.appendChild(td);
      td = document.createElement('td');
      td.innerHTML = el.amountSell;
      tr.appendChild(td);
      td = document.createElement('td');
      td.innerHTML = el.amountBuy;
      tr.appendChild(td);
      td = document.createElement('td');
      td.innerHTML = el.rate;
      tr.appendChild(td);
      document.getElementById('table').appendChild(tr);
    });
  }

  function checkLastProcessedMessages() {
    $.get("/mkt/processed", function (data) {
      fillTable(data);
    });
  }

  function checkMessagesByCurrencyGroup() {
    $.get("/mkt/currency", function (data) {
      generateBarChart(data);
    });
  }

  setInterval(function () {
    checkLastProcessedMessages();
    checkMessagesByCurrencyGroup();
  }, 5000);

  checkLastProcessedMessages();
  checkMessagesByCurrencyGroup();
  generateRadarChart();
})();