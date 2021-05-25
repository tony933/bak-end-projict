let div = document.getElementById("test1");
let div1 = document.getElementById("t1");
fetch('http://127.0.0.1:7000/catog')
.then(response => response.json())
.then((post) => {
for (let i = 0; i <= post.length; i++) {
console.log(post[i])
  div.innerHTML += `
  <button class="tablinks"  onclick="openCity(event, '${post[i].category_name}' ,  '${post[i].category_id}')">${post[i].category_name}</button>
  `
      div1.innerHTML += `
      <div id="${post[i].category_name}" class="tabcontent">

</div>
      `
}
});

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown if the user clicks outside of it
  window.onclick = function(e) {
    if (!e.target.matches('.dropbtn')) {
    var myDropdown = document.getElementById("myDropdown");
      if (myDropdown.classList.contains('show')) {
        myDropdown.classList.remove('show');
      }
    }
  }

function openCity(evt, cityName ,categoryId ) {
    console.log(categoryId);
    // let div2 = document.getElementById(cityName);
  console.log(cityName)
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch(`http://127.0.0.1:7000/catogall/${categoryId}`, requestOptions)
    .then(async response =>{ 
      
      
      
    let jsonObject=   await response.json()
  console.log(jsonObject)  
  let div2 = document.getElementById(jsonObject[0].category_name);
  div2.innerHTML = ""
      for (let i = 0; i <= jsonObject.length; i++) {
      div2.innerHTML += `
      <div class="gallery">
  <img src='${jsonObject[i].book_image}'  width="600" height="400">
  <div class="desc"><a href="#">${jsonObject[i].book_name}</a></div>
  <div id="test">
      
      <a> <button type="submit" id = "${jsonObject[i].book_id}" onclick="check(event)" class="btn"> insert</button></a>
      </div>
    </div>
  
  `
    }
  
  
    })
    .catch(error => console.log('error', error));
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  
  }
  

