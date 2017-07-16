
/**
 * Created by Dawid on 2017-07-10.
 */
var xmlDoc, root, days;
var base = 0;
var sets = [], labels = [], colors = [], borders = [];
var currencies = [0];
var txt = 'Price per 1€';
var myBarChart, myLineChart;
var minDate = '';
var maxDate = '';

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
        var currencies = document.getElementsByClassName('currencies');
        var length = days[0].children.length;
        var currLength = currencies.length;
        maxDate =  days[0].getAttribute('time');
        minDate = days[days.length-1].getAttribute('time');
        for(j=0; j<currLength; j++) {
            for (i = 0; i < length; i++) {
                var option = document.createElement('option');
                option.text = days[0].children[i].getAttribute('currency');
                option.value = i;
                currencies[j].appendChild(option);
            }
        }
        for(i=0; i< 250; i+=10){
            var r = Math.floor(Math.random() * i);
            var g = Math.floor(Math.random() * 255);
            var b = Math.floor(Math.random() * 255);
            colors.push('rgba('+ r +', ' + g + ', ' + b + ', 0.2)');
            borders.push('rgba('+ r +', ' + g + ', ' + b + ', 1)');
        }
        document.getElementById('last').firstElementChild.innerHTML = me;
        document.getElementById('dateFrom').value = '2017-07-03';
        document.getElementById('dateTo').value = maxDate;
        document.getElementById('date').value = maxDate;
        document.getElementById('to').selectedIndex = 5;
        getData();
    }

    function getData(){
        var f = document.getElementById('dateFrom').value;
        var t = document.getElementById('dateTo').value;
        if(Date.parse(f) >= Date.parse(minDate) && Date.parse(t) <= Date.parse(maxDate)
            && Date.parse(f) < Date.parse(t)) {
            document.getElementById('options').getElementsByTagName('fieldset')[2]
                .getElementsByTagName('p')[0].style.display = 'none';
            sets = [];
            var data = [];
            var r, g, b;
            labels = [];
            var dF = Date.parse(((!f) ? '2017-07-03' : f));
            var dT = Date.parse(((!t) ? '2017-07-10' : t));
            var daysLength = days.length
            for (i = 0; i < daysLength; i++) {
                var date = Date.parse(days[i].getAttribute('time'));
                if (date >= dF && date <= dT) {
                    labels.unshift(days[i].getAttribute('time'));
                }
            }
            var currLength = currencies.length;
            for (j = 0; j < currLength; j++) {

                for (i = 0; i < daysLength; i++) {
                    var date = Date.parse(days[i].getAttribute('time'));
                    if (date >= dF && date <= dT) {
                        data.unshift(days[i].children[currencies[j]].getAttribute('rate'));
                    }
                }
                sets.push(new DataSet(days[0].children[currencies[j]].getAttribute('currency'), data,
                    false, colors[sets.length], borders[sets.length]));
                data = [];
            }
            if (base == 1) {
                base = 0;
                changeBase(1);
            }
            else {
                if (myLineChart == undefined) {
                    createLineChart(lineChart, sets, labels);
                    createBarChart(barChart, sets, labels);
                } else {
                    updateChart(myLineChart);
                    updateChart(myBarChart);
                }
            }
        } else {
            document.getElementById('options').getElementsByTagName('fieldset')[2]
                .getElementsByTagName('p')[0].style.display = 'block';
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
        var length = sets.length;
        if(base != arg && arg == 1) {
            base = arg;
            txt = 'Price per 1$';
            for (i = 0; i < length; i++) {
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
            for (i = 0; i < length; i++) {
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

    document.getElementById("in").addEventListener('input', calculate);
    document.getElementById("date").addEventListener('change', calculate);
    document.getElementById("from").addEventListener('change', calculate);
    document.getElementById("to").addEventListener('change', calculate);
    function calculate() {
        var dateOn = Date.parse(document.getElementById('date').value);
        if(dateOn >= Date.parse('2017-04-12') && dateOn <= Date.parse('2017-07-10')) {
            document.getElementById('calculator').getElementsByTagName('p')[0].style.display = 'none';
            var fromCurr = document.getElementById('from').options[document.getElementById('from').selectedIndex].value;
            var fromCurrValue = 1;
            var toCurr = document.getElementById('to').options[document.getElementById('to').selectedIndex].value;
            var toCurrValue = 0;
            var amount = document.getElementById('in').value;
            var output = document.getElementById('out');
            var daysLength = days.length;
            var currLength = days[0].length;
            for (i = 0; i < daysLength; i++) {
                if (Date.parse(days[i].getAttribute('time')) == dateOn) {
                    fromCurrValue = days[i].children[fromCurr].getAttribute('rate');
                    toCurrValue = days[i].children[toCurr].getAttribute('rate');
                    break;
                }
            }
            output.value = Math.round((amount * toCurrValue / fromCurrValue + 0.00001) * 100) / 100;
        } else{
            document.getElementById('calculator').getElementsByTagName('p')[0].style.display = 'block';
        }
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