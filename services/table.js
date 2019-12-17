var baseUrl = "http://localhost:3030/allRestaurants";
var allResData = [];
    var queryData = {
        city: 1,
        phone: 1,
        email: 1
    };
    

   $(".dropdown-item").click(function(e){
       city = $(this).attr('Id');

       queryData = {
        city: city,
        phone: 1,
        email: 1
    };

        $.ajax({
        type: "POST",
        url: baseUrl,
        data: queryData,
        success: (res) => {
            if(res) {
               allResData = res;
               console.log(allResData.length);
               createTable(allResData, allResData.length);
            } else {
                console.log('err')
            }
        },
        dataType: 'json'
        });
        
    
   });

   function createTable(tableData) {
       var table = document.querySelector('table');
       var tbody = document.querySelector('tbody')
       $("#body").empty();
   
       for (var i =0; i<tableData.length; i++) {
            var tr = document.createElement('tr');
            for(var j=1; j<6; j++) {
            var text = Object.keys(tableData[i]).map(item => tableData[i][item])[j]    
            var td1 = document.createElement('td');
            var text1 = document.createTextNode(text);
            td1.appendChild(text1);
            tr.appendChild(td1);
            }  
           tbody.appendChild(tr);
       } 

       table.appendChild(tbody)
   }

 function phoneFilter (){
     queryData.phone = 'NO_PHONE'
     if( $('#phone').css('color') === "rgb(255, 171, 0)") {

        $('#phone').css('color', ' #9092A1');
        $('#phone').css('background', ' rgba(144, 146, 161, .1)');
             queryData.phone = 1;
     } else {
        $('#phone').css('color', ' #FFAB00');
        $('#phone').css('background', ' rgba(255, 171, 0, .1)');

        $.ajax({
        type: "POST",
        url: baseUrl,
        data: queryData,
        success: (res) => {
            if(res) {
               allResData = res;
               createTable(allResData);
            } else {
                console.log('err')
            }
        },
        dataType: 'json'
        });
     }  
 }

 function emailFilter (){
        $('#email').css('color', ' #FFAB00');
        $('#email').css('background', ' rgba(255, 171, 0, .1)');

        $.ajax({
        type: "POST",
        url: baseUrl,
        data: {
            city: city,
            phone: 1,
            email: 'NO_EMAIL'
        },
        success: (res) => {
            if(res) {
               allResData = res;
               createTable(allResData);
            } else {
                console.log('err')
            }
        },
        dataType: 'json'
        });
 }
 
 function exportCSV() {

    $("table").table2csv('output', {
        appendTo: '#out'
    });

    $("table").table2csv({
        separator: ',',
        newline: '\n',
        quoteFields: true,
        excludeColumns: '',
        excludeRows: ''
    });
 }
