

  var docCookies = {
    getItem: function (sKey) {
      return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
      var sExpires = "";
      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
            break;
          case String:
            sExpires = "; expires=" + vEnd;
            break;
          case Date:
            sExpires = "; expires=" + vEnd.toUTCString();
            break;
        }
      }
      document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
      return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
      if (!sKey || !this.hasItem(sKey)) { return false; }
      document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
      return true;
    },
    hasItem: function (sKey) {
      return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: /* optional method: you can safely remove it! */ function () {
      var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
      for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
      return aKeys;
    }
  };
  function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };
  var user_id = parseJwt(docCookies.getItem("tooken"))
  user = user_id.name
  console.log(user)
  var name2 = []
  fetch('http://127.0.0.1:7000/getdelvery')
  .then(response => response.json())
  .then((post) => {

    for (let i = 0; i < post.resrvation.length; i++) {
      console.log(post.resrvation[i].book_name)
      bookReservationarry.push(post.resrvation[i].book_name)
      name2.push(post.resrvation[i])
    }
  })
console.log(name2)
  var name1 = []
  book = document.getElementById("book")
  var bookReservationarry = []
  fetch('http://127.0.0.1:7000/getbook')
    .then(response => response.json())
    .then((post) => {
      console.log(post.resrvation)
      for (let i = 0; i < post.resrvation.length; i++) {
        console.log(post.resrvation[i].book_name)
        bookReservationarry.push(post.resrvation[i].book_name)
        name1.push(post.resrvation[i])
      }
      console.log(bookReservationarry)
      for (let i = 0; i < post.booik.length; i++) {
        console.log(post.booik[i])
        var take = ""
        console.log(post.booik[i].book_name)
        console.log(bookReservationarry[i])
        if (bookReservationarry.includes(post.booik[i].book_name)) {
          take = "the book is takine"
        }
        var null1 = "";
        var null2 = "";
        var null3 = "";
        if (take != "") {
          null1 = "none"
          null2 = "none"
          null3 = "none"
        }

        else {
          null1 = "block"
          null2 = "none"
          null3 = "none"

        }
        for (let j = 0; j < name1.length; j++) {
          if (post.booik[i].book_name == name1[j].book_name && user == name1[j].user_name) {
            null2 = "block"
          }
        }

        for (let j = 0; j < name2.length; j++) {
          if (post.booik[i].book_name == name2[j].book_name && user == name2[j].user_name) {
            null3 = "block"
          }
        }

        console.log(name1)
        book.innerHTML += `
  <div>
  <div class="bg-gray-300 flex">
    <img src='${post.booik[i].book_image}' class="w-40 h-40 lg:w-2/12 h-auto" alt="book-cover" />
    <div class="flex justify-center items-start flex-col">
      <h1 class="text-xl lg:text-3xl px-5 py-3 font-bold">
      ${post.booik[i].book_name}
      
      </h1>
      <p class="hidden lg:flex lg:px-5 py-3 lg:text-2xl">
      ${post.booik[i].book_description}
      </p>
      <div id="hide" style="display: ${null1} ;">
      <button
        class="bg-green-600 lg:text-3xl px-9 py-2 lg:px-7 lg:py-5 lg:pb-5 ml-5 hover:bg-green-500 duration-200 text-white">
     <a href = "http://127.0.0.1:7000/bookdetale?myVar1=${post.booik[i].book_id}" >  Reed More <a>
      </button>
      </div>
      <div id="hide" style="display: ${null2} ;">
      <button
        class="bg-green-600 lg:text-3xl px-9 py-2 lg:px-7 lg:py-5 lg:pb-5 ml-5 hover:bg-green-500 duration-200 text-white" id = "${post.booik[i].book_id}" onclick="check(event)">
     <a href = "http://127.0.0.1:7000/book" >  delet resrvation <a>
      </button>
      </div>
      <div id="hide" style="display: ${null3} ;">
      <button
        class="bg-green-600 lg:text-3xl px-9 py-2 lg:px-7 lg:py-5 lg:pb-5 ml-5 hover:bg-green-500 duration-200 text-white" id = "${post.booik[i].book_id}" onclick="check1(event)">
     <a href = "http://127.0.0.1:7000/book" >  delet delevery <a>
      </button>
      </div>
      <p> ${take} </p>
      </div>
  </div>
</div>
      `
        // if (take != null) {
        // console.log( document.getElementById("hide").style.display = "none")
        // console.log(document.getElementById("hide"))
        // }
        //       document.getElementById("hide").style.display = "none";
        // console.log(document.getElementById("hide"))
      }


    });




function check(e) {
  const currentTarget = e.currentTarget.id
  console.log(currentTarget)
  fetch(`http://127.0.0.1:7000/deletresvation/${currentTarget}`)
  console.log(options);

}
function check1(e) {
  const currentTarget = e.currentTarget.id
  console.log(currentTarget)
  fetch(`http://127.0.0.1:7000/deletdelvery/${currentTarget}`)
  console.log(options);

}
function deletjwt() {
  docCookies.removeItem("tooken")
  window.location.replace("http://127.0.0.1:7000/");

}
//   function check (e){
//     let div2 = document.getElementById("bookdetale");
//     const currentTarget =  e.currentTarget.id
//     console.log(currentTarget)
//     // window.location.replace("http://127.0.0.1:7000/bookdetale");

//     var requestOptions = {
//       method: 'GET',
//       redirect: 'follow'
//     };

//     fetch(`http://127.0.0.1:7000/bookdetale/${currentTarget}`, requestOptions)
//       .then(async response =>{ 



//       let jsonObject=   await response.json()
//     console.log(jsonObject)  
//         div2.innerHTML = `

//         <img
//         src='${jsonObject.book_image}'
//         class="w-3/12"
//         alt="book-cover"
//       />
//       <div class="flex justify-center items-start flex-col">

//         <h1 class="text-3xl px-5 py-3 font-bold">${jsonObject.book_name}</h1>
//         <p class="px-5 py-3 text-2xl" >
//           Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati
//           non, fugiat saepe perferendis aut quasi tempora voluptas veniam
//           quisquam iste asperiores aliquid molestias quos, id magnam!
//           Dignissimos adipisci explicabo excepturi!
//         </p>
//         <div class="flex">
//         <button class="bg-green-600 text-3xl px-7 py-5 ml-5 hover:bg-green-500 duration-200 text-white " >Reed More</button>
//         <button class="bg-green-600 text-3xl px-7 py-5 ml-5 hover:bg-green-500 duration-200 text-white " >Reed More</button>
//        </div>
//       </div>
//     `


//       })
//       console.log("hi fuck you")

//  }
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
// function myFunction() {
//     document.getElementById("myDropdown").classList.toggle("show");
//   }

//   // Close the dropdown if the user clicks outside of it
//   window.onclick = function(e) {
//     if (!e.target.matches('.dropbtn')) {
//     var myDropdown = document.getElementById("myDropdown");
//       if (myDropdown.classList.contains('show')) {
//         myDropdown.classList.remove('show');
//       }
//     }
//   }

// function openCity(evt, cityName ,categoryId ) {
//     console.log(categoryId);
//     // let div2 = document.getElementById(cityName);
//   console.log(cityName)
//   var requestOptions = {
//     method: 'GET',
//     redirect: 'follow'
//   };

//   fetch(`http://127.0.0.1:7000/catogall/${categoryId}`, requestOptions)
//     .then(async response =>{ 



//     let jsonObject=   await response.json()
//   console.log(jsonObject)  
//   let div2 = document.getElementById(jsonObject[0].category_name);
//   div2.innerHTML = ""
//       for (let i = 0; i <= jsonObject.length; i++) {
//       div2.innerHTML += `
//       <div class="gallery">
//   <img src='${jsonObject[i].book_image}'  width="600" height="400">
//   <div class="desc"><a href="#">${jsonObject[i].book_name}</a></div>
//   <div id="test">

//       <a> <button type="submit" id = "${jsonObject[i].book_id}" onclick="check(event)" class="btn"> insert</button></a>
//       </div>
//     </div>

//   `
//     }


//     })
//     .catch(error => console.log('error', error));
//     var i, tabcontent, tablinks;
//     tabcontent = document.getElementsByClassName("tabcontent");
//     for (i = 0; i < tabcontent.length; i++) {
//       tabcontent[i].style.display = "none";
//     }
//     tablinks = document.getElementsByClassName("tablinks");
//     for (i = 0; i < tablinks.length; i++) {
//       tablinks[i].className = tablinks[i].className.replace(" active", "");
//     }
//     document.getElementById(cityName).style.display = "block";
//     evt.currentTarget.className += " active";

//   }


