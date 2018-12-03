<template>

  <div class="main-content">
    <div class="page-header">
      <h3 class="page-title">Room</h3>
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Home</a></li>
        <li class="breadcrumb-item"><a href="#">Room</a></li>
        <li class="breadcrumb-item active">GoogleMap</li>
      </ol>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <div>
          <!-- <button @click="generate">Generate and Bound to Lat Lngs</button> -->
          <gmap-map
            ref="map"
            :center="center"
            :zoom="12"
            style="width:100%; height: 830px;"
          >
            <!-- @click="center=m.position" -->
            <gmap-marker
              :key="index"
              v-for="(m, index) in markers"
              :position="m.latLng"
              :clickable="true"
              :draggable="false"
              :icon="icon"
              @mouseover="toggleInfoWindow(m,index)"
            ></gmap-marker>
            <gmap-info-window
            :options="infoOptions"
            :position="infoWindowPos"
            :opened="infoWinOpen"
            @closeclick="infoWinOpen=false"
            >
              <!-- <div v-html="initialContent"></div> -->
              <div v-html="infoContent"></div>
            </gmap-info-window>
          </gmap-map>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Auth from "../../../services/auth";

export default {
  name: 'RoomGoogleMap',
  data() {
    return {
      // default to Montreal to keep it simple
      // change this to whatever makes sense
      center: { lat: 21.036904, lng: 105.834712 },
      markers: [],
      places: [],
      currentPlace: null,
      rooms: null,
      infoContent: '',
      map: "",
      popup: "",
      Popup: "",
      icon: {
        url:'https://openclipart.org/image/2400px/svg_to_png/177826/color-icons-green-home.png',
        size: {width: 46, height: 46, f: 'px', b: 'px'},
        scaledSize: {width: 27, height: 33, f: 'px', b: 'px'}
      },
      initialContent:
        `<div>
          <p>1.200.000 VNĐ</p>
        </div>`,
      infoWindowPos: {
        lat: 0,
        lng: 0
      },
      infoWinOpen: false,
      currentMidx: null,
      infoOptions: {
        pixelOffset: {
          width: -5,
          height: -40
        }
      },
    };
  },
  watch: {
    markers(markers) {
      if (markers.length > 2) {
        const bounds = new google.maps.LatLngBounds()
        for (let m of markers) {
          bounds.extend(m.latLng)
        }
        this.$refs.map.fitBounds(bounds)
      }
    }
  },
  mounted() {
    Auth.getProfile().then(res => {
      if (res) {
        Auth.canAccess(res, this.permissions).then(response => {
          if (!response) {
            this.$router.push("permission-denied-403");
          } else {
            this.getAllRoom();
          }
        });
      }
    });
    this.geolocate();
  },

  methods: {
    // receives a place object via the autocomplete component
    setPlace(place) {
      this.currentPlace = place;
    },
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    },
    toggleInfoWindow: function (marker, idx) {
      this.infoWindowPos = marker.latLng;
      this.infoContent = this.getInfoWindowContent(marker);


      //check if its the same marker that was selected if yes toggle
      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen;
      }
      //if different marker set infowindow to open and reset current marker index
      else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    },
    getInfoWindowContent: function (marker) {
      return (
        // https://bulma.io/images/placeholders/96x96.png
        `<div class="row" style="margin:0px;">
          <div class="card" style="width:300px;cursor:pointer">
            <img class="card-img-top" src="https://c1.momondo.net/assets/photos/cards/card_hotels_001.jpg?q=60&h=400" alt="Card image cap">
            <ul class="list-group" style="font-weight:500;">
              <li class="list-group-item">Căn hộ: ${marker.name}</li>
              <li class="list-group-item">Địa chỉ: ${marker.description}</li>
              <li class="list-group-item">Giá: ${marker.price} đ</li>
            </ul>
          </div>
        </div>`
      );
    },
    async getAllRoom() {
      try {
        const response = await axios.get(`rooms`, {
          params: {
            include: 'details',
            limit: 50
          }
        });
        this.rooms = response.data.data;
        response.data.data.forEach(room => {
          this.markers.push(
            ({
              name: room.details.data.length ? room.details.data[0].name : '',
              price: room.price_day,
              description: room.details.data.length? room.details.data[0].address :'',
              latLng: {
                lat: parseFloat(room.latitude),
                lng: parseFloat(room.longitude),
              }
            })
          )
        });
      } catch (error) {
        if (error) {
          window.toastr["error"]("There was an error", "Error");
        }
      }
    },
  }
};
</script>
<style>

</style>

