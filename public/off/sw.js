if (!Cache.prototype.add) {
  Cache.prototype.add = function add(request) {
    return this.addAll([request]);
  };
}

if (!Cache.prototype.addAll) {
  Cache.prototype.addAll = function addAll(requests) {
    var cache = this;

    // Since DOMExceptions are not constructable:
    function NetworkError(message) {
      this.name = 'NetworkError';
      this.code = 19;
      this.message = message;
    }
    NetworkError.prototype = Object.create(Error.prototype);

    return Promise.resolve().then(function() {
      if (arguments.length < 1) throw new TypeError();

      // Simulate sequence<(Request or USVString)> binding:
      var sequence = [];

      requests = requests.map(function(request) {
        if (request instanceof Request) {
          return request;
        }
        else {
          return String(request); // may throw TypeError
        }
      });

      return Promise.all(
        requests.map(function(request) {
          if (typeof request === 'string') {
            request = new Request(request);
          }

          var scheme = new URL(request.url).protocol;

          if (scheme !== 'http:' && scheme !== 'https:') {
            throw new NetworkError("Invalid scheme");
          }

          return fetch(request.clone());
        })
      );
    }).then(function(responses) {
      // TODO: check that requests don't overwrite one another
      // (don't think this is possible to polyfill due to opaque responses)
      return Promise.all(
        responses.map(function(response, i) {
          return cache.put(requests[i], response);
        })
      );
    }).then(function() {
      return undefined;
    });
  };
}

if (!CacheStorage.prototype.match) {
  // This is probably vulnerable to race conditions (removing caches etc)
  CacheStorage.prototype.match = function match(request, opts) {
    var caches = this;

    return this.keys().then(function(cacheNames) {
      var match;

      return cacheNames.reduce(function(chain, cacheName) {
        return chain.then(function() {
          return match || caches.open(cacheName).then(function(cache) {
            return cache.match(request, opts);
          }).then(function(response) {
            match = response;
            return match;
          });
        });
      }, Promise.resolve());
    });
  };
}




// var CACHE_VERSION = 1;

// // Shorthand identifier mapped to specific versioned cache.
// var CURRENT_CACHES = {
//   font: 'font-cache-v' + CACHE_VERSION
// };



// self.addEventListener('activate', function(event) {
//   var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
//     return CURRENT_CACHES[key];
//   });

//   // Active worker won't be treated as activated until promise resolves successfully.
//   event.waitUntil(
//     caches.keys().then(function(cacheNames) {
//       return Promise.all(
//         cacheNames.map(function(cacheName) {
//           if (expectedCacheNames.indexOf(cacheName) == -1) {
//             console.log('Deleting out of date cache:', cacheName);

//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });

// self.addEventListener('fetch', function(event) {
//   console.log('Handling fetch event for', event.request.url);

//   event.respondWith(

//     // Opens Cache objects that start with 'font'.
//     caches.open(CURRENT_CACHES['font']).then(function(cache) {
//       return cache.match(event.request).then(function(response) {
//         if (response) {
//           console.log(' Found response in cache:', response);

//           return response;
//         }
//       }).catch(function(error) {

//         // Handles exceptions that arise from match() or fetch().
//         console.error('  Error in fetch handler:', error);

//         throw error;
//       });
//     })
//   );
// });






this.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('myasdfsiasaaaadfte-static-v18ddddddddasdfd').then(function(cache) {

      return cache.put('/off/', new Response('From the cache!..'));
      // return cache.addAll(
      //   '/off/'
      // ).then(function() {
      //   new Response('From the cache!!!'));
      // });
    });
  );
});

this.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || new Response("Nothing in the cache for this request");
    })
  );
});


// this.addEventListener('activate', function(event) {
//   event.waitUntil(
//     caches.keys().then(function(cacheNames) {
//       return Promise.all(
//         cacheNames.filter(function(cacheName) {
//           // Return true if you want to remove this cache,
//           // but remember that caches are shared across
//           // the whole origin
//         }).map(function(cacheName) {
//           return caches.delete(cacheName);
//         })
//       );
//     })
//   );
// });




// this.addEventListener('install', function(event) {
//   event.waitUntil(
//     caches.open('v3').then(function(cache) {
//       return cache.addAll(
//         '/off',
//         '/off/index.html',
//         '/off/styles/main.css'
//       );
//     })
//   );
// });


// this.addEventListener('fetch', function(event) {
//   var response;
//   var cachedResponse = caches.match(event.request).catch(function() {
//     return fetch(event.request);
//   }).then(function(r) {
//     response = r;
//     caches.open('v3').then(function(cache) {
//       cache.put(event.request, response);
//     });
//     return response.clone();
//   });
// });




// var caches = require('scripts/caches');

// self.oninstall = function(event) {
//   event.waitUntil(
//     caches.open('of-static-v1').then(function(cache) {
//       return cache.addAll([
//         '/',
//         '/styles/main.css'
//       ]);
//     })
//   );
// };

// self.addEventListener('activate', function(event) {
//   event.waitUntil(
//     caches.keys().then(function(cacheNames) {
//       return Promise.all(
//         cacheNames.filter(function(cacheName) {
//           // Return true if you want to remove this cache,
//           // but remember that caches are shared across
//           // the whole origin
//         }).map(function(cacheName) {
//           return caches.delete(cacheName);
//         })
//       );
//     })
//   );
// });
