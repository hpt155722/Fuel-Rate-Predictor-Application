function prepareData() {
    // Data to be sent to the server
    var data = {
        "Full Name": document.getElementById("name"),
        "Address 1": document.getElementById("address1"),
        "Address 2": document.getElementById("address2"),
        "City": document.getElementById("city"),
        "State": document.getElementById("state"),
        "Zip Code": document.getElementById("zip_code")
    };
    const dataJSON = JSON.stringify(data);
}