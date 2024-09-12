import * as fs from "node:fs";
import superagent from "superagent";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Promissified functions
const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject("Could not find the file"); // pass to catch()
      resolve(data); // pass to then()
    });
  });
};

const writeFilePromise = (file, writeData) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, writeData, (err) => {
      if (err) reject("Could not write the file");
      resolve("Success");
    });
  });
};

const getDogPic = async () => {
  try {
    const data = await readFilePromise(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    await writeFilePromise("dog-img.txt", res.body.message);
    console.log("Random dog image saved to file.");
  } catch (err) {
    console.log(err);

    throw err;
  }
  return "Output is ready!";
};

// Return output from async function
// Create another async function and call it immidiately
(async () => {
  try {
    const x = await getDogPic();
    console.log(x);
  } catch (err) {
    console.log("ERROR");
  }
})();

// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   console.log(`Breed: ${data}`);

//   // http request
//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .end((err, res) => {
//       if (err) return console.log(err.message);
//       console.log(res.body.message);

//       fs.writeFile("dog-img.txt", res.body.message, (err) => {
//         if (err) return console.log(err.message);
//         console.log("Random dog image saved to file.");
//       });
//     });
// });

/*
readFilePromise(`${__dirname}/dog.txt`)
  .then((result) => {
    console.log(`Breed: ${result}`);
    return superagent.get(`https://dog.ceo/api/breed/${result}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);
    return writeFilePromise("dog-img.txt", res.body.message);
  })
  .then(() => {
    console.log("Random dog image saved to file.");
  })
  .catch((err) => {
    console.log(err.message);
  });

  */

// Here we can chain then handlers
// Because first function returns a promise and we can pass it into then handler
// After that the callback function in then handler also returns a promise. So we can pass it again into another then handler
// The result variable in next then handler is the result value of the promise that returns from previous handler
// For all the promisses we only need one catch for handle errors.

// Only the resolved results passing down to the then handler,
// if any of the promise rejected then it will return rejected promise and returns to the catch handler.
