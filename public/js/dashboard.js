/*
  Copyright Pranav Ramesh 2020
*/

var db = firebase.firestore();
var userid = ""
var useremail = ""
var isHistoryHidden = false;
document.getElementById("cancelButton").addEventListener("click", cancelGame);
//document.getElementById("findGame").addEventListener("click", gameFound);
document.getElementById("logout").addEventListener("click", logout);
document.getElementById("hidech").addEventListener("click", hidech);
document.getElementById("nothx").addEventListener("click", removeReminder)
document.getElementById("register4email").addEventListener("click", remindWithEmail());


function remindWithEmail() {

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://ctfguide.tech/api/email-list");
    xhr.send(`userid=${userid}&useremail=${useremail}`)

    // we don't want to keep telling them to sign up lol
    localStorage.setItem("hideReminders", true);
    document.getElementById("reminders").style.display = "none";

}


if (localStorage.getItem("hideReminders")) {
    document.getElementById("reminders").style.display = "none";
}


function removeReminder() {
    document.getElementById("reminders").style.display = "none";
    localStorage.setItem("hideReminders", true);
}


function hidech() {
    if (isHistoryHidden == false) {
    document.getElementById('historyDIV').style.display = 'none'
    document.getElementById('hidech').innerHTML = "Show"
    isHistoryHidden = true;
     } else {
        document.getElementById('hidech').innerHTML = "Hide"
        
        document.getElementById('historyDIV').style.display = 'block'
        isHistoryHidden = false;
     }
}

function logout() {
    firebase.auth().signOut().then(function() {
        window.location.href = "./login"
    })
}

firebase.auth().onAuthStateChanged(function(user) {


if (user) {
    userid = user.uid;
    useremail = user.email;
    if (user.displayName) {
    document.getElementById("name").innerHTML = (user.displayName)
    } else {
        var docRef = db.collection("users").doc(userid);

docRef.get().then(function(doc) {
    if (doc.exists) {
        if (!doc.data().username) {
            document.getElementById("name").innerHTML = (user.email).split("@")[0].substring(0, 5)
        } else {
          username = doc.data().username
          document.getElementById("name").innerHTML = username;
        }
    } 
}).catch(function(error) {
    console.log("Error getting document:", error);
});
    }



    var docRef = db.collection("users").doc(user.uid);

    docRef.get().then(function(doc) {
       // console.log(doc)
        if (doc.exists) {   

            console.log("Document data:", doc.data());
            document.getElementById("points").innerHTML = doc.data().points;
         //   document.getElementById("duelvictories").innerHTML = doc.data().victories;
         //   document.getElementById("rank").innerHTML = doc.data().rank;
        
            var usersRef = db.collection("users").doc(userid)
            usersRef.get(userid).then(function(doc) {

               
                if (doc.data().viewing) {
                    console.log(doc.data().viewing)
                    var id = doc.data().viewing
                    var docRef2 = db.collection("challenges").doc(id);

                    docRef2.get().then(function(doc) {
                        console.log(doc.data().title)
                        document.getElementById("challenge_name").innerHTML = doc.data().title
                        document.getElementById("challenge_link").href = "../../challenges/" + id;
                    });
                
                } else {
                    document.getElementById("lastworkingon").style.display = "none";
                }












                doc.data().challenges.forEach(id => {

                    var docRef2 = db.collection("challenges").doc(id);

                    docRef2.get().then(function(doc) {
    
                        if (doc.exists) {
                            document.querySelector('#mc').insertAdjacentHTML(
                                'beforebegin', `
                                
                                <tr  id="mc" class="bg-white hover:bg-gray-100">
                             <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
               ${id}
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900 px-6 py-4  text-sm leading-5 text-gray-500">
                   ${doc.data().title}
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 px-6 py-4 text-sm leading-5 text-white  w-10">
                      <a href="./challenges/${id}" class="bg-gray-600 hover:bg-gray-700 px-10 py-2 rounded">View Challenge</a>
                      <a href="./challenges/${id}/edit" class="bg-gray-600 hover:bg-gray-700 px-10 py-2 rounded">Edit Challenge</a>

                        </td>
                              
                          
                              </tr>
                  
                          
                                
                                
                                `);
                        }
                    });

                })
            })
           var challenges = new Promise((resolve, reject) => {
            doc.data().solved.forEach(id => {

                



                var docRef2 = db.collection("challenges").doc(id);

                docRef2.get().then(function(doc) {

                    if (doc.exists) {

                    document.querySelector('#history').insertAdjacentHTML(
                        'beforebegin', `
                        <tr id="history" class="bg-white hover:bg-gray-100">
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
               ${id}
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
                   ${doc.data().title}
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-white w-10">
                      <a href="./challenges/${id}" class="bg-gray-600 hover:bg-gray-700 px-10 py-2 rounded" >View Challenge</a>
                        </td>
                      
                  
                      </tr>
                  
                        
                        
                        `);
                    }

                });






            })
            resolve('okay')
        })
        
        
        challenges.then(value => {
            showStuff()
        })

 
            

        } else {
      
                        
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    window.location.href = "./dashboard"
                } else {
                    window.location.href = "./dashboard"
                }
            };
            xhttp.open("GET", `../api/inituser?id=${userid}`, true);
            xhttp.send();
   
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });



} else {
    window.location.href = "./login"
}
});


function gameFound() {
    document.getElementById("gameFound").style.display = "block";
}

function cancelGame() {
    document.getElementById("gameFound").style.display = "none";

}


function showStuff() {
    
    document.getElementById("loader").style.display = "none";
    document.getElementById("page_content").style.display = "block";
}