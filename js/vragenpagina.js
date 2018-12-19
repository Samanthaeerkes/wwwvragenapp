// array variable to check if user has answered a question

//localStorage.clear();

// var a = [];
// a.push(JSON.parse(localStorage.getItem('beantwoordeVragen')));
// localStorage.setItem('beantwoordeVragen', JSON.stringify(a));

//
var txt = "";

/*
* Do this when the document is ready
*/
$(document).ready(function () {
    function getVragen() {
        var url = "http://leondekraker.nl/vragenapp/vragenpagina/";
        $.getJSON(url, function (data) {
            for (var i = 0; i < data.length; i++) {
                // new date object
                var d = new Date();
                // var with dateTime in format: yyyy-mm-dd hh:mm
                var dateTime = (
                    d.getFullYear() + "-" +
                    ("00" + (d.getMonth() + 1)).slice(-2) + "-" +
                    ("00" + d.getDate()).slice(-2) + " " +
                    ("00" + d.getHours()).slice(-2) + ":" +
                    ("00" + d.getMinutes()).slice(-2)
                );
                var slicedDatetime = data[i].verstuurTijd.slice(0, 16);

                if (slicedDatetime == dateTime || slicedDatetime < dateTime) {
                    if (data[i].vraagSoort == 1 && !JSON.parse(localStorage.getItem("beantwoordeVragen")).includes(data[i].vraagId) && localStorage.getItem("gekozenOpleiding") === data[i].opleiding) {
                        txt += "<div class='row'><div id='openvraagDiv' class='form-group'><label class='vragenpaginaTekst col-md-12' id='openVraag' name='" + data[i].vraagId + "'>" + data[i].vraag + "</label>"
                            + "<input required type='text' class='form-control vragenpaginaTekst vraagInput col-md-12' />"
                            + "<input type='image' class='float-right' src='img/BUTTON-Verzenden.png' name='opslaanKnop' id='submitOpenvraag' />"
                            + "</div> </div>";
                    }
                    if (data[i].vraagSoort == 0 && !JSON.parse(localStorage.getItem("beantwoordeVragen")).includes(data[i].vraagId) && localStorage.getItem("gekozenOpleiding") === data[i].opleiding) {
                        txt += " <div id='geslotenvraagDiv'>"
                            + " <div class='row' id='vraagTekst'>"
                            + " <label class='vragenpaginaTekst col-md-12' name='" + data[i].vraagId + "' id='sterVraag'>" + data[i].vraag + " </label>"
                            + " </div>"
                            + " <div class='row sterren'>"
                            + " <div class='sterren'>'"
                            + " <input class='star star-5 form-control' id= 'star-5-vraag" + i + "' type='radio' name='" + data[i].vraagId + "' value='&#9733;&#9733;&#9733;&#9733;&#9733;'/> "
                            + " <label class='star star-5' for='star-5-vraag" + i + "' ></label>"
                            + " <input class='star star-4 form-control' id= 'star-4-vraag" + i + "' type='radio' name='" + data[i].vraagId + "' value='&#9733;&#9733;&#9733;&#9733;'/> "
                            + " <label class='star star-4' for='star-4-vraag" + i + "' ></label>"
                            + " <input class='star star-3 form-control' id= 'star-3-vraag" + i + "' type='radio' name='" + data[i].vraagId + "' value='&#9733;&#9733;&#9733;'/> "
                            + " <label class='star star-3' for='star-3-vraag" + i + "' ></label>"
                            + " <input class='star star-2 form-control' id= 'star-2-vraag" + i + "' type='radio' name='" + data[i].vraagId + "' value='&#9733;&#9733;'/> "
                            + " <label class='star star-2' for='star-2-vraag" + i + "' ></label>"
                            + " <input class='star star-1 form-control' id= 'star-1-vraag" + i + "' type='radio' name='" + data[i].vraagId + "' value='&#9733;'/> "
                            + " <label class='star star-1' for='star-1-vraag" + i + "' ></label>"
                            + " </div>"
                            + " </div>"
                            + " <div id='submitButtonDiv'>"
                            + " <input type='image' src='img/BUTTON-Verzenden.png' name='opslaanKnop' id='submitGeslotenvraag'/>"
                            + " </div>"
                            + " </div>"
                    }
                    document.getElementById("vragen").innerHTML = txt;
                }
            }
            //wanneer txt leeg is, voeg tekst toe in #vragen div
            if (txt === "") {
                txt = "<p id='geenVragenTekst' style='text-align:center; color:white;' class='vragenpaginaTekst'>Er zijn op dit moment geen vragen</p>";
                document.getElementById("vragen").innerHTML = txt;
            }
        })
    }
    getVragen();
    setInterval(getVragen, 60000);
})

/*
* Onclick send open question button do this:
*/
$(document).on('click', "#submitOpenvraag", function () {
    // var answer with answer from user
    var inputtedUserAnswer = $(this).parent().find('.vraagInput').val();
    // var with user id from user's device
    var userId = device.uuid;
    // var with id from answered question
    var vraagId = $(this).closest('div').find('#openVraag').attr('name');
    // var datastring with data to send to server
    var dataString = "userAnswer=" + inputtedUserAnswer + "&userId=" + userId + "&vraagId=" + vraagId + "&voegAntwoordToe=";
    $.ajax({
        // url to send data to
        url: "http://leondekraker.nl/vragenapp/afhandelpagina/",
        type: 'POST',
        crossDomain: true,
        data: dataString,
        // on succes of the ajax function do this
        success: function () {
            alert("Uw antwoord is verzonden!");
            // beantwoordeVragen.push(vraagId);
            var beantwoordeVragen = [];
            // Parse the serialized data back into an aray of objects
            beantwoordeVragen = JSON.parse(localStorage.getItem('beantwoordeVragen'));
            // Push the new data (whether it be an object or anything else) onto the array
            beantwoordeVragen.push(vraagId);
            // Re-serialize the array back into a string and store it in localStorage
            localStorage.setItem('beantwoordeVragen', JSON.stringify(beantwoordeVragen));
            //localStorage.setItem("beantwoordeVragen", JSON.stringify(beantwoordeVragen));
            location.reload();
        }
    });
});
console.log(localStorage.getItem("beantwoordeVragen"));
/*
* Onclick send rating question button do this:
*/
$(document).on('click', "#submitGeslotenvraag", function () {
    // var with user id from user's device
    var userId = device.uuid
    // var with id from answered question
    var vraagId = $(this).parent().parent('div').find('#sterVraag').attr('name');
    // var inputtedUserAnswer with chosen star value from user
    var inputtedUserAnswer = $(this).parent().parent('div').find('.star:checked').attr('value');
    console.log(inputtedUserAnswer);
    // var datastring with data to send to server
    var dataString = "userAnswer=" + inputtedUserAnswer + "&userId=" + userId + "&vraagId=" + vraagId + "&voegAntwoordToe=";
    $.ajax({
        // url to send data to
        url: "http://leondekraker.nl/vragenapp/afhandelpagina/",
        type: 'POST',
        crossDomain: true,
        data: dataString,
        // on succes of the ajax function do this
        success: function () {
            alert("Uw antwoord is verzonden!");
            //
            var beantwoordeVragen = [];
            // Parse the serialized data back into an aray of objects
            beantwoordeVragen = JSON.parse(localStorage.getItem('beantwoordeVragen'));

            // Push the new data (whether it be an object or anything else) onto the array
            beantwoordeVragen.push(vraagId);
            // Re-serialize the array back into a string and store it in localStorage
            localStorage.setItem('beantwoordeVragen', JSON.stringify(beantwoordeVragen));
            location.reload();
        }
    });
});