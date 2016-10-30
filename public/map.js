var musicians={};
var markers=[];
var locations;
var map;

           
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: new google.maps.LatLng(-10,180),
    //mapTypeId: 'terrain',
    styles: styl
  });
  $.ajax({
    url: '/artists',
    dataType: 'json',
    cache: false,
    success: function(data) {
      for(var i=0; i<data.length; i++){
        var key=data[i].id;
        musicians[key]=data[i];
      }
      $.ajax({
        url: '/location',
        dataType: 'json',
        cache: false,
        success: function(dt) {
          locations=dt;
          load_all_markers(dt);
          fillContent(markers);
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(status, err.toString());
        }.bind(this)
      });
    }.bind(this),
    error: function(xhr, status, err) {
      console.error(status, err.toString());
    }.bind(this)
  });
}

var load_all_markers = function(data){
  for(var i=0; i<data.length;i++){
    addMarker(data[i]);
  }
}

function artist_info(id){
  var img_src=musicians[id].images[0].url;
  var url=musicians[id].external_urls.spotify;
  var name=musicians[id].name;
  var string='<div class="info-content">' +
                '<a href="'+url+'" target="_blank">'+name+'</a>' +
                '<div style="background-image:url(&quot;'+img_src+'&quot;)" class="covers col-sm-12 col-md-12 full-height" >'+
                  '<div class="play_control"><img src="resources/play.png" class="cover col-sm-12 col-md-12 center-block" id="'+id+'" onClick="preview(event)"></div>'+
                    '</div></div>';
  return string;
}



function info_content(artists){
  var contentString = '<div class="info-window">' +
                '<h4>Artists From This Area</h4>';
  for(var i=0; i<artists.length; i++){
    contentString += artist_info(artists[i].id);
  }
  contentString+='</div>';
  return contentString;
}

function addMarker(data){
  var latLng = new google.maps.LatLng(data.latlng[0],data.latlng[1]);
  var icon_src = Math.random()>0.5? "resources/single.png":"resources/double.png";
  var image = {
    url: icon_src,
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 25)
  };
  var marker= new google.maps.Marker({
    position: latLng,
    map:map,
    animation: google.maps.Animation.DROP,
    icon: image
  });
  var infowindow = new google.maps.InfoWindow({
    content:info_content(data.artists),
    maxWidth: 300
  });
  marker.addListener('click', function () {
    infowindow.open(map, marker);
  });
  markers.push({marker:marker, artists: data.artists});
}


function attachListener(artists){
  for(var i=0; i<artists.length; i++){
    var id=artists[i].id+"0";
    console.log($('#' + id));
  }
}

function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].marker.setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

$("#select").on('change',function(){
  deleteMarkers();
  var type=this.value;
  if (type==='all'){
    load_all_markers(locations);
    fillContent(markers);
  }else{
    for(var i=0; i<locations.length; i++){
      var loc = locations[i];
      var artists =[];
      for(var j=0; j<loc.artists.length;j++){
        var artist_id=loc.artists[j].id;
        var genreArr=musicians[artist_id].genres;
        for(var k=0; k<genreArr.length; k++){
          if(genreArr[k]==type){
            artists.push({id:artist_id});
          }
        }
      }
      if(artists.length>0){
        var loca={country:loc.country, latlng: loc.latlng, artists:artists};
        addMarker(loca);
      }
    }
    fillContent(markers);
  }
});






