const socket  = io();

//check for geolocation support and watch position

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude,longitude} = position.coords;
        socket.emit("send-location",{latitude,longitude});
    },
    (error)=>{
        console.log(error);
    },
    {
        enableHighAccuracy:true,
        timeout:5000,
        maximumAge:0,
    });

}else{
    console.log("Geolocation is not supporting by this browser");
}

//initialize the map
const map = L.map("map").setView([0,0],8);

//Add a tile layer to map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "StreetMap-byShashi"
}).addTo(map);

//Store markers by User ID
const markers ={};

//listen for new location from server
socket.on("receive-location",(date)=>{
    const {id,latitude,longitude} = date;

    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }else{
        markers[id] = L.marker([latitude,longitude]).addTo(map);
    }
});

//Remove markers when user disconnected
socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
