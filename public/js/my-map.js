class MyMap {
  constructor(googleMap) {
    this.googleMap = googleMap;
    this.markers = [];
  }

  addMarker(lat, lng) {
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: this.googleMap
    });
    this.markers.push(marker);
  }

  clearMarkers() {
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];
  }

  onClick(cb) {
    this.googleMap.addListener('click', cb);
  }
  
}