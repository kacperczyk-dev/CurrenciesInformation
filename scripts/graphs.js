
/**
 * Created by Dawid on 2017-07-10.
 */
var xmlDoc, root, days;
var base = 0;
var sets = [], labels = [], colors = [], borders = [];
var currencies = [0];
var txt = 'Price per 1€';
var myBarChart, myLineChart;

function DataSet(label, data, fill, background, border){
    this.label = label;
    this.data = data;
    this.fill = fill;
    this.backgroundColor = background;
    this.borderColor = border;
    this.borderWidth = 1;
}

window.onload = function() {
    var me = '@' + new Date().getFullYear() + ' kacperczyk-dev';
    document.getElementById('last').firstElementChild.innerHTML = me;
    document.getElementById('dateFrom').value = '2017-07-03';
    document.getElementById('dateTo').value = '2017-07-10';
    var lineChart = document.getElementById('lineChart');
    var barChart = document.getElementById('barChart');
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "/CurrenciesInformation/data/eurofxref_hist_90d.xml", true);
    xhttp.send(null);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            initialize(this);
        }
    };

    function initialize(xml) {
        xmlDoc = xml.responseXML;
        root = xmlDoc.getElementsByTagName('Cube')[0];
        days = root.children;
        var currencyList = document.getElementById('currencyList');
        for(i=0; i<days[0].children.length; i++){
            var option = document.createElement('option');
            option.text = days[0].children[i].getAttribute('currency');
            option.value = i;
            currencyList.appendChild(option);
        }
        for(i=0; i< 250; i+=10){
            var r = Math.floor(Math.random() * i);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            colors.push('rgba('+ r +', ' + g + ', ' + b + ', 0.2)');
            borders.push('rgba('+ r +', ' + g + ', ' + b + ', 1)');
        }
        getData();
    }

    function getData(){
        var f = document.getElementById('dateFrom').value;
        var t = document.getElementById('dateTo').value;
        sets = [];
        var data = [];
        var r, g, b;
        labels = [];
        var dF = Date.parse(((!f) ? '2017-07-03' : f));
        var dT = Date.parse(((!t) ? '2017-07-10' : t));
        for (i = 0; i < days.length; i++) {
            var date = Date.parse(days[i].getAttribute('time'));
            if(date >= dF && date <= dT) {
                labels.unshift(days[i].getAttribute('time'));
            }
        }
        for(j=0; j<currencies.length; j++) {

            for (i = 0; i < days.length; i++) {
                var date = Date.parse(days[i].getAttribute('time'));
                if(date >= dF && date <= dT) {
                    data.unshift(days[i].children[currencies[j]].getAttribute('rate'));
                }
            }
            sets.push(new DataSet(days[0].children[currencies[j]].getAttribute('currency'), data,
                false, colors[sets.length], borders[sets.length]));
            data = [];
        }
        if(base==1){
            base = 0;
            changeBase(1);
        }
        else {
            if(myLineChart == undefined) {
                createLineChart(lineChart, sets, labels);
                createBarChart(barChart, sets, labels);
            } else {
                updateChart(myLineChart);
                updateChart(myBarChart);
            }
        }
    }

    var dateFr = document.getElementById('dateFrom');
    var dateTo = document.getElementById('dateTo');
    dateTo.addEventListener('change', setPeriod);
    dateFr.addEventListener('change', setPeriod);
    function setPeriod(){
       if(dateFr.value && dateTo.value){
            getData();
       }
    }

    var euro = document.getElementById('EU');
    var dollar = document.getElementById('USD');
    euro.addEventListener('click', function(){changeBase(0)}, false);
    dollar.addEventListener('click', function(){changeBase(1)}, false);
    function changeBase(arg){
        if(base != arg && arg == 1) {
            base = arg;
            txt = 'Price per 1$';
            for (i = 0; i < sets.length; i++) {
                for (j = 0; j < sets[i].data.length; j++) {
                    if (i == 0) {
                        sets[i].data[j] = 1 / sets[i].data[j];
                        sets[i].label = 'EUR';
                    } else {
                        sets[i].data[j] = sets[i].data[j] * sets[0].data[j];
                    }
                }
            }
            updateChart(myLineChart);
            updateChart(myBarChart);
        }
        if(base != arg && arg == 0) {
            base = arg;
            txt = 'Price per 1€';
            for (i = 0; i < sets.length; i++) {
                for (j = 0; j < sets[i].data.length; j++) {
                    if (i == 0) {
                        sets[i].data[j] = 1 / sets[i].data[j];
                        sets[i].label = 'USD';
                    } else {
                        sets[i].data[j] = sets[i].data[j] * sets[0].data[j];
                    }
                }
            }
            updateChart(myLineChart);
            updateChart(myBarChart);
        }
    }

    var list = document.getElementById('currencyList');
    list.addEventListener('change', addFromList);
    function addFromList(){
        if(list.selectedIndex>0){
            currencies.push(list.options[list.selectedIndex].value);
            getData();
        }
    }

    function updateChart(chart){
        chart.data.datasets = sets;
        chart.data.labels = labels;
        chart.options.title.text = txt;
        chart.update();
    }

    function createBarChart(context, dataSets, labels)
    {
        myBarChart = new Chart(context, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: dataSets,
            },
            options: {
                title: {
                    display: true,
                    text: txt
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Price'
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Day'
                        }
                    }]
                }
            }
        });
    }

    function createLineChart(context, dataSets, labels)
    {
        myLineChart = new Chart(context, {
            type: 'line',
            data: {
                labels: labels,
                datasets: dataSets,
            },
            options: {
                title:{
                    display:true,
                    text: txt
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