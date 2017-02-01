var sectDeatils = document.getElementById('detailSection');
var containerDetails = document.getElementById('detailContainer');
var jumbo = document.getElementById('jumbo');
var spinner = document.getElementById('spinner');
function initialize() {
       var address = (document.getElementById('location'));
       var autocomplete = new google.maps.places.Autocomplete(address);
       autocomplete.setTypes(['geocode']);
       google.maps.event.addListener(autocomplete, 'place_changed', function() {
           var place = autocomplete.getPlace();
           if (!place.geometry) {
               return;
           }

       var address = '';
       if (place.address_components) {
           address = [
               (place.address_components[0] && place.address_components[0].short_name || ''),
               (place.address_components[1] && place.address_components[1].short_name || ''),
               (place.address_components[2] && place.address_components[2].short_name || '')
               ].join(' ');
       }
     });
}

document.getElementById("searchLocation").addEventListener("click", function(event){
      event.preventDefault();
      gettingData();
});

document.getElementById("location").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        gettingData();
    }
});



function gettingData(){
  var checkCont = document.getElementById('detailSection');
  if (checkCont.firstChild) {
    while(checkCont.firstChild){
      checkCont.removeChild(checkCont.firstChild);
    }
  }
  getGeoLoc(getRestaurants);
  containerDetails.style.display = "block";
  //e.preventDefault();
}



function getGeoLoc(callBack){
  console.log("pressed ");
  geocoder = new google.maps.Geocoder();
  var address = document.getElementById("location").value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {

            //console.log("Latitude: "+results[0].geometry.location.lat());
            //console.log("Longitude: "+results[0].geometry.location.lng());
            var lati = results[0].geometry.location.lat();
            var longi = results[0].geometry.location.lng();
            //getRestaurants(lati, longi);
            map = new google.maps.Map(document.getElementById('dvMap'), {
              center: {lat: lati, lng: longi},
              zoom: 15
            });
            callBack(lati, longi);
            jumbo.style.paddingTop = "40px";

    } else {
      console.log("Geocode was not successful for the following reason: " + status);
      containerDetails.style.display = "hide";

    }
  });

}

google.maps.event.addDomListener(window, 'load', initialize);



function getRestaurants(lati, longi){

  //console.log("latitude :"+lati);
  //console.log("longitude :"+longi);
  var xhr = new XMLHttpRequest();
  spinner.style.display = "block";
  xhr.open("GET", "https://developers.zomato.com/api/v2.1/search?entity_type=city&lat="+lati+"&lon="+longi+"&radius=1000&sort=rating&order=desc");
  xhr.setRequestHeader("user-key", "9ef8ef389ebb397a81ba236d1fd2d37a");
  xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
              spinner.style.display = "none";
              if (xhr.status == 200) {
                  var data = JSON.parse(xhr.response);
                  var newData = data.restaurants;

                  //console.log(data.restaurants);

                  for(var i in newData){
                      //console.log(newData[i].restaurant.featured_image);

                      var restLat = newData[i].restaurant.location.latitude;
                      var restLong = newData[i].restaurant.location.longitude;

                      marker = new google.maps.Marker({
                          position: new google.maps.LatLng(restLat, restLong), map: map, title: newData[i].restaurant.name, draggable: true,
                      });

                      var outerRest = document.createElement('div');
                      var upperDiv = document.createElement('div');
                      var lowerDiv = document.createElement('div');
                      var imgPart = document.createElement('div');
                      var imgSec = document.createElement('img');
                      var restDetails = document.createElement('div');
                      var restName = document.createElement('h3');
                      var restAddress = document.createElement('p');
                      var restCuisine = document.createElement('p');
                      var restRating = document.createElement('p');
                      var priceR = document.createElement('p');
                      var spanBold = document.createElement('span');
                      var bookSec = document.createElement('div');
                      var bookBtn = document.createElement('a');
                      var eventBtn = document.createElement('a');


                      outerRest.className = "outerRest col-md-12";
                      upperDiv.className = "upperDivInline";
                      lowerDiv.className = "lowerDivFlex";
                      imgPart.className = "imgPart cold-md-2";
                      restDetails.className = "restaurant-details col-md-10";
                      restName.className = "nameRest";
                      restAddress.className = "addressRest";
                      restCuisine.className = "cuisine";
                      restRating.className = "rating";
                      priceR.className = "priceRange";
                      bookSec.className ="booking-section";
                      bookBtn.className = "bookingBtn";
                      eventBtn.className = "eventBtn";

                      imgSec.src = newData[i].restaurant.featured_image;
                      restName.innerHTML = newData[i].restaurant.name;
                      restAddress.innerHTML = newData[i].restaurant.location.address;
                      priceR.innerHTML = "<strong>Price for two</strong> :&nbsp;Rs."+newData[i].restaurant.average_cost_for_two;
                      restCuisine.innerHTML = "<strong>Cuisine :</strong>&nbsp;"+newData[i].restaurant.cuisines;
                      restRating.innerHTML = "<strong>Rating : </strong>&nbsp;"+newData[i].restaurant.user_rating.aggregate_rating+"&nbsp;<i class='fa fa-star' aria-hidden='true'></i>";
                      bookBtn.innerHTML = "<strong>Book</strong>";
                     // bookBtn.href = newData[i].restaurant.book_url;
                      eventBtn.innerHTML = "<strong>Event</strong>";

                      var bookingEvent = newData[i].restaurant.book_url;


                      

                      //console.log('booking ',newData[i].restaurant.book_url);

                      imgPart.appendChild(imgSec);
                      upperDiv.appendChild(imgPart);

                      restDetails.appendChild(restName);
                      restDetails.appendChild(restAddress);
                      restDetails.appendChild(priceR);
                      restDetails.appendChild(restCuisine);
                      restDetails.appendChild(restRating);

                      if (typeof(bookingEvent) != 'undefined') {
                          bookBtn.href = newData[i].restaurant.book_url;
                          bookSec.appendChild(bookBtn);
                      }

                      
                      bookSec.appendChild(eventBtn);
                      lowerDiv.appendChild(bookSec);

                      upperDiv.appendChild(restDetails);
                      outerRest.appendChild(upperDiv);
                      outerRest.appendChild(lowerDiv);
                      sectDeatils.appendChild(outerRest);


                  }
              }
          }
      };

  xhr.send(null);
}
