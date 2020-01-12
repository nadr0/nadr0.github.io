---
path: "/blog/parsing-pdfs-in-javascript"
date: "2020-01-12"
title: "Parsing PDFs in Javascript with PDF.js"
categories:
  - Code
tags:
  - pdf.js
  - javascript
  - file processing
  - memory leak
  - async/await
---

I needed to split a pdf into its pages, show previews and upload them to a storage. Here is a guide on how to do this step by step. I also provide all my source code in one HTML file at the end if you want to skip to that.

## Reading a PDF

Say you have a file from an input file field, convert it to an array buffer for it can be read in with [pdf.js](https://mozilla.github.io/pdf.js/). After you read the file you will have a pdf document provide by the library. 

- Read the file into memory

```html
<input id="file-upload" type="file"/>
```

```javascript
const fileInput = document.getElementById("file-upload");
fileInput.addEventListener('change', async (event) => {
  // File data
  const file = fileInput.files[0];
});
```

- Convert File into array buffer

```javascript
const readFileToArrayBuffer = async (fileData) => {
  return new Promise( (resolve, reject) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileData);
    reader.onload = () => {
      const result = reader.result
      // Convert to array buffer
      const bytes = new Uint8Array(result);
      resolve(bytes);
    };
  });
}
```

- Read array buffer to pdf document

```javascript
fileInput.addEventListener('change', async (event) => {
  const file = fileInput.files[0];
  const bytes = await readFileToArrayBuffer(file);
  // We have a PDf document now
  const pdfDocument = await pdfjsLib.getDocument(bytes).promise;
});
```

## Splitting into pages

The PDF document class has an API to get a page by a specific page number. We first should figure out the total page count then devise a for loop to get each page. 

- Total page numbers in the PDF

```javascript
const pdfDocument = await pdfjsLib.getDocument(bytes).promise;
const numPages = pdfDocument.numPages;
```

- Read each page of the PDF by page number

```javascript
// Fetching pages starts at 1
for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
  const page = await pdfDocument.getPage(pageNumber);
}
```

## Generating images from a pdf page

In the client side we want to be able to show previews of each page at different resolutions. We can do this by rendering the page into a canvas element and saving it into a blob or data url. 

A pdf uses vector method to render the content, when we want to save an image we will have to rasterize the pdf at a specifc resolution. 

Types of images we will generate.

- 64x64 icon
- 256x256 thumbnail
- 8k high resolution

We will be preserving aspect ratio so it won't exactly be a square, just at most the value in one dimension. 

- Get a page

```javascript
// Fetching pages starts at 1
for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
  const page = await pdfDocument.getPage(pageNumber);
}
```

- Compute the aspect ratio of the image with the desired resolution to scale the canvas and PDF

```javascript
const viewport = page.getViewport({scale: 1});
const scale = Math.min(desiredResolution/ viewport.width,
  desiredResolution / viewport.height);

// Prepare canvas using PDF page dimensions
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
canvas.height = viewport.height * scale;
canvas.width = viewport.width * scale;

// Render PDF page into canvas context
const scaledViewport = page.getViewport({scale});
const renderContext = {
  canvasContext: context,
  viewport: scaledViewport
};
```

- A function to take a page and render it to a canvas with a desired resolution

```javascript
const pageToCanvas = async (page, desiredResolution) => {
  const viewport = page.getViewport({scale: 1});
  const scale = Math.min(desiredResolution/ viewport.width, desiredResolution / viewport.height);

  // Prepare canvas using PDF page dimensions
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.height = viewport.height * scale;
  canvas.width = viewport.width * scale;

  // Render PDF page into canvas context
  const scaledViewport = page.getViewport({scale});
  const renderContext = {
    canvasContext: context,
    viewport: scaledViewport
  };
  await page.render(renderContext).promise;
  return canvas;
};
```

- Use the helper function above to give you a data url or blob of the canvas

```javascript
const generateImageToDataURL = async (page, desiredResolution) => {
  const canvas = await pageToCanvas(page, desiredResolution);
  return canvas.toDataURL();
};

const generateImageToBlob = async (page, desiredResolution) => {
  const canvas = await pageToCanvas(page, desiredResolution);
  return await new Promise(resolve => canvas.generateImageToBlob(resolve));
};
```

Since we have a canvas we can either get the data in blob format for file uploading or dataurl for rendering the image in an img element for the user can see a preview.

## Pdf page preview

Now that we have images locally we can render them in a table view for they can see the page of the pdf.

- I wrote some very basic HTML and DOM code to put the previews into the DOM. This shouldn't be used in production. This is just for testing the code for you can see the images.

```html
<div>
  <div id="icons"></div>
  <div id="thumbnails"></div>
  <div id="8k"></div>
</div>
```

```javascript
for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
  const page = await pdfDocument.getPage(pageNumber);

  const icon = await generateImageToDataURL(page, 64);
  putIconIntoDOM(icon);

  const thumbnail = await generateImageToDataURL(page, 256);
  putThumbnailIntoDOM(thumbnail);

  const eightK = await generateImageToDataURL(page, 8000);
  put8kIntoDOM(eightK);
}

// Helper functions to put elements into the DOM
/**
 * put the icon data URL into an img element then into the DOM
 * @param {String} dataURL - src of the icon to put into img element
 */
const putIconIntoDOM = (dataURL) => {
  const img = document.createElement('img');
  img.src = dataURL;
  const icons = document.getElementById("icons");
  icons.appendChild(img);
};

/**
 * put the thumbnail data URL into an img element then into the DOM
 * @param {String} dataURL - src of the thumbnail to put into img element
 */
const putThumbnailIntoDOM = (dataURL) => {
  const img = document.createElement('img');
  img.src = dataURL;
  const thumbnails = document.getElementById("thumbnails");
  thumbnails.appendChild(img);
};

/**
 * put the 8k data URL into an img element then into the DOM
 * @param {String} dataURL - src of the 8k to put into img element
 */
const put8kIntoDOM = (dataURL) => {
  const img = document.createElement('img');
  img.src = dataURL;
  const eightK = document.getElementById("8k");
  eightK.appendChild(img);
};
```

## File uploading
It is possible to now upload each one of these as a Blob to a storage.

Use your api, web server, microservice, or favorite frontend upload library to directly upload the blob to google cloud, aws s3 or azure.

```javascript
// Fetching pages starts at 1
for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
  const page = await pdfDocument.getPage(pageNumber);
  const blobIcon = await generateImageToBlob(page, 64);
  const blobThumbnail = await generateImageToBlob(page, 256);
  const blob8k = await generateImageToBlob(page, 8000);
}
```

## Common Gotchas

- Memory leaks

If you do not call the destroy and cleanup methods your garbage collector will fail to delete the respective memory allocated by the webworker that pdf.js uses. Tests this out by trying to parse a 60+ page pdf, your javascript memory will reach well over one 1GB and will not go down. I had to learn this the hard way.

```javascript
// Cleans up resources allocated by the page.
page.cleanup();
```

```javascript
/**
 * Cleans up resources allocated by the document, e.g. created `@font-face`.
 */
 pdfDocument.cleanup();

/**
 * Destroys the current document instance and terminates the worker.
 */
 pdfDocument.destroy();
```
- source code documentation

If you go to the documentation for the library on their website it says it is incomplete. They tell you to use the source code api.js file for documentation instead. The code is well documented but searching is difficult because you dont know any function name and have to guess by searching keywords. It was helpful enough for me to find the destroy and cleanup methods by guessing the names. 

[documentation](https://mozilla.github.io/pdf.js/api/)

- Speed

Reading the pdf, parsing the pages and generating images can be quite slow since javascript is single threaded. I haven't figured out any optimizations. If you have any shoot me an email, ill update this post with your findings. 

- You dont get the binary data of each page in a pdf, you only get the whole pdf

Say if you wanted to split the pdf into pages of single pdfs i dont think this is possible. That is why we are using the canvas and images. The pdf.js library seems to only provide the entire pdf binary but you cant extract the page binaries to create a pdf file blob. There maybe a way to read the original binary and split the binary at each page and create a pdf header with the page binary to wrap the page to make it a pdf. I think this is quite difficult and maybe not worth it. 

- Pdf pages dont have filenames, you cant seem to get them either?

Pdf pages dont have filenames which makes sense but could be annoying because each page has a specific context and would want a filename. For now we have to use the original filename with the page number to name it something useful.

- Outlines attribute doesnt exist in this library, you only get thumbnails.

Pdf.js may not parse all the attributes of a pdf. I dont know how or if pdf.js had these attributes. This can be useful because these outlines maybe able to name the pdf pages or give us more informatiom on how to parse and render the pdf. 

# All the source code in one HTML file.

Save it as `index.html` and run it locally in google chrome. 

```javascript
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.3.200/pdf.min.js"></script>
  </head>
  <body>
    
    <div>
      Choose a file
      <input id="file-upload" type="file"/>
    </div>

    <div>
      <div id="icons"></div>
      <div id="thumbnails"></div>
      <div id="8k"></div>
    </div>
    <script>

      /**
       * Converts a File object into an Uint8Array buffer
       * @param {File} fileData - file object read from the input field
       * @returns {Promise} - resolves with an arraybuffer of the file
       */
      const readFileToArrayBuffer = async (fileData) => {
        return new Promise( (resolve, reject) => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(fileData);
          reader.onload = () => {
            const result = reader.result
            const bytes = new Uint8Array(result);
            resolve(bytes);
          };
        });
      }
      
      const pageToCanvas = async (page, desiredResolution) => {
        const viewport = page.getViewport({scale: 1});
        const scale = Math.min(desiredResolution/ viewport.width, desiredResolution / viewport.height);

        // Prepare canvas using PDF page dimensions
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height * scale;
        canvas.width = viewport.width * scale;

        // Render PDF page into canvas context
        const scaledViewport = page.getViewport({scale});
        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport
        };
        await page.render(renderContext).promise;
        return canvas;
      };

      const generateImageToDataURL = async (page, desiredResolution) => {
        const canvas = await pageToCanvas(page, desiredResolution);
        return canvas.toDataURL();
      };

      const generateImageToBlob = async  (page, desiredResolution) => {
        const canvas = await pageToCanvas(page, desiredResolution);
        return await new Promise(resolve => canvas.toBlob(resolve));
      };

      const fileInput = document.getElementById("file-upload");
      fileInput.addEventListener('change', async (event) => {
        const file = fileInput.files[0];
        const bytes = await readFileToArrayBuffer(file);
        const pdfDocument = await pdfjsLib.getDocument(bytes).promise;
        const numPages = pdfDocument.numPages;

        // Fetching pages starts at 1
        for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
          const page = await pdfDocument.getPage(pageNumber);

          const icon = await generateImageToDataURL(page, 64);
          putIconIntoDOM(icon);

          const thumbnail = await generateImageToDataURL(page, 256);
          putThumbnailIntoDOM(thumbnail);

          const eightK = await generateImageToDataURL(page, 8000);
          put8kIntoDOM(eightK);

          const blobIcon = await generateImageToBlob(page, 64);
          const blobThumbnail = await generateImageToBlob(page, 256);
          const blob8k = await generateImageToBlob(page, 8000);

          // Cleans up resources allocated by the page.
          page.cleanup();
        }
        /**
        * Cleans up resources allocated by the document, e.g. created `@font-face`.
        */
        pdfDocument.cleanup();

        /**
        * Destroys the current document instance and terminates the worker.
        */
        pdfDocument.destroy();
      });


      // Helper functions to put elements into the DOM
      /**
       * put the icon data URL into an img element then into the DOM
       * @param {String} dataURL - src of the icon to put into img element
       */
      const putIconIntoDOM = (dataURL) => {
        const img = document.createElement('img');
        img.src = dataURL;
        const icons = document.getElementById("icons");
        icons.appendChild(img);
      };

      /**
       * put the thumbnail data URL into an img element then into the DOM
       * @param {String} dataURL - src of the thumbnail to put into img element
       */
      const putThumbnailIntoDOM = (dataURL) => {
        const img = document.createElement('img');
        img.src = dataURL;
        const thumbnails = document.getElementById("thumbnails");
        thumbnails.appendChild(img);
      };

      /**
       * put the 8k data URL into an img element then into the DOM
       * @param {String} dataURL - src of the 8k to put into img element
       */
      const put8kIntoDOM = (dataURL) => {
        const img = document.createElement('img');
        img.src = dataURL;
        const eightK = document.getElementById("8k");
        eightK.appendChild(img);
      };
    </script>
  </body>
</html>
```