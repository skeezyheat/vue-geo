<template>
  <div class="map">
    <div class="google-map" id="map"></div>
  </div>
</template>

<script>
import db from '@/firebase/init';
import firebase from 'firebase';
export default {
  name: 'Map',
  data() {
    return {
      lat: 28.538336,
      lng: -81.379234
    };
  },
  methods: {
    renderMap() {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: this.lat, lng: this.lng },
        zoom: 6,
        maxZoom: 15,
        minZoom: 3,
        streetViewControl: false
      });

      db.collection('users')
        .get()
        .then(users => {
          users.docs.forEach(doc => {
            let data = doc.data();
            if (data.geolocation) {
              let marker = new google.maps.Marker({
                position: {
                  lat: data.geolocation.lat,
                  lng: data.geolocation.lng
                },
                map
              });
              // add click event to marker
              marker.addListener('click', () => {
                this.$router.push({ name: 'Profile', params: { id: doc.id } });
              });
            }
          });
        });
    }
  },
  mounted() {
    let user = firebase.auth().currentUser;
    // get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.lat = pos.coords.latitude;
          this.lng = pos.coords.longitude;
          // get user record and update coords
          db.collection('users')
            .where('user_id', '==', user.uid)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                db.collection('users')
                  .doc(doc.id)
                  .update({
                    geolocation: {
                      lat: +this.lat,
                      lng: +this.lng
                    }
                  });
              });
            })
            .then(() => {
              this.renderMap();
            });
        },
        err => {
          console.log(err);
          this.renderMap();
        },
        { maximumAge: 60000, timeout: 10000 }
      );
    } else {
      //render default values
      this.lat = 28.538336;
      this.lng = -81.379234;
      this.renderMap();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.google-map {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
</style>
