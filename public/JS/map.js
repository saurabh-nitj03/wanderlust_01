


  let maptoken = mapToken;

//   console.log("Mapbox Token:", maptoken);
//   console.log("Coordinates",coordinates);
  
  // Set the Mapbox access token
  mapboxgl.accessToken = maptoken;

  // Initialize the Mapbox map
  const map = new mapboxgl.Map({
      container: 'map', // The ID of the HTML element to render the map
      style: "mapbox://styles/mapbox/streets-v12", // The map style to use

      center: coordinates, // Initial map center [longitude, latitude]
      zoom: 9 // Initial zoom level
  });

  const marker1 = new mapboxgl.Marker({color:'red',draggable: true})
  .setLngLat(coordinates)
  .setPopup(new mapboxgl.Popup({offset: 25})
  .setHTML(`<h4>${loc}</h4><p>Exact Location provided after booking </p>`))
  .addTo(map);


