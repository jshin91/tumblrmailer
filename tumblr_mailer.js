var fs = require('fs');
var ejs = require('ejs');
var tumblr = require('tumblr.js')

var csvFile = fs.readFileSync("friend_list.csv", "utf8");
var emailTemplate = fs.readFileSync('email_template.ejs', 'utf8');

// Authenticate via OAuth
var tumblr = require('tumblr.js');
var client = tumblr.createClient({
  consumer_key: 'hUoPapv44B335z4nii2S3hZ087MeQaRk3WnqT3CbArkpLgD8Xl',
  consumer_secret: 'VPHpyp1t4peGgj7KzfbH96T7qYksMiCNoFSw4UJqtCmL3QqjHk',
  token: 'y3klKs5rFzWVHWtQAjriPsclbMiamq7em0QtiWm6HKxhlEbYPf',
  token_secret: 'WPJat3A6lzIbrwuJHm3p2o1a7ukeaQnY0JADVL3VEHZK3xJpy4'
});

//function that reads the friend_list.csv file and outputs an array of objects of each contact
function csvParse(fileName) {
  var arrOfItemsInFile = fileName.split("\n");
  var arrOfObjects = [];
  var arrOfKeys = arrOfItemsInFile[0].split(",");

  for(var i = 1; i < arrOfItemsInFile.length; i++) {
    arrOfValues = arrOfItemsInFile[i].split(",");
    currentObj = {};
    for(var j = 0; j < arrOfKeys.length; j++) {
      currentObj[arrOfKeys[j]] = arrOfValues[j];
    } 
    arrOfObjects.push(currentObj);
  }
  return arrOfObjects;  
}

//Make the request to tumblr blog
client.posts('jshin91.tumblr.com', function(err, blog){
  var allPosts = blog.posts;
  var latestPosts = lessThan7Days(allPosts);
  var friendList = csvParse(csvFile);

  function lessThan7Days(posts) {
    var recentPosts = [];
    for(var i = 0; i < posts.length; i++) {
      var currentDate = new Date();
      var postDate = Date.parse(posts[i].date);

      if(currentDate - postDate < 604800000) { //milliseconds in a week
        var recentPostsObj = {};
        recentPostsObj.href = posts[i]['post_url'];
        recentPostsObj.title = posts[i]['title'];
        recentPosts.push(recentPostsObj);
      } 
    }
    return recentPosts;
  }

  for(var i = 0; i < friendList.length; i++) {
    var friendsFirstName = friendList[i].firstName;
    var lastContactWithFriend = friendList[i].numMonthsSinceContact;

    var customizedTemplate = ejs.render(emailTemplate, 
      { firstName: friendsFirstName,  
        numMonthsSinceContact: lastContactWithFriend,
        latestPosts: latestPosts
      });
    console.log(customizedTemplate);
  }
});



// function customizeUsingReplace(arrayOfObjects){

//   for (var i = 0; i < arrayOfObjects.length; i++) {
//     var customizedEmail = emailTemplate;

//     for(var key in arrayOfObjects[i]){
//       customizedEmail = customizedEmail.replace("{{" + key + "}}", arrayOfObjects[i][key]); 
//     };
//     console.log(customizedEmail);   
//   };
// }


// console.log(customizeUsingReplace(csvParse(csvFile)));





/*
This is what the array of objects should look like:
[ { firstName: 'Scott',
    lastName: 'D\'Alessandro',
    numMonthsSinceContact: '0',
    emailAddress: 'scott@fullstackacademy.com' },
  { firstName: 'Jisoo',
    lastName: 'Shin',
    numMonthsSinceContact: '0',
    emailAddress: 'jisooxshin@gmail.com' },
  { firstName: 'Vincent',
    lastName: 'Yang',
    numMonthsSinceContact: '0',
    emailAddress: 'vinceyang92@gmail.com' } ]

*/



