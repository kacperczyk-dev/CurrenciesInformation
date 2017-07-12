
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
        var days = root.children; //This one has all the 90 days of data
        var values = days[0].children; //this is the first day
        data = [];
        labels = [];

        for(i=0; i<7; i++){
            data.push(days[i].children[0].getAttribute('rate'));
            labels.push(days[i].getAttribute('time'));

        }
        createLineChart(document.getElementById("lineChart"), data, labels);
        createBarChart(document.getElementById("barChart"), data, labels);
    }

    function createBarChart(context, data, labels)
    {
        for(i=0; i<data.length; i++){
            if(data[i] instanceof Array){
            }
    }

        var myChart = new Chart(context, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Dollar',
                    data: data,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor:
                        'rgba(255,99,132,1)',
                    borderWidth: 1
                }]
            },
            options: {
                title: {
                    display: true,
                    text:'1€ price'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    function createLineChart(context, data, labels)
    {
        var ctx = document.getElementById("myChart");
        var chart = new Chart(context, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: "Dollar",
                    data: data,
                    fill: false,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                }]

            },
            options: {
                responsive: true,
                title:{
                    display:true,
                    text:'1€ price'
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

/*
 rgba(54, 162, 235, 0.2)',
 'rgba(255, 206, 86, 0.2)',
 'rgba(75, 192, 192, 0.2)',
 'rgba(154, 162, 235, 0.2)',
 'rgba(155, 206, 86, 0.2)',
 'rgba(175, 192, 192, 0.2)',

 'rgba(54, 162, 235, 1)',
 'rgba(255, 206, 86, 1)',
 'rgba(75, 192, 192, 1)',
 'rgba(154, 162, 235, 1)',
 'rgba(155, 206, 86, 1)',
 'rgba(175, 192, 192, 1)',


 */