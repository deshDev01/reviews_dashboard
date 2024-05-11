document.addEventListener("DOMContentLoaded", function() {
    
    var langDropdown = document.querySelector('.language-dropdown');
    var langMenu = document.querySelector('.lang-menu');

    function toggleDropdown() {
        langMenu.style.display = langMenu.style.display === 'block' ? 'none' : 'block';
    }

    
    langDropdown.addEventListener('click', function (event) {
        toggleDropdown();
        event.stopPropagation(); 
    });

    
    document.querySelectorAll('.lang-menu .lang_m').forEach(function (item) {
        item.addEventListener('click', function () {
            langMenu.style.display = 'none'; 
        });
    });

    
    document.addEventListener('click', function () {
        if (langMenu.style.display === 'block') {
            langMenu.style.display = 'none';
        }
    });

   
    langMenu.addEventListener('click', function (event) {
        event.stopPropagation();
    });

    //chatbox

    document.getElementById('chat').addEventListener('click', function() {
        document.getElementById('chatbox').style.display = 'block';
        const messageContainer = document.querySelector('.chat-messages');
        messageContainer.innerHTML = '<p class="welcome-message">Hi, how can I help you?</p>'; // Show the chatbox
    });
    
    var closeButton = document.getElementById('cross');

    // Ensure the button exists to prevent errors
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            // Select the chatbox and change its display style to 'none' to hide it
            var chatBox = document.getElementById('chatbox');
            if (chatBox) {
                chatBox.style.display = 'none';
            }
        });
    }
    
    // Make the DIV element draggable:
    dragElement(document.getElementById("chatbox"));
    
    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.querySelector(".chat-header")) {
            // if present, the header is where you move the DIV from:
            document.querySelector(".chat-header").onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }
    
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }
    
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
    
        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    //
    

  
    
});

Chart.defaults.font.family = 'Arial, sans-serif'; 
Chart.defaults.font.size = 14; 
Chart.defaults.font.style = 'normal'; 
Chart.defaults.color ='#000000'; 
    
    
    
    
$(document).ready(function() {
    
    $('#example').DataTable({
        "language": {
            "emptyTable": "Please Select a Data Source"
        }
    });
});


//displaying raw data initially once a user selects  data source
function fetchData(language) {
    fetch(`http://127.0.0.1:5000/raw_data/${language}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                updateTableStructure(data[0]);  
                updateTable(data);  
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

function updateTableStructure(item) {
    var table = $('#example').DataTable();
    table.clear().destroy(); 
    $('#example').empty(); 
    var thead = $('<thead>');
    var tr = $('<tr>');
    Object.keys(item).forEach(key => {
        if(key.trim() !== '') {  
            $('<th>').text(key).appendTo(tr);  
        }
    });
    thead.append(tr);
    $('#example').append(thead);  
    
    $('#example').DataTable({
        "language": {
            "emptyTable": "Please select a data source"
        }
    });
}

function updateTable(data) {
    var table = $('#example').DataTable();

    
    data.forEach(item => {
        var row = [];
        Object.keys(item).forEach(key => {
            if(key.trim() !== '') { 
                row.push(item[key]);  
            }
        });
        table.row.add(row);  
    });
    table.draw();  
}


//work on analyze button


let currentLanguage = '';


$('.lang_m').on('click', function(e) {
    e.preventDefault(); 
    currentLanguage = $(this).data('lang');
    console.log(currentLanguage) 
    
});
//stage-2 of data 
function fetchLanguageData(language, callback) {
    fetch(`http://127.0.0.1:5000/process_data/${language}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                updateTableStructure(data[0]);  
                updateTable(data);  
            }//
            if (callback) {
                callback();  
            }//
        })
        .catch(error => console.error('Error fetching data:', error));
}

    $('#analyzeBtn').click(function() {
        if (currentLanguage) {
            $('.text_2').hide();
        $('.button-new').hide(); 
            fetchLanguageData(currentLanguage, function(){
             //work on chart
             
                var table = $('#example').DataTable(); 
            
                let categoryCounts = {};
                
                table.rows().data().each(function(value, index) {
                    let category = value[0]; 
                    if (categoryCounts[category]) {
                        categoryCounts[category]++;
                    } else {
                        categoryCounts[category] = 1;
                    }
                });
            
                let labels = Object.keys(categoryCounts);
                let data = Object.values(categoryCounts);
            
                renderChart(labels, data);
            
        });
    } else {
        alert('Please select a language first!');
    }
});

function renderChart(labels, data) {
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            
            labels: labels,
            datasets: [{
                label: 'Displaying Categories',
                
                	
                data: data,
                
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            
            
          scales: {
              y: {
                  beginAtZero: true
              }
          },
          onClick: function(event, elements) {
            $('.text_3').hide();
            
            if (elements.length > 0) {
                var firstPoint = elements[0];
                var label = this.data.labels[firstPoint.index];
                console.log(label)
                fetchcategorydata(label,currentLanguage)
                displaySubcategories(label,currentLanguage);
            }
          }
        }
    });
  }


function displaySubcategories(label, currentLanguage) {
    console.log("Fetching subcategories for:", label, "from datasource:", currentLanguage);
    
    const url = `http://127.0.0.1:5000/get_list_of_subcat?category=${encodeURIComponent(label)}&datasource=${encodeURIComponent(currentLanguage)}`;
    fetch(url)
        .then(response => response.json())
        .then(subcategories => {
            console.log("Subcategories received:", subcategories);

            // Find the list element and clear it
            var $list = $('#subcategoryList');
            $list.empty();  // Clear existing entries

            // Append each subcategory to the list
            subcategories.forEach(subcat => {
                var $item = $(`<li>${subcat}</li>`);
                $list.append($item);

                // Attach a click event handler to each item
                $item.on('click', function() {
                    console.log("Subcategory clicked:", subcat);
                    fetchDetails(label, subcat, currentLanguage);
                });
            });

            // Show the list container if it was previously hidden
            $('#subcategoryDisplay').show();
        })
        .catch(error => {
            console.error('Error fetching subcategories:', error);
        });
}





    
    
function fetchDetails(category, subcategory, datasource) {
    console.log("Fetching details for", category, subcategory, "from", datasource);
    const url = `http://127.0.0.1:5000/get_subcat_data?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}&datasource=${encodeURIComponent(datasource)}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                updateTableStructure(data[0]);  
                updateTable(data);  
            }
            
        })
        .catch(error => console.error('Error fetching data:', error));
}

//selected cat data will be loaded into a table
function fetchcategorydata(label)
{
    console.log("Fetching details for", label,currentLanguage);
    const url = `http://127.0.0.1:5000/get_category_data?category=${encodeURIComponent(label)}&datasource=${encodeURIComponent(currentLanguage)}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                updateTableStructure(data[0]);  
                updateTable(data);  
            }
            
        })
        .catch(error => console.error('Error fetching data:', error));
}

///navbar code

let isRightAligned = false;  // Starts with right aligned messages

document.getElementById('sendButton').addEventListener('click', function() {
    var input = document.getElementById('chat-input');
    var message = input.value.trim();
    if (message) {
        var chatMessages = document.getElementById('chat-messages');
        var msgElement = document.createElement('div');
        
        // Toggle alignment class based on the previous message
        if (isRightAligned) {
            msgElement.className = 'chat-message-left';
        } else {
            msgElement.className = 'chat-message-right';
        }
        isRightAligned = !isRightAligned;  // Flip the alignment for the next message

        msgElement.textContent = message;
        chatMessages.appendChild(msgElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    input.value = '';
});




