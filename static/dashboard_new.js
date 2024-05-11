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
        const chatInput = document.getElementById('chat-input');
        chatInput.focus(); // Focus on the input field
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

Chart.defaults.font.family = 'Inter, sans-serif'; 
Chart.defaults.font.size = 12; 
Chart.defaults.font.style = 'semibold'; 
Chart.defaults.color ='#000000'; 

    
    
    
$(document).ready(function() {
    
    $('#example').DataTable({
        "autoWidth": true,
        "paging": false,
        "ordering": false,
        "language": {
            "emptyTable": "Please Select a Data Source"
        },
    });
});


//displaying raw data initially once a user selects  data source
function fetchData(language) {
    $('.title_text').text('All reviews - ' + language);
    document.getElementById('loadingModal').style.display = 'block';
    console.log("fetching issss logginggg")
    fetch(`https://20.11.0.162.nip.io/raw_data/${language}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                updateTableStructure(data[0]);  
                updateTable(data);
                document.getElementById('loadingModal').style.display = 'none   ';
  
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

function trimSentence(sentence, maxLength) {
    if (sentence.length <= maxLength) {
        return sentence;
    } else {
        console.log(sentence)
        return sentence.slice(0, maxLength) + "...";
    }
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
        "autoWidth": false,
        "paging": false,
        "ordering": false,

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
                console.log(item[key])
                var it = trimSentence(item[key].toString(), 90);
                if (item[key].startsWith("http")) {
                    row.push("<a target='_blank' class='underline w-full hover:cursor-pointer semibold' href="+item[key]+">"+"Link"+"</a>");  
                } else {
                    row.push(it);
                }
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

    document.getElementById('chat').style.display = 'flex';

    fetch(`https://20.11.0.162.nip.io/process_data/${language}`)
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
        // make chat button display visible
        if (currentLanguage) {
            $('.text_2').hide();

            $('.title_text').text('Insightful Reviews - ' + currentLanguage);

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
                label: 'Categories',
                
                	
                data: data,
                
                backgroundColor: [
                    // 'rgba(255, 99, 132, 0.2)',
                    // 'rgba(54, 162, 235, 0.2)',
                    // 'rgba(255, 206, 86, 0.2)',
                    // 'rgba(75, 192, 192, 0.2)',
                    // 'rgba(153, 102, 255, 0.2)',
                    // 'rgba(255, 159, 64, 0.2)'
                    'rgba(255, 99, 132)',
                    'rgba(54, 162, 235)',
                    'rgba(255, 206, 86)',
                    'rgba(75, 192, 192 )',
                    'rgba(153, 102, 255 )',
                    'rgba(255, 159, 64)'
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
            plugins: {
                legend: {
                    display: false
                },
            },
            
          scales: {
              y: {
                  beginAtZero: true
              },
              
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
    $('.text-sub').text('Subcategories of ' + label);
   

    const url = `https://20.11.0.162.nip.io/get_list_of_subcat?category=${encodeURIComponent(label)}&datasource=${encodeURIComponent(currentLanguage)}`;
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
        })
        .catch(error => {
            console.error('Error fetching subcategories:', error);
        });
}

function sortList() {
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('searchSubInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("subcategoryList");
    li = ul.getElementsByTagName('li');
    console.log(li)
  
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  }

  // run the sortList function when the user types in the search box

    document.getElementById('searchSubInput').addEventListener('keyup', sortList);
    




    
    
function fetchDetails(category, subcategory, datasource) {
    console.log("Fetching details for", category, subcategory, "from", datasource);
    $('.title_text').text('For Subcategory - ' + trimSentence(subcategory.toString(), 15));
    const url = `https://20.11.0.162.nip.io/get_subcat_data?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}&datasource=${encodeURIComponent(datasource)}`;
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
    const url = `https://20.11.0.162.nip.io/get_category_data?category=${encodeURIComponent(label)}&datasource=${encodeURIComponent(currentLanguage)}`;
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
console.log("testing")
// document.getElementById('sendButton').addEventListener('click', function() {
//     console.log("hello")
//     var input = document.getElementById('chat-input');
//     var message = input.value.trim();
//     console.log(message)
//     if (message) {
//         var chatMessages = document.getElementById('chat-messages');
//         var msgElement = document.createElement('div');
        
//         // Toggle alignment class based on the previous message
//         if (isRightAligned) {
//             msgElement.className = 'chat-message-left';
//         } else {
//             msgElement.className = 'chat-message-right';
//         }
//         isRightAligned = !isRightAligned;  // Flip the alignment for the next message

//         msgElement.textContent = message;
//         chatMessages.appendChild(msgElement);
//         chatMessages.scrollTop = chatMessages.scrollHeight;
//     }
//     input.value = '';
// });




document.getElementById('sendButton').addEventListener('click', function() {
    var input = document.getElementById('chat-input');
    var message = input.value.trim(); 
    console.log("hello") 
    console.log(message)
    appendMessageToChat(message, 'right');

    var lang = currentLanguage;
    
    const chatInput = document.getElementById('chat-input');
    chatInput.focus(); // Focus on the input field

    // if (message) { 

        fetch('https://20.11.0.162.nip.io/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'  // Set the content type of the request
            },
            body: JSON.stringify({ question: message, language: lang })  // Convert the JavaScript object to a JSON string
         })


        
        .then(response => response.text())  
        .then(text => {
                        appendMessageToChat(text, 'left');  
        })
        .catch(error => console.error('Error:', error));  

        input.value = ''; 
    // }
});

// when the input is enter

document.getElementById('chat-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('sendButton').click();
    }
});

function appendMessageToChat(message, alignment) {
    var chatMessages = document.getElementById('chat-messages');
    var msgElement = document.createElement('div');
    msgElement.textContent = message;
    msgElement.className = alignment === 'right' ? 'chat-message-right' : 'chat-message-left';  
    chatMessages.appendChild(msgElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;  
}