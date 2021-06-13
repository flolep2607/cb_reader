// Copyright (c) 2017 Matthew Brennan Jones <matthew.brennan.jones@gmail.com>
// This software is licensed under AGPL v3 or later
// http://github.com/workhorsy/comic_book_reader
"use strict";


const PRECACHE = 'precache-v9';
const RUNTIME = 'runtime';

const PRECACHE_URLS = [
	'index.html',
	'styles.css',
	'favicon.ico',
	'invalid_image.png',
	'main.js',
	'service_worker.js',
	'js/compatibility.js',
	'js/db.js',
	'js/i18n.js',
	'js/jszip.js',
	'js/languages.js',
	'js/libunrar.js',
	'js/libunrar.js.mem',
	'js/libuntar.js',
	'js/loader.js',
	'js/no_more_jquery.js',
	'js/pdf.js',
	'js/pdf.worker.js',
	'js/pica.js',
	'js/polyfill.js',
	'js/settings.js',
	'js/test_requirements_worker.js',
	'js/uncompress.js',
	'js/utility.js',
	'js/version_date.js',
	'js/web_worker.js',
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(PRECACHE)
		.then(cache => cache.addAll(PRECACHE_URLS))
		.then(self.skipWaiting())
		.then(() => console.log('WORKER: install completed'))
	);
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
	const currentCaches = [PRECACHE, RUNTIME];
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
		}).then(cachesToDelete => {
			return Promise.all(cachesToDelete.map(cacheToDelete => {
				return caches.delete(cacheToDelete);
			}));
		}).then(() => self.clients.claim())
	);
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
	// Skip cross-origin requests, like those for Google Analytics.
	if (event.request.url.startsWith(self.location.origin)) {
		event.respondWith(
			caches.match(event.request).then(cachedResponse => {
				if (cachedResponse) {
					return cachedResponse;
				}

				return caches.open(RUNTIME).then(cache => {
					return fetch(event.request).then(response => {
						// Put a copy of the response in the runtime cache.
						return cache.put(event.request, response.clone()).then(() => {
							return response;
						});
					});
				});
			})
		);
	}
});
