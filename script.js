 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
 import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
 import { doc, setDoc, collection, getDocs, deleteDoc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
 import { getStorage, ref, uploadBytesResumable, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
 import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js"

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const db = getFirestore(app);
 console.log(db);

 const add_button = document.getElementById("add_record");
 add_button.addEventListener('click', function () {
     add_record();
 })

 const close_button = document.getElementById("close_btn");
 close_button.addEventListener('click', function () {
     document.getElementById("form").style.display = "none";
 })

 const close_button2 = document.getElementById("close_btn2");
 close_button2.addEventListener('click', function () {
     document.getElementById("create_form").style.display = "none";
 })

 const close_button3 = document.getElementById("close_btn3");
 close_button3.addEventListener('click', function () {
     document.getElementById("table_details").style.display = "none";
 })

 const applyButton = document.getElementById("applybtn");
 applyButton.addEventListener('click', function () {
     apply_changes();
 })

 const createButton = document.getElementById("create_btn");
 createButton.addEventListener('click', function () {
     create_record();
 })

 const signinbtn = document.getElementById("sign_inbtn");
 signinbtn.addEventListener('click', sign_in_user)

 const search_btn = document.getElementById("search_btn");
 search_btn.addEventListener('click', search_record);

 document.getElementById("table_details").style.display = "none";

 var previous_value = ""

 function search_record() {
     var search_value = "";
     search_value = document.getElementById("search_value").value;
     console.log(previous_value);

     console.log(search_value);
     var tr = document.getElementsByTagName("tr");
     console.log(tr);

     // console.log(tr[1].id);
     // 
     // if(search_value != previous_value)
     // {
     //     for(var i = 1; i<tr.length; i++){
     //         if(tr[i].id == previous_value && (i%2) == 1){
     //             tr[i].style.backgroundColor = "#f2f2f2"
     //             tr[i].style.color = "black"
     //         }
     //         if(tr[i].id == previous_value && (i%2) == 0)
     //         {
     //             tr[i].style.backgroundColor = "white";
     //             tr[i].style.color = "black"
     //         }
     //     }
     // }

     for (var i = 1; i < tr.length; i++) {
         if (tr[i].id.indexOf(search_value) > -1) {
             tr[i].style.backgroundColor = "rgb(30 191 133)";
             tr[i].style.color = "white";
             tr[i].style.border = " 1px solid rgb(172, 172, 172)"
         }
         if (search_value == "" && (i % 2) == 1) {
             tr[i].style.backgroundColor = "#f2f2f2";
             tr[i].style.color = "black";
             tr[i].style.border = "";
         }
         if (search_value == "" && (i % 2) == 0) {
             tr[i].style.backgroundColor = "white";
             tr[i].style.color = "black";
             tr[i].style.border = "";
         }
         if (tr[i].id.indexOf(search_value) == -1 && (i % 2) == 1) {
             tr[i].style.backgroundColor = "#f2f2f2"
             tr[i].style.color = "black"
             tr[i].style.border = "";
         }
         if (tr[i].id.indexOf(search_value) == -1 && (i % 2) == 0) {
             tr[i].style.backgroundColor = "white";
             tr[i].style.color = "black"
             tr[i].style.border = "";
         }
     }
     previous_value = search_value;
 }

 function add_record() {
     document.getElementById("create_form").style.display = "block";
     document.getElementById("first_name2").value = "";
     document.getElementById("last_name2").value = "";
     document.getElementById("middle_name2").value = "";
     document.getElementById("email2").value = "";
     document.getElementById("contact2").value = ""
     document.getElementById("address2").value = "";
     document.getElementById("city2").value = "";
     document.getElementById("dob2").value = "";
     document.getElementById("contact2").readOnly = false;
     document.getElementById("image_up2").value = "";
 }

 async function create_record() {
     var file = "";
     var first_name = document.getElementById("first_name2").value
     var last_name = document.getElementById("last_name2").value
     var middle_name = document.getElementById("middle_name2").value
     var email = document.getElementById("email2").value
     var tel = document.getElementById("contact2").value
     var address = document.getElementById("address2").value
     var city = document.getElementById("city2").value
     var dob = document.getElementById("dob2").value
     file = document.getElementById("image_up2").files[0];
     var image_url = "";

     var intials = first_name.charAt(0).toUpperCase();
     console.log(intials);

     if ((first_name || tel) == "") {
         alert("firstname and contact are compulsary");
     }
     else {
         if (file) {
             const storage = getStorage();

             // Create the file metadata
             /** @type {any} */
             const metadata = {
                 contentType: 'image/jpeg'
             };

             // Upload file and metadata to the object 'images/mountains.jpg'
             const storageRef = ref(storage, 'images/' + tel);
             const uploadTask = uploadBytesResumable(storageRef, file, metadata);

             var downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
             console.log('File available at', downloadURL);
             image_url = downloadURL;

             await setDoc(doc(db, "user", tel), {
                 first_name: first_name,
                 last_name: last_name,
                 middle_name: middle_name,
                 email: email,
                 contact: tel,
                 address: address,
                 city: city,
                 DOB: dob,
                 imgurl: image_url,
                 user_initials: intials
             });
         }
         else {
             await setDoc(doc(db, "user", tel), {
                 first_name: first_name,
                 last_name: last_name,
                 middle_name: middle_name,
                 email: email,
                 contact: tel,
                 address: address,
                 city: city,
                 DOB: dob,
                 user_initials: intials
             });
         }

         fetchDataAndPopulateTable();

         document.getElementById("create_form").style.display = "none"
         // window.alert("User added successfully");
     }

 }

 // Define the change_data function outside of fetchDataAndPopulateTable
 function change_data(element) {
     console.log("changing");
     document.getElementById("form").style.display = "block";
     document.getElementById("contact").readOnly = true;
     var td = element.parentNode;
     var tr = td.parentNode;
     console.log(tr);
     var row_data = tr.getElementsByTagName("td");


     document.getElementById("first_name").value = row_data[1].textContent;
     document.getElementById("last_name").value = row_data[2].textContent;
     document.getElementById("middle_name").value = row_data[3].textContent;
     document.getElementById("email").value = row_data[4].textContent;
     document.getElementById("contact").value = row_data[5].textContent;
     document.getElementById("address").value = row_data[6].textContent;
     document.getElementById("city").value = row_data[7].textContent;
     document.getElementById("dob").value = row_data[8].textContent;
     document.getElementById("image_up").value = "";
 }
 async function apply_changes() {
     var file = "";
     var first_name = document.getElementById("first_name").value
     var last_name = document.getElementById("last_name").value
     var middle_name = document.getElementById("middle_name").value
     var email = document.getElementById("email").value
     var tel = document.getElementById("contact").value
     var address = document.getElementById("address").value
     var city = document.getElementById("city").value
     var dob = document.getElementById("dob").value
     file = document.getElementById("image_up").files[0];
     var image_url = "";
     var intials = first_name.charAt(0).toUpperCase();
     console.log(intials);


     if (file) {
         const storage = getStorage();

         // Create the file metadata
         /** @type {any} */
         const metadata = {
             contentType: 'image/jpeg'
         };


         // Upload file and metadata to the object 'images/mountains.jpg'
         const storageRef = ref(storage, 'images/' + tel);
         const uploadTask = uploadBytesResumable(storageRef, file, metadata);

         var downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
         console.log('File available at', downloadURL);
         image_url = downloadURL;

         await updateDoc(doc(db, "user", tel), {
             first_name: first_name,
             last_name: last_name,
             middle_name: middle_name,
             email: email,
             contact: tel,
             address: address,
             city: city,
             DOB: dob,
             imgurl: image_url,
             user_initials: intials
         });
     }
     else {
         await updateDoc(doc(db, "user", tel), {
             first_name: first_name,
             last_name: last_name,
             middle_name: middle_name,
             email: email,
             contact: tel,
             address: address,
             city: city,
             DOB: dob,
             user_initials: intials
         });
     }
     fetchDataAndPopulateTable();

     document.getElementById("form").style.display = "none"
     window.alert("Changes applied successfully");

 }


 async function delete_data(element) {
     var confirmation = confirm("Do you want to delete the user");

     if (confirmation == true) {
         console.log("deleting");
         var td = element.parentNode;
         var tr = td.parentNode;
         console.log(tr);
         var row_data = tr.getElementsByTagName("td");
         var tel = row_data[5].textContent;
         await deleteDoc(doc(db, "user", tel));
         // window.alert("Employee deleted successfully");
         fetchDataAndPopulateTable();
     }
 }

 async function fetchDataAndPopulateTable() {
     var table = `<tr id="column_titles"> 
                     <td></td>
                     <td>First name</td>
                     <td>Last name</td>
                     <td>Middle name</td>
                     <td>Email</td>
                     <td>Contact</td>
                     <td>Address</td>
                     <td>City</td>
                     <td>DOB</td>
                     <td>Options</td>
                 </tr>`;

     function create_rows(doc) {
         var row = "";
         var rec_data = doc.data();

         var first_name = rec_data.first_name;
         var last_name = rec_data.last_name;
         var middle_name = rec_data.middle_name;
         var email = rec_data.email;
         var contact = rec_data.contact;
         var address = rec_data.address;
         var city = rec_data.city;
         var Dob = rec_data.DOB;
         var img_received = rec_data.imgurl;
         var initials = rec_data.user_initials;
         console.log(img_received);


         if (img_received) {
             row = `<tr id="${contact}">
                     <td>
                         <img id="${contact}" class="image_down" src="${img_received}">
                     </td>
                     <td>${first_name}</td>
                     <td>${last_name}</td>
                     <td>${middle_name}</td>
                     <td>${email}</td>
                     <td>${contact}</td>
                     <td>${address}</td>
                     <td>${city}</td>
                     <td>${Dob}</td>
                     <td id="options">
                         <button id="edit_btn" class="edit_btn"><i class="fa-solid fa-pen"></i></button>
                         <button id="dlt_btn" class="dlt_btn"><i class="fa-solid fa-trash"></i></button>
                     </td>
                 </tr>`;

             table = table + row;
         }
         else {
             row = `<tr id="${contact}">
                     <td>
                         <div id="${contact}" class="image_down1">${initials}</div>
                     </td>
                     <td>${first_name}</td>
                     <td>${last_name}</td>
                     <td>${middle_name}</td>
                     <td>${email}</td>
                     <td>${contact}</td>
                     <td>${address}</td>
                     <td>${city}</td>
                     <td>${Dob}</td>
                     <td id="options">
                         <button id="edit_btn" class="edit_btn"><i class="fa-solid fa-pen"></i></button>
                         <button id="dlt_btn" class="dlt_btn"><i class="fa-solid fa-trash"></i></button>
                     </td>
                 </tr>`;

             table = table + row;

         }


     }
     const querySnapshot = await getDocs(collection(db, "user"));

     querySnapshot.forEach(create_rows);

     document.getElementById("table").innerHTML = table;

     const editButton = document.getElementsByClassName("edit_btn");
     console.log(editButton);

     for (var i = 0; i < editButton.length; i++) {
         editButton[i].addEventListener("click", function () {
             change_data(this);
         });
     }

     const delButton = document.getElementsByClassName("dlt_btn"); 
     for (var i = 0; i < delButton.length; i++) {
         delButton[i].addEventListener("click", function () {
             delete_data(this);
         });
     }

     const tr = document.getElementsByTagName("tr");
     console.log(tr);

     console.log(tr.length);


     for (var i = 1; i < tr.length; i++) {
         var row_data = tr[i].getElementsByTagName("td");
         for (var j = 0; j < (row_data.length - 1); j++) {
             row_data[j].addEventListener('click', function () {
                 show_card(this);
             })
         }
     }
 }

 document.getElementById("mainscreen").style.display = "none";
 // // document.getElementById("bottom").style.display = "none";
 // document.getElementById("sign_in_form").style.display = "none"

 async function sign_in_user() {
     var sign_in_form = document.getElementById("sign_in_form");
     var email = document.getElementById("sign_email").value;
     var password = document.getElementById("sign_password").value;
     const auth = getAuth(app);

     try {
         const usercredential = await signInWithEmailAndPassword(auth, email, password)
         console.log(usercredential.user)
         onAuthStateChanged(auth, async user => {
             if (user) {
                 sign_in_form.style.display = "none";
                 document.getElementById("mainscreen").style.display = "block";

                 await fetchDataAndPopulateTable()

                 // document.getElementById("bottom").style.display = "flex";


             }
         })
     }
     catch (error) {
         alert("Enter valid email and password")
     }
 }
 // Call the asynchronous function after the window has loaded
 // await fetchDataAndPopulateTable();


 async function show_card(element) {
     document.getElementById("table_details").style.display = "flex";
     
     var document_id = element.parentNode.id;
     const docRef = doc(db, "user", document_id);
     const docSnap = await getDoc(docRef);
     console.log(docSnap);
     var doc_data = docSnap.data();
     console.log(doc_data);
     var img_received = doc_data.imgurl

     if (img_received) {
         document.getElementById("itm_image").innerHTML = `<img src="${img_received}" class="image_received">`;
         document.getElementById("first_name3").value = doc_data.first_name;
         document.getElementById("last_name3").value = doc_data.last_name;
         document.getElementById("middle_name3").value = doc_data.middle_name;
         document.getElementById("email3").value = doc_data.email;
         document.getElementById("contact3").value = doc_data.contact;
         document.getElementById("address3").value = doc_data.address;
         document.getElementById("city3").value = doc_data.city;
         document.getElementById("dob3").value = doc_data.DOB;
         document.getElementById("image_name").innerHTML = doc_data.first_name + " " + doc_data.last_name;
     }
     else {
         document.getElementById("itm_image").innerHTML = doc_data.user_initials
         document.getElementById("first_name3").value = doc_data.first_name;
         document.getElementById("last_name3").value = doc_data.last_name;
         document.getElementById("middle_name3").value = doc_data.middle_name;
         document.getElementById("email3").value = doc_data.email;
         document.getElementById("contact3").value = doc_data.contact;
         document.getElementById("address3").value = doc_data.address;
         document.getElementById("city3").value = doc_data.city;
         document.getElementById("dob3").value = doc_data.DOB;
         document.getElementById("image_name").innerHTML = doc_data.first_name + " " + doc_data.last_name;
     }

 }