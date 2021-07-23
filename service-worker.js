const CACHE_NAME = 'PWA-Cache_V1';
//Ressourcen, die wir später benötigen
const RESOURCES_TO_PRELOAD = [
	'./index.html',
	'./NotFound.html',
	'./register-worker.js',
	'./manifest.json',
	'./favicon.ico',
	'./Component-preload.js',
	'./i18n/i18n_de_DE.properties',
	'./i18n/i18n_de.properties',
	'./i18n/i18n_en.properties',
	'./i18n/i18n.properties',
	'./icons/favicon.ico',
	'./icons/favicon.png',
	'./icons/favicon.svg',
	'./icons/msq-logo.png'
];


//ServiceWorker installieren & Ressourcen cachen:
self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
			console.log('Ressourcen werden gecached');
			return cache.addAll(RESOURCES_TO_PRELOAD);
			// Wenn Ressource/n nicht gecached werden können,
			// Fehlermeldung ausgeben:
		}).catch(function (error) {
			console.error(error);
		})
	);
});



//ServiceWorker aktivieren:
//Wenn neuer ServiceWorker aktiviert wird, Cachedaten des alten löschen:
self.addEventListener('activate', function (event) {
	event.waitUntil(
		//console.log('ServiceWorker wurde aktiviert');
		caches.keys().then(keys => {
			//Cache nach veralteten Cache-daten durchsuchen und 
			//veralteter Cache löschen:	
			return Promise.all(keys
				.filter(key => key !== CACHE_NAME)
				.map(key => caches.delete(key))
			)
		})
	);
});


// Daten aus Cache der Anwendung bereitstellen
// GET-Requests sollen aus dem Cache, nicht vom Server bereitgestellt werden.
self.addEventListener('fetch', function (event) {
	//Nur GET-Requests aus Cache laden:
	if (event.request.method === 'GET') {
		//prüfen, ob Cache Daten enthält, die angefordert werden
		event.respondWith(
			caches.match(event.request).then(function (response) {
				if (response) {

					return response; //Daten sind im Cache vorhanden	
				}

				let requestCopy = event.request.clone();
				return fetch(requestCopy).then(function (response) {
					// Verhindern von CORE-Errors
					if (response.type === 'opaque') {
						return response;
						// wenn Request valide => response.status == 2xx ? true : false;
					} else if (!response.ok) {
						console.error(response.statusText);
					} else {
						return caches.open(CACHE_NAME).then(function (cache) {
							cache.put(event.request, response.clone());

							return response;

							//Falls Response nicht gecached werden kann:
						})
							.catch(function (error) {
								return error;
							});
					}
				}).catch(function (error) {
					//Fetch fehlerhaft, wenn Server nicht erreicht wird.
					//Entweder Client oder Server offline.
					//Ist Google Best Practice, alternative "Offline Fallback Page" anzuzeigen.
					console.error(error);
					console.log('jetzt sollte eine 404 Seite angezeigt wreden.');
					return caches.match('./NotFound.html');

				});
			})
		);
	}
});

