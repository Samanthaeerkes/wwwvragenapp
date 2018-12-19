/*
* Do this when the document is ready
*/
$(document).ready(function () {
    //get JSON from server page function
    $.getJSON("http://leondekraker.nl/vragenapp/clusters-en-opleidingen/", function (data) {
        // empty cluster var to prevent duplicate clusters
        var prevCluster = "";
        //For each json data do this
        $.each(data, function (i, data) {
            if (data.cluster != prevCluster) {
                //add option tags with cluster value
                $('#sel1').append($('<option>').text(data.cluster).attr('cluster', data['cluster']).attr('opleidingClusterId', data['opleidingClusterId']));
                // set prevCluster = cluster to prevent duplicate clusters
                prevCluster = data.cluster;
            }
        });
    });
});

/*
* Onclick start button do this:
*/
$('#startButton').click(function () {
    // variable that gets the selected cluster name
    var selectedEducation = $('#sel2 option:selected').attr('opleiding');
    // variable that gets the id from the selected education
    var selectedEducationId = $('#sel2 option:selected').attr('opleidingId');
    // var with user id from user's device
    var userId = device.uuid;
    // new date object
    var d = new Date();
    // var with dateTime in format: yyyy-mm-dd hh:mm:ss
    var dateTime = (
        d.getFullYear() + "-" +
        ("00" + (d.getMonth() + 1)).slice(-2) + "-" +
        ("00" + d.getDate()).slice(-2) + " " +
        ("00" + d.getHours()).slice(-2) + ":" +
        ("00" + d.getMinutes()).slice(-2) + ":" +
        ("00" + d.getSeconds()).slice(-2)
    );
    // var datastring with data to send to server
    var dataString = "educationId=" + selectedEducationId + "&userId=" + userId + "&user_created=" + dateTime + "&voegGebruikerToe=";
    $.ajax({
        // url to send data to
        url: "http://leondekraker.nl/vragenapp/afhandelpagina/",
        type: 'POST',
        crossDomain: true,
        data: dataString,
        // on succes of the ajax function do this
        success: function () {
            // set locally userIngelogd = "true"
            localStorage.setItem("userIngelogd", "true");
            // set locally which education the user has chosen
            localStorage.setItem("gekozenOpleiding", selectedEducation);
            //
            var beantwoordeVragen = [];
            beantwoordeVragen.push(JSON.parse(localStorage.getItem('beantwoordeVragen')));
            localStorage.setItem('beantwoordeVragen', JSON.stringify(beantwoordeVragen));
            // navigate to overzichtspagina.html
            window.location = "overzichtspagina.html";
        }
    });
});

$('#sel1').on('change', function () {
    // variable with the selected cluster
    var selectedCluster = $('#sel1 option:selected').attr('opleidingClusterId');
    // remove current options
    $('#sel2 option').remove();
    // add hidden option kies opleiding
    $('#sel2').append($('<option hidden>Kies opleiding</option>'));
    // enable select field
    $("#sel2").prop('disabled', false);
    // get clusters and educations
    $.getJSON("http://leondekraker.nl/vragenapp/clusters-en-opleidingen/", function (data) {
        //foreach json data do this
        $.each(data, function (i, data) {
            //if statement to only add educations that belong to the selected cluster
            if (data.opleidingClusterId === selectedCluster) {
                //add option tags with education value
                $('#sel2').append($('<option>').text(data.opleiding).attr('opleiding', data['opleiding']).attr('opleidingId', data['opleidingId']));
            }
        });
    });
})