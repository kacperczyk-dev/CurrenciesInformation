
/**
 * Created by Dawid on 2017-07-10.
 */
window.onload = function() {
    function DataSet(label, data, fill, background, border){
       this.label = label;
       this.data = data;
       this.fill = fill;
       this.backgroundColor = background;
       this.borderColor = border;
    }

    var data, labels = [];
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/CurrenciesInformation/data/eurofxref_hist_90d.xml", true);
    xhttp.send(null);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            initialize(this);
        }
    };

    function initialize(xml) {
        var xmlDoc = xml.responseXML;
        var root = xmlDoc.getElementsByTagName('Cube')[0];
        var days = root.children; //This one has all the days of data
        //var values = days[0].children; //this is the first day
        data = [];
        labels = [];

        //fill list with values
        var currencyList = document.getElementById('currencyList');
        for(i=0; i<days[0].children.length; i++){
            var option = document.createElement("option");
            option.text = days[0].children[i].getAttribute('currency');
            option.value = i;
            currencyList.appendChild(option);
        }

        //create 7 days data for charts and initialize them
        for(i=0; i<7; i++){
            data.push(days[i].children[0].getAttribute('rate'));
            labels.push(days[i].getAttribute('time'));
        }
        var sets = [
            new DataSet("Dollar", data, false, 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 1)' ),
            new DataSet("Dollar2", data, false, 'rgba(155, 99, 132, 0.2)', 'rgba(155, 99, 132, 1)' ),
        ];
        createLineChart(document.getElementById("lineChart"), sets, labels);
        createBarChart(document.getElementById("barChart"), sets, labels);
    }

    function createBarChart(context, dataSets, labels)
    {

        var myChart = new Chart(context, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: dataSets,
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
                datasets: data
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