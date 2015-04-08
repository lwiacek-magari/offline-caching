/**
 * http://jakearchibald.com/2014/offline-cookbook/
 */
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/off/sw.js', {
//     scope: '/off/'
//   }).then(function(reg) {
//     console.log('good', reg);
//   }, function(err) {
//     console.log('error', err);
//   });
// }

/**
 * http://www.html5rocks.com/en/tutorials/service-worker/introduction/
 */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/off/sw.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}



// caching memory size print
// navigator.storageQuota.queryInfo("temporary").then(function(info) {
//   console.log(info.quota);
//   // Result: <quota in bytes>
//   console.log(info.usage);
//   // Result: <used data in bytes>
// });
