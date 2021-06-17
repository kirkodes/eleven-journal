/* *************************
 *** POST JOURNAL ***
************************** */
function postJournal() {
    const accessToken = localStorage.getItem('SessionToken') // access token is set up to store the SessionToken in local storage
    let title = document.getElementById('title').value;
    let date = document.getElementById('date').value;
    let entry = document.getElementById('entry').value;

    let newEntry = { // this variable stores the info for the body of the request
        journal: {
            title: title,
            date: date,
            entry: entry
        }
    }

    fetch(`http://localhost:3000/journal/create`, { // utilizes the URL we have set up on server side to refer to the journal/create route
        method: "POST", // since ^^ the route uses post, we have to make sure that the method utilized matches
        headers: new Headers({
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}` // accessToken variable stores the SessionToken in localStorage.... on the server side journal/create subroute, we made it a protected route with the use of validateSession. This means a token is required to access this route; this is why we send it over with the other headers
        }),
        body: JSON.stringify(newEntry) // newEntry is turned into a JSON string; then we step into a promise. The response is resolved with.then and the response is then console logged and the displayMine() function is called or the response is rejected and we handle and console log the error
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            displayMine()
        })
        .catch(err => {
            console.error(err)
        })
    }
    
    /* *************************
     *** UPDATE JOURNAL ***
    ************************** */
    function editJournal(postId) {
     console.log(postId);

    const fetch_url = `http://localhost:3000/journal/update/${postId}`;
    const accessToken = localStorage.getItem('SessionToken');

    let card = document.getElementById(postId);
    let input = document.createElement('input');

    if (card.childNodes.length < 2) { // here we're checking to see how many child nodes the card currently has. If it has less than 2 we want to create an additional one which will be an input field used for editing. If it has 2 or more, this means the input field already exists and that we are in "edit mode" so we wouldn't create it again
        card.appendChild(input);
        input.setAttribute("type", "text");
        input.setAttribute("id", "updatedEntry");
        input.setAttribute("placeholder", "Edit your journal entry");
    } else {
        let updated = document.getElementById('updatedEntry').value;
        let newEntry = { // data captured in the variable called updated assign it to property of entry
            journal: {
                entry: updated
            }
        }

        fetch(fetch_url, { // the journal/update/ endpoint with the postId passed in to access a specific journal entry
            method: "PUT",
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }),
            body: JSON.stringify(newEntry)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayMine();
        })
        .catch(err => {
            console.error(err)
        })

        card.removeChild(card.lastChild)

    }
    }
    
    /* *************************
     *** DELETE JOURNAL ***
    ************************** */
    function deleteJournal(postId) {
     console.log(postId);

    const fetch_url = `http://localhost:3000/journal/delete/${postId}`;
    const accessToken = localStorage.getItem('SessionToken');

    fetch(fetch_url, {
        method: "DELETE",
        headers: new Headers({
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        displayMine();
    })
    .catch(err => {
        console.error(err)
    })
    }