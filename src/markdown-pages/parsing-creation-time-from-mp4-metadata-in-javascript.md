---
path: "/blog/parsing-creation-time-from-mp4-metadata-in-javascript"
date: "2020-04-01"
title: "Parsing creation time of ISO 14496-1 Media Format aka MP4 in javascript"
categories:
  - Code
tags:
  - mp4
  - javascript 
  - optimiziations
  - npm package
---

Q: How to get creation time from mp4 in javascript?

A: You cannot with native javascript code.

A quick google search reveals [https://stackoverflow.com/questions/37046371/obtaining-mp4-creation-time-from-html5-video](https://stackoverflow.com/questions/37046371/obtaining-mp4-creation-time-from-html5-video) . This was the first result given to me from google when I searched the question above. 

I knew this wasn't possible from previous knowledge and also you can look here at the video spec [https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) and you can see it does not parse that type of information from the file when it is loaded. I still searched google to see if there was a good answer. 

### Let us break down the 4 popular answers in the stack overflow link above. 
*Includes the response to use mp4box.js* 

#### 1. Prepare the file on server side using a filename containing the timestamp encoded in the name. Extract the timestamp from the container by the means necessary.

This is possible, do some post processing after a file is uploaded to a server or a storage. There are some drawbacks with this is that you would need to install some software to parse and get this information maybe, ffmpeg with ffprobe. Also what happens if the file is large? Large in this article will be anything over 2GBs. You probably don't want to storage a large file on a web server or download to a microservice. You will end up having to stream the file into whatever backend post processing service you use. That is a lot of work to handle because the file originated in the client side to begin with. 

Overall I would aside against this unless the information isn't needed ASAP or if you have an uploading service that handles the chunked upload to your storage you could parse the stream while it is being uploaded and get it while uploading. This again requires a lot of work if you do not already have it. 

#### 2. Supply meta-file to the mp4 file containing the datestamp which is read separately from client.

I do not quite understand what this means, I don't think we should be splitting up information and have a user say what the creation time of the MP4 is. I maybe misunderstanding this option. This requires more work on the user's end to get the creation date timestamp for an MP4. They have their MP4 so we should be able to get that information from the file automatically. 

#### 3. Load the file via XMLHttpRequest and manually parse the file to find the chunk containing the data. There are some problems with this of course such as risking having to load the entire file into memory.

This is the right solution the only draw back is to if you have to read the entire file to find the metadata. Streaming the file will fix having to load the entire file into memory. This scenario assumes that the user does not have the file locally in the browser already. The method I purpose will work with this one and if the file loads the file from a input file reader too.

### The scenario I had to solve

A user uses a file input file to select any number of MP4 files and they will be uploaded to my file storage. So during this process the user selects a file off their desktop and the file reader will be able to read the file into javascript memory. At this time we can parse the file for the creation date and it can be sent off to the uploader code to be uploaded to whatever server or file storage you have.

Note: This article does not go into how or where you will be uploading a file. It goes into detail on how to parse an .mp4 file on clientside in javascript; do what you want with this. 

### 4. Why I wrote my own code instead of using a library 

*In response to*
>Thanks. I'll go with the 3rd option + the following lib github.com/gpac/mp4box.js to parse the moov. – galbarm May 8 '16 at 8:21

It is quite difficult to find a clientside javacsript library to stream parse an exact metadata value from an mp4 video. I tried using mp4box.js [https://github.com/gpac/mp4box.js/](https://github.com/gpac/mp4box.js/) to do this. The library does parse all the metadata from the mp4 and does a great job of that but the one issue I had is I could not figure out how to stream the file through the application. 

Here is an example
```javascript
var MP4Box = require('mp4box'); 
var mp4boxfile = MP4Box.createFile();
var myDataExcludingTheFirstByte = myFunctionToRetrieveMP4DataWithoutFirstByte();
mp4boxfile.onError = function(e) {};
mp4boxfile.onReady = function(info) {};
mp4boxfile.onMoovStart = function () {
  console.log("Starting to receive File Information");
}
mp4boxfile.appendBuffer(MyDataExcludingTheFirstByte);
```

After reading this code, the `onMoovStart` function will start but the `onReady` will never finish. Also if you reverse this process, if you add `MyDataExcludingTheLastByte` it will not trigger `onReady` either. From this example it means you cannot stream the data into the library to parse stream metadata. It requires you to pass literally the entire mp4 file into the library. What happens if you have a large file? That means you would have to pass an entire 8GB file to get the information. This will take several minutes. This does not solve my streaming case. 

To restate the issue above, you can pass the entire .mp4 file excluding the first byte or the last byte of the file and the parser will not parse the metadata. 

Note: There maybe other libraries that can do this in javascript but it was difficult to find libraries and once you find them you will have to test all the quirks of the library to see if it solves your very specific use case. 

### Enough background, here is a heuristic solution & deterministic solution

You actually get to configure this library to be a linear interpolation between the two solutions.  

I propose a solution has configuration to easily and quickly parse the moov atom from an MP4 to get the creation date.

 MP4 files are composed of a bunch of atoms and each atom has a certain amount of information related to the MP4. The atom we are interested in is the moov atom since it has the metadata of the video. It will tell us the creation time of the mp4 video. The good and bad about mp4 atoms is they can exist anywhere inside the mp4 file format. For web optimized file formats the moov atom is stored at the front of the mp4 file for browsers and video players can parse the video content and stream the data without having to load the entire file into memory. Typically mp4 video encoders will write the moov atom to the back of the file because they can write the mp4 video in one pass when encoding the file format. These two pieces of information are important because we can use these to heuristically parse an mp4 for the moov atom and get the creation date without having to load an entire file.

### Describing the drawbacks, optimizations, parameters of a mp4 parser

**Reiterating the original problem I am trying to solve**

I am trying to specifically solve *retrieving the creation date from a large video.* 

Here are some attributes of the library

- Streams the file in chunk sizes of any size
- Read from the front of the file
- Read from the back of the file
- Read the entire file
- Max bytes read for a fail safe

My points above allow me to control how the parser works. If I assume all the files I am parsing will have moov in the back of the file I can have my parser read only from the back and vice versa. If I knew all videos I was parsing were web optimized I would want to read from the start.

If I have no idea where it would be or just want to already read the entire file you can scan the entire file at the cost of speed. I allow for chunk size reading so you can read in chunks of 1MB, 5MB, or however many MBs of the file you want to read and parse at once. Also you can specify a max bytes read parameter to kill the parser and say *No creation date found* within so many MBs. This is great for fast parsing. 

**Examples**

- You have an 8GB file and you assume the moov atom is at the back of the file. Setup the parser to read 5MB chunks from the back of the file and only read 100MBs of the original files backwards. This means if we read more than 100MBs trying to find the moov atom we will say that no creation date is found. I would be surprised if the moov was more than 100MBs into the file from the back if it was written in the back of the file. I think the original file would have to be massive for the metadata atom to actually be 100MBs in size. I am using this assumption to help solve my problem.

- If you know your files are super small you can just always read the entire file because you will not take the hit of speed since you are not reading many gigabytes.

- If you do not like my heuristic method you can still use the library to efficiently stream, read, and parse a video for the creation date. It will use minimal memory during this process so it can be ran without crashing in the browser on large videos.

### Understanding the file format for MP4 to detect the creation time and how to parse it for the creation date timestamp

Here is a sample snippet of some byte ranges in a sample mp4 file to see the `moov` atom in hex.

```bash
$ xxd mySample.mp4 | less 
$ ...
$ 0100b70: 3fc0 8e00 0000 086d 6461 7400 0010 7d6d  ?......mdat...}m
$ 0100b80: 6f6f 7600 0000 6c6d 7668 6400 0000 007c  oov...lmvhd....|
$ 0100b90: 25b0 80cf f058 3100 0003 e800 0014 c000  %....X1.........
$ 0100ba0: 0100 0001 0000 0000 0000 0000 0000 0000  ................
$ 0100bb0: 0100 0000 0000 0000 0000 0000 0000 0000  ................
$ 0100bc0: 0100 0000 0000 0000 0000 0000 0000 0040  ...............@
$ 0100bd0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
$ 0100be0: 0000 0000 0000 0000 0000 0000 0000 0300  ................
$ ...
```

You can see the `moov` atom in text as well as `mvhd` . The moov atom contains a lot of information about the video file itself. The creation time we want exists inside the `mvhd` tag aka `movie (presentation) header box`

If we look at the file format in the byte layout [http://xhelmboyx.tripod.com/formats/mp4-layout.txt](http://xhelmboyx.tripod.com/formats/mp4-layout.txt)

We get this,

```
* 8+ bytes movie (presentation) header box
        = long unsigned offset + long ASCII text string 'mvhd'
      -> 1 byte version = 8-bit unsigned value
        - if version is 1 then date and duration values are 8 bytes in length
      -> 3 bytes flags =  24-bit hex flags (current = 0)

      -> 4 bytes created mac UTC date
          = long unsigned value in seconds since beginning 1904 to 2040
      -> 4 bytes modified mac UTC date
          = long unsigned value in seconds since beginning 1904 to 2040
      OR
      -> 8 bytes created mac UTC date
          = 64-bit unsigned value in seconds since beginning 1904
      -> 8 bytes modified mac UTC date
          = 64-bit unsigned value in seconds since beginning 1904
```

Boom, we just need to read the 1 byte version number to either read 4 bytes or 8 bytes from the `mvhd` location. 

`mvhd` in hex is `6d 76 68 64`

Let us look back at the file and break it down byte for byte.

```
                          m  v h  d 
                          -- ~~== ##_ <-- version byte
                                      - -- <-- skip these 3, flags not needed
                                          -- -- <-- these 4 bytes for the time.
0100b80: 6f6f 7600 0000 6c6d 7668 6400 0000 007c  oov...lmvhd....|
```

You can see the time for this video is `0000` in long unsigned value in seconds since beginning 1904 to 2040. Meaning this video was created 1904 but that wasn't true so what this means is the video does not have a creation time. It has the default value of 0 seconds. This is how we want to read the bytes of the mp4 to get the creation time.

After we get the seconds we need to convert the Mac HFS+ timestamp in seconds to current Unix timestamp then to current human date time. This website describes the conversion for us [https://www.epochconverter.com/mac](https://www.epochconverter.com/mac)

### Implementation outline

- Read file from desktop through file reader
- Stream the contents of the File
- While stream reading the contents look for `mvhd`
- Once mvhd is found, parse the seconds
- Convert Mac HFS+ seconds → unix seconds → human readable ISO string
- You now have a creation date for a mp4 video in client side javascript

Parameters

- chunk size
- stream from back
- stream from front
- max bytes read

## Let us begin!

We want to read the File/ Blob into an Uint8 array for we have a byte representation of our original file. We don't want to work with a File or Blob data type to do this parsing. We need to read the File/Blob into its bytes. Easiest way of doing this is using a file reader to convert the File into an array buffer and from array buffer into Uint8Array

File or Blob → File reader → Read as arraybuffer → Result → Convert result into Uint8Array

```javascript
/**
 * Converts a file or blob into an unsigned integers of 8 bytes array. 
 * @param {(File | Blob)} file 
 * @return {Uint8Array}
 */
const FileBlobToUint8Array = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(new Uint8Array(reader.result));
    }
    
    reader.onerror = (e) => {
      reject(e);
    }

    reader.readAsArrayBuffer(file);
  });
}
```

Once we have a Uint8Array of the chunk we need to do some conversion to read for `mvhd` because we cannot just search the Uint8Array for the string characters `mvhd`. 

Take a look at the hex values again

```
0100b80: 6f6f 7600 0000 6c6d 7668 6400 0000 007c  oov...lmvhd....|
```

Instead of reading and searching for the hex version of this how about we convert this to char's and do a substring search. 

Given a chunk of bytes you can convert them to char's with javascript's `String.prototype.fromCharCode` function. Since we actually converted the array to Uint8Array we will be converting the Uint8Array values to the char. 

`6d in hex` == `109 in decimal` == `m in char`

If we do this for every decimal value we will get a string version of the chunk. Once we have a string version of the chunk we can do `charString.indexOf('mvhd')` and it will give us the index where the string `mvhd` begins within the chunk (not in terms of the total file, we will have to compute this index later). 

```javascript
/**
  * Convert an array of unsigned integers of 8 bytes into a string of chars.
  * This will convert each decimal value to a char and concat all the chars
  * together to form the string.
  * @param {Uint8Array} byteArray 
  * @param {String} string representation of the original byte array
  */
const uint8ToCharCodeString = (byteArray) => {
  return Array.from(byteArray, (byte) => {
    return String.fromCharCode(byte);
  }).join('')
}
```

The reason I go from hex to decimal to char is that I can easily search the atom's in the mp4 file for the beginning of the atom that I need. Once I know the absolute index of `mvhd` in the original file I can easily read the next few bytes after to get the creation time. 

Here is a snippet to show you what I mean,

```javascript
// Code snippet, full code will be below.
// ...
// within an iteration
const chunk = file.slice(start, end + strLengthEdgeCase); // File 
const uint8Chunk = await FileBlobToUint8Array(chunk); // Uin8Array
const charCodeString = uint8ToCharCodeString(uint8Chunk); // String

indexOfStr = charCodeString.indexOf(str); // str would be 'mvhd'
if (indexOfStr !== -1) {
  // Since we are reading backwards from the end of the file read, compute
  // the global file index of where the str begins
  globalFileIndex = file.size - ((iteration * chunkSize) + (chunkSize - 1 - indexOfStr)) - 1;
  break;
}
```

Here is our logic within a loop.

1. Slice original file into a chunk
2. Convert chunk to Uint8Array chunk
3. Convert the decimal values to char's
4. Search the char string for `mvhd` and retrieve the index within the chunk
5. `GOTO` step 1 if `mvhd` is not found in this chunk else continue to step 6
6. Compute the absolute index within the original file where `mvhd` begins

```javascript
/**
 * Reads a file backwards to find the index of the str you are searching for
 * i.g. you can search for moov, mvhd, etc...
 * @param {(File | Blob)} file 
 * @param {String} str - String contents you are trying to search in the file
 * @param {*} defaultChunkSize 
 * @param {*} maxBytesRead 
 */
const readFileByChunksBackwardsForStringIndex = async (file, str, defaultChunkSize=1000000, maxBytesRead=100000000) =>{
  const chunkSize = file.size < defaultChunkSize ? file.size : defaultChunkSize 
  let iteration = 0;
  let start = null;
  let end = file.size - (chunkSize * iteration);
  let indexOfStr = null;
  let globalFileIndex = null;
  let strLengthEdgeCase = str.length - 1;

  // read backwards
  while (end > 0 && (iteration * chunkSize) < maxBytesRead) {
    start = file.size - (chunkSize * (iteration + 1)); 
    start = start < 0 ? 0 : start;
    end = file.size - (chunkSize * iteration);

    // since we are reading by a random chunk size we have a few edge conditions to worry about
    // chunk bounds
    const chunk = file.slice(start, end + strLengthEdgeCase);
    const uint8Chunk = await FileBlobToUint8Array(chunk);
    const charCodeString = uint8ToCharCodeString(uint8Chunk);

    indexOfStr = charCodeString.indexOf(str);
    if (indexOfStr !== -1) {
      // Since we are reading backwards from the end of the file read, compute
      // the global file index of where the str begins
      globalFileIndex = file.size - ((iteration * chunkSize) + (chunkSize - 1 - indexOfStr)) - 1;
      break;
    }

    iteration++;
  }
  return globalFileIndex;
}
```

Once we have the index we can go to the global position in the original file to help us parse the data. If scroll back up to the mp4 byte definition after the `mvhd` you can see we need to parse the version for `0` or `1` to read 4 or 8 bytes for the creation time.

```javascript
/**
 * Retrieves the creation time of the mp4 video
 * @param {(File | Blob)} file 
 * @return {(String | null)} a date time iso string of the creation time or null
 */
const getCreationTime = async (file) => {
  const globalFileIndex = await readFileByChunksBackwardsForStringIndex(file, 'mvhd');
  if (!globalFileIndex) return null;

  // global file index points the start of m in mvhd, lets move it 4 bytes past this str name
  // now it will point at the version
  const parsingIndex = globalFileIndex + 4;
  
  // move it 12 bytes ahead to parse either version of the creation time
  // 4 for version + flags
  // 8 for the creation time
  // 12 in total
  const fileChunk = file.slice(parsingIndex, globalFileIndex + 12);
  const uInt8Chunk = await FileBlobToUint8Array(fileChunk);
  const creationTime = parseBytesAfterMvhd(uInt8Chunk);

  return creationTime;
}
```

To read the creation time it is quite simple, you just read and convert the bytes after the you know the location of `mvhd`

```javascript
/**
 * Reads the bytes after the mvhd str to parse the creation date only. 
 * 
 * 8+ bytes movie (presentation) header box
 *    = long unsigned offset + long ASCII text string 'mvhd'
 *  -> 1 byte version = 8-bit unsigned value
 *    - if version is 1 then date and duration values are 8 bytes in length
 *  -> 3 bytes flags =  24-bit hex flags (current = 0)
 *
 *  -> 4 bytes created mac UTC date
 *      = long unsigned value in seconds since beginning 1904 to 2040
 *  -> 4 bytes modified mac UTC date
 *      = long unsigned value in seconds since beginning 1904 to 2040
 *  OR
 *  -> 8 bytes created mac UTC date
 *      = 64-bit unsigned value in seconds since beginning 1904
 *  -> 8 bytes modified mac UTC date
 *      = 64-bit unsigned value in seconds since beginning 1904
 * @param {Uint8Array} uInt8Chunk 
 * @return {(String | null)} ISO Datetime string or null if no creation date
 * was found 
 */
const parseBytesAfterMvhd = (uInt8Chunk) => {
  const version = toDecimalFromHexString(toHexString([uInt8Chunk[0]]));
  let seconds = null;
  if (version === 0) {
    // read the 4 byte creation time
    const start = 4; // 1 byte for version, 3 bytes of flags
    const end = start + 4; // offset from the start for the 4 bytes of creation time
    const createdBytes = uInt8Chunk.slice(start, end);
    seconds = toDecimalFromHexString(toHexString(createdBytes));
  } else if (version === 1) {
    // read the 8 creation time
    const start = 4; // 1 byte for version, 3 bytes of flags
    const end = start + 8; // offset from the start for the 8 bytes of creation time
    const createdBytes = uInt8Chunk.slice(start, end);
    seconds = toDecimalFromHexString(toHexString(createdBytes));
  }

  return seconds === null ? null : macHFSPlusToISOString(seconds);
}
```

Once we parse the seconds we can convert it from Mac HFS+ to date time ISO string. 

And that is it, we got the creation time of a mp4 in the frontend via slicing & streaming the file through a file reader, converter & parser. I am not going to talk about implementing more of the other features like searching from front of the file or setting up more configuration. This is enough of a staring point for people and to get my point across. The code will work as is.

I will be updating the code with new features and configuration settings within this github repo [https://github.com/nadr0/mp4-metadata](https://github.com/nadr0/mp4-metadata). You can find it on NPM as well [https://www.npmjs.com/package/mp4-metadata](https://www.npmjs.com/package/mp4-metadata)  

Here is all the code together,

```javascript
// entry is
await getCreationTime(file);
```

```javascript
/**
 * Converts a file or blob into an unsigned integers of 8 bytes array. 
 * @param {(File | Blob)} file 
 * @return {Uint8Array}
 */
const FileBlobToUint8Array = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(new Uint8Array(reader.result));
    }
    
    reader.onerror = (e) => {
      reject(e);
    }

    reader.readAsArrayBuffer(file);
  });
}

/**
 * seconds in Mac HFS+ to be converted into a date time iso string
 * @param {Number} seconds - Mac HFS+ seconds
 * @return {String} date time iso string
 */
const macHFSPlusToISOString = (seconds) => {
  // offset seconds and multipled by 1000 to use seconds in javascript date.
  return new Date((seconds - 2082844800) * 1000).toISOString();
}

/**
 * Convert an array of bytes into a hex string
 * @param {Uint8Array} byteArray 
 * @param {String} hex version of the original byte array
 */
const toHexString = (byteArray) => {
  return Array.from(byteArray, (byte) => {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

/**
 * Converts a string of hex values into its decimal representation
 * @param {String} hexString 
 * @param {Number} decimal version of the hex string
 */
const toDecimalFromHexString = (hexString) => {
  return parseInt(hexString, 16);
}

/**
 * Convert an array of unsigned integers of 8 bytes into a string of chars.
 * This will convert each decimal value to a char and concat all the chars
 * together to form the string.
 * @param {Uint8Array} byteArray 
 * @param {String} string representation of the original byte array
 */
const uint8ToCharCodeString = (byteArray) => {
  return Array.from(byteArray, (byte) => {
    return String.fromCharCode(byte);
  }).join('')
}


/**
 * Reads the bytes after the mvhd str to parse the creation date only. 
 * 
 * 8+ bytes movie (presentation) header box
 *    = long unsigned offset + long ASCII text string 'mvhd'
 *  -> 1 byte version = 8-bit unsigned value
 *    - if version is 1 then date and duration values are 8 bytes in length
 *  -> 3 bytes flags =  24-bit hex flags (current = 0)
 *
 *  -> 4 bytes created mac UTC date
 *      = long unsigned value in seconds since beginning 1904 to 2040
 *  -> 4 bytes modified mac UTC date
 *      = long unsigned value in seconds since beginning 1904 to 2040
 *  OR
 *  -> 8 bytes created mac UTC date
 *      = 64-bit unsigned value in seconds since beginning 1904
 *  -> 8 bytes modified mac UTC date
 *      = 64-bit unsigned value in seconds since beginning 1904
 * @param {Uint8Array} uInt8Chunk 
 * @return {(String | null)} ISO Datetime string or null if no creation date
 * was found 
 */
const parseBytesAfterMvhd = (uInt8Chunk) => {
  const version = toDecimalFromHexString(toHexString([uInt8Chunk[0]]));
  let seconds = null;
  if (version === 0) {
    // read the 4 byte creation time
    const start = 4; // 1 byte for version, 3 bytes of flags
    const end = start + 4; // offset from the start for the 4 bytes of creation time
    const createdBytes = uInt8Chunk.slice(start, end);
    seconds = toDecimalFromHexString(toHexString(createdBytes));
  } else if (version === 1) {
    // read the 8 creation time
    const start = 4; // 1 byte for version, 3 bytes of flags
    const end = start + 8; // offset from the start for the 8 bytes of creation time
    const createdBytes = uInt8Chunk.slice(start, end);
    seconds = toDecimalFromHexString(toHexString(createdBytes));
  }

  return seconds === null ? null : macHFSPlusToISOString(seconds);
}

/**
 * Reads a file backwards to find the index of the str you are searching for
 * i.g. you can search for moov, mvhd, etc...
 * @param {(File | Blob)} file 
 * @param {String} str - String contents you are trying to search in the file
 * @param {*} defaultChunkSize 
 * @param {*} maxBytesRead 
 */
const readFileByChunksBackwardsForStringIndex = async (file, str, defaultChunkSize=1000000, maxBytesRead=100000000) =>{
  const chunkSize = file.size < defaultChunkSize ? file.size : defaultChunkSize 
  let iteration = 0;
  let start = null;
  let end = file.size - (chunkSize * iteration);
  let indexOfStr = null;
  let globalFileIndex = null;
  let strLengthEdgeCase = str.length - 1;

  // read backwards
  while (end > 0 && (iteration * chunkSize) < maxBytesRead) {
    start = file.size - (chunkSize * (iteration + 1)); 
    start = start < 0 ? 0 : start;
    end = file.size - (chunkSize * iteration);

    // since we are reading by a random chunk size we have a few edge conditions to worry about
    // chunk bounds
    const chunk = file.slice(start, end + strLengthEdgeCase);
    const uint8Chunk = await FileBlobToUint8Array(chunk);
    const charCodeString = uint8ToCharCodeString(uint8Chunk);

    indexOfStr = charCodeString.indexOf(str);
    if (indexOfStr !== -1) {
      // Since we are reading backwards from the end of the file read, compute
      // the global file index of where the str begins
      globalFileIndex = file.size - ((iteration * chunkSize) + (chunkSize - 1 - indexOfStr)) - 1;
      break;
    }

    iteration++;
  }
  return globalFileIndex;
}

/**
 * Retrieves the creation time of the mp4 video
 * @param {(File | Blob)} file 
 * @return {(String | null)} a date time iso string of the creation time or null
 */
const getCreationTime = async (file) => {
  const globalFileIndex = await readFileByChunksBackwardsForStringIndex(file, 'mvhd');
  if (!globalFileIndex) return null;

  // global file index points the start of m in mvhd, lets move it 4 bytes past this str name
  // now it will point at the version
  const parsingIndex = globalFileIndex + 4;
  
  // move it 12 bytes ahead to parse either version of the creation time
  // 4 for version + flags
  // 8 for the creation time
  // 12 in total
  const fileChunk = file.slice(parsingIndex, globalFileIndex + 12);
  const uInt8Chunk = await FileBlobToUint8Array(fileChunk);
  const creationTime = parseBytesAfterMvhd(uInt8Chunk);

  return creationTime;
}
```