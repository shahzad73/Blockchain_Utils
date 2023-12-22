import async from 'async';


var args = process.argv.slice(2);

// npx ts-node src/others.ts whilst
if(args[0] == "whilst" ) {

  var count = 0;
  async.whilst(
      function testCondition(cb) { cb(null, count < 5); },
      function iteration(callback) {
          count++;
          console.log(count)
          setTimeout(function() {
              callback(null, count);
          }, 1000);
      },
      function endLoop(err, n) {
          console.log("end." + count);
      }
  );

}


// npx ts-node src/others.ts retry
if(args[0] == "retry" ) {

    let count = 0;
    async.retry({ interval: 1000, times: 10 }, function(next) {

        count++;
        console.log(count);

        if(count > 5) {
            console.log("final");
            return next(null, count)
        } else {
            console.log("continue")
            return next(new Error("Some Error"), null);
        }

    }, function(err, result) {
        if(err) {
            console.log("....." + err.toString() + " " + result)            
        } else {
            console.log("final result is" + result)
        }
    });
        
}

// npx ts-node src/others.ts stringToHex
if(args[0] == "stringToHex" ) {


    console.log(paddedHex);
    console.log(paddedBuffer.toString())
}

