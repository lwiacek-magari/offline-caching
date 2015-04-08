if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/off/sw.js', {
    scope: '/off/'
  }).then(function(reg) {
    console.log('good', reg);
  }, function(err) {
    console.log('error', err);
  });
}

// navigator.storageQuota.queryInfo("temporary").then(function(info) {
//   console.log(info.quota);
//   // Result: <quota in bytes>
//   console.log(info.usage);
//   // Result: <used data in bytes>
// });
