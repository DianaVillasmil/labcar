var map, geocoder, directionsService, directionsDisplay, puntoA, puntoB, marcadorA, marcadorB, origenInput, destinoInput, origenAutocomplete, destinoAutocomplete, tarifa;

function initMap(){

	map = new google.maps.Map(document.getElementById("map"), {
		zoom: 10,
		center: {lat: -33.419027, lng: -70.641678},
		mapTypeControl: false,
		zoomControl: false,
		streetViewControl: false
	});

	geocoder = new google.maps.Geocoder;
	directionsService = new google.maps.DirectionsService,
    directionsDisplay = new google.maps.DirectionsRenderer({
        map: map
    })

	origenInput = document.getElementById("origen");
	destinoInput = document.getElementById("destino");

	origenAutocomplete = new google.maps.places.Autocomplete(origenInput);
    destinoAutocomplete = new google.maps.places.Autocomplete(destinoInput);

    origenAutocomplete.addListener('place_changed', () => {
    	var ubicacion = origenAutocomplete.getPlace();
    	puntoA = new google.maps.LatLng(
    		ubicacion.geometry.location.lat(),
    		ubicacion.geometry.location.lng()
    	);
    	crearMarcadorOrigen(puntoA);
    });

    destinoAutocomplete.addListener('place_changed', () => {
    	var ubicacion = destinoAutocomplete.getPlace();
    	puntoB = new google.maps.LatLng(
    		ubicacion.geometry.location.lat(),
    		ubicacion.geometry.location.lng()
    	);
    	crearMarcadorDestino(puntoB);
    });

    function limpiarMarcador(marcador) {
    	if (marcador) {
    		marcador.setMap(null);
    	}
    }

    function crearMarcador(posicion) {    	
    	return new google.maps.Marker({
			position: posicion,
			animation: google.maps.Animation.DROP,
			map: map
		});
    }	

    function crearMarcadorOrigen(posicion) {
    	limpiarMarcador(marcadorA);
    	marcadorA = crearMarcador(posicion);
    	map.setZoom(17);
		map.setCenter(posicion);
    }

    function crearMarcadorDestino(posicion) {
    	limpiarMarcador(marcadorB);
    	marcadorB = crearMarcador(posicion);
    	map.setZoom(17);
		map.setCenter(posicion);
    }

	function buscar() {
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(buscarExito, buscarError);
		}
	}

	function buscarExito(posicion) {
		puntoA = new google.maps.LatLng(posicion.coords.latitude, posicion.coords.longitude);
		crearMarcadorOrigen(puntoA);

		geocoder.geocode({'location': puntoA}, (resultado, estatus) => {
			if (estatus === 'OK') {
				if (resultado[0]) {
					origenInput.value = resultado[0].formatted_address;
				} else {
					origenInput.value = "Dirección no encontrada";
				}
			} else {
				origenInput.value = "Falla en el geocoder: " + status;
			}
		});

	}

	function buscarError(error) {
		alert("Tenemos un problema con encontrar tu ubicación");
	}

	function calcularRuta(event) {
        event.stopPropagation();
        event.preventDefault();
		if (puntoA && puntoB) {
			directionsService.route({
		        origin: puntoA,
		        destination: puntoB,
		        travelMode: google.maps.TravelMode.DRIVING //WALKING, DRIVING O BICYCLING
		    }, function (response, status) {
		        if (status == google.maps.DirectionsStatus.OK) {
                    console.log(response);
                    tarifa = response.routes[0].legs[0].distance.value * 0.5;
                    document.getElementById('money').innerHTML = "CLP " + tarifa;
		            directionsDisplay.setDirections(response);
		        } else {
		            alert('La solicitud de ruta falló por: ' + status);
		        }
		    });
		} else {
			alert('Es necesario tener Origen y Destino definidos');
		}

        return false;
		
	}

	document.getElementById("ruta").addEventListener("click", calcularRuta);
    document.getElementById("tarifa").addEventListener("click", calcularRuta);

    buscar();

}
	



// function initMap() {
//     var pointA = new google.maps.LatLng(51.7519, -1.2578),
//         pointB = new google.maps.LatLng(50.8429, -0.1313),
//         myOptions = {
//             zoom: 7,
//             center: pointA
//         },
//         map = new google.maps.Map(document.getElementById('map'), myOptions),
//         // Instantiate a directions service.
//         directionsService = new google.maps.DirectionsService,
//         directionsDisplay = new google.maps.DirectionsRenderer({
//             map: map
//         }),
//         markerA = new google.maps.Marker({
//             position: pointA,
//             title: "point A",
//             label: "A",
//             map: map
//         }),
//         markerB = new google.maps.Marker({
//             position: pointB,
//             title: "point B",
//             label: "B",
//             map: map
//         });

//     // get route from A to B
//     calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);
// }

// function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {
//     directionsService.route({
//         origin: pointA,
//         destination: pointB,
//         avoidTolls: true,
//         avoidHighways: false,
//         travelMode: google.maps.TravelMode.DRIVING
//     }, function (response, status) {
//         if (status == google.maps.DirectionsStatus.OK) {
//             directionsDisplay.setDirections(response);
//         } else {
//             window.alert('Directions request failed due to ' + status);
//         }
//     });
// }


