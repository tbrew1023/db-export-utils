var admin = require('firebase-admin');
var firestoreService = require('firestore-export-import');
var serviceAccount = require('./serviceAccountKey.json');
var databaseURL = "https://hbrc-18a6e.firebaseio.com";

console.log('initilizing app...');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hbrc-18a6e.firebaseio.com"
});

console.log('exporting...');

firestoreService.backup('users').then((data) => {
    //console.log(JSON.stringify(data, null, 1));

    Object.entries(Object.entries(data)[0][1]).forEach((user) => {
      if(user[1].completed.length != 0) {
        console.log();
        console.log('----------');
        console.log();
        /* grab identity */ console.log(getIdentity(user[1]));
        /* grab average score */ console.log('avg score: ' + getAverageScore(user[1]).toFixed(2) + '%');
        /* grab total time */ console.log('time spent: ' + getTotalTime(user[1]).toFixed(2) + ' minutes');
        /* grab number of modules completed */ console.log('modules completed: ' + getModulesCompleted(user[1]));
        /* grab whether they're finished */ console.log('all modules completed?: ' + isCompleted(user[1]));
      }
    });

    //convert to CSV and save file...

});

// ---------- grabbing identity of user (name / email) ----------

function getIdentity(user) {
  return user.displayName + ' <' + user.email + '>';
}

// ---------- calculating average score ----------

function getAverageScore(user) {
  var sum = 0;

  for(let i = 0; i < user.completed.length; i++) {
    sum+=user.completed[i].score;
  }

  return sum / user.completed.length;
}

// ---------- calculating total time spent ----------

function getTotalTime(user) {
  return (((user.completed[user.completed.length - 1].timestamp - user.completed[0].timestamp) / 1000) / 60);
}

// ---------- grabbing number of modules completed ----------

function getModulesCompleted(user) {
  return user.completed.length;
}

// ---------- is the user completed with all modules? ----------

function isCompleted(user) {
  return user.completed.length == 25;
}