
/**
 * Created by Dawid on 2017-07-10.
 */
window.onload = function() {

    var data, labels = [];
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            getData(this);
        }
    };
    xhttp.open("GET", "/CurrenciesInformation/data/eurofxref_hist_90d.xml", true);
    xhttp.send(null);
    function getData(xml) {
        var xmlDoc = xml.responseXML;
        var root = xmlDoc.getElementsByTagName('Cube')[0];
        var days = root.childNodes; //This one has all the 90 days of data
        var values = days[0].childNodes; //this is the first day
        data = [];
        labels = [];
        for(i=0; i<values.length; i++){
            data.push(values[i].getAttribute('rate'));
            labels.push(values[i].getAttribute('currency'));
        }
        createBarChart();
    }

    function createBarChart()
    {
        var ctx = document.getElementById("myChart");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '1€ price in different currencies',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                title: {
                    display: true,
                    text: 'Currencies'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            type: 'logarithmic',
                        }
                    }]
                }
            }
        });
    }

    function createLineChart()
    {
        var ctx = document.getElementById("myChart");
        var chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: "Dollar",
                    data: data,
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                title:{
                    display:true,
                    text:'Currency price in Euro'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Day'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Price'
                        }
                    }]
                }
            }
        });
    }
};