---
path: "/blog/pairing-filenames"
date: "2019-12-24"
title: "Pairing filenames"
categories:
  - Code
tags:
  - node.js
  - automation
---

Over the past two years I have been taking photos with my leica sofort. I read into what is the best way to preserve instant film and scanning them is the best method. When I take an instant photo I will label the back of the film with the date, time, location, what was happening and who was there. Since I want to scan the back of the instant film to preserve the label I gave it that means I must scan the front and back of the film. I quickly realized that I would now have to pair those two images together on my computer because I don't want all my files mixed up.

### Scanning
I am using an epson v600 to scan my instant film. I have two 3D printed mounts that hold two photos each to prevent newton rings when scanning.

I am able to scan 4 photos at once then flip and scan the backs. This produces 8 scans in total with 4 pairs. This is where I want an progamatic way of renaming the 4 pairs to be matched. I would not want to spend the time to click all 8 files see which ones match then rename them by hand. This will be prone to more human error and most likely end up taking more time.

### Steps
- Scan the directory for files that do not have a prefix of my choosing. This means they have already been processed. Instead of moving the files to a processed folder I keep everything in one place.
- Take the list of 8 files and sort by the [birthtime](https://nodejs.org/api/fs.html#fs_stats_birthtime) of the files.
- Match the 0th and 4th, 1st and 5th and so forth. These will represent the pairs of the front and back scans. We know we can do this because the scanning software will always scan the 4 front in the same order and the 4 back in the same order. This means we can look at the date created to match the front and back.
- rename each pair as such `<prefix><shortid>__<original filename>`.
- Mine looks like `__INSTAX__<shortid>__originalName.tiff`

The front and back scans will have the same shortid in the prefix which means that they are paired. Also no two pairs will have the same short random id. The prefix out front is used for filtering the files when the application runs to remove files we should not process. I used the package [shortid](https://www.npmjs.com/package/shortid) to generate the random short id.

### In action
1. Scan the fronts of 4 instant film
```bash
$ ls ~/scannedImages/
img0001.tiff
img0002.tiff
img0003.tiff
img0004.tiff
```
2. Scan the backs
```bash
$ ls ~/scannedImages/
img0001.tiff
img0002.tiff
img0003.tiff
img0004.tiff
img0005.tiff
img0006.tiff
img0007.tiff
img0008.tiff
```

`img0001.tiff` & `img0005.tiff` should be paried, repeat for other files.
3. Run the CLI application with the 8 scans
```bash
npm run rename ~/scanedImages/
```
4. The 8 scans are now in 4 pairs.
```bash
$ ls ~/scannedImages/
__INSTAX__a4vhAoFG__img0001.tiff
__INSTAX__hwX6aOr7__img0002.tiff
__INSTAX__nYrnfYEv__img0003.tiff
__INSTAX__7oet_d9Z__img0004.tiff
__INSTAX__a4vhAoFG__img0005.tiff
__INSTAX__hwX6aOr7__img0006.tiff
__INSTAX__nYrnfYEv__img0007.tiff
__INSTAX__7oet_d9Z__img0008.tiff
```

### Overview
This method will allow you to easily store your scanned film on disk in pairs with minimal overhead.

### Code
All the source code is open source and available on [github](https://github.com/nadr0/pairing-filenames).

### Related links
Newton rings - [https://en.wikipedia.org/wiki/Newton's_rings](https://en.wikipedia.org/wiki/Newton%27s_rings)

Epson v600 - [https://epson.com/For-Home/Scanners/Photo-Scanners/Epson-Perfection-V600-Photo-Scanner/p/B11B198011](https://epson.com/For-Home/Scanners/Photo-Scanners/Epson-Perfection-V600-Photo-Scanner/p/B11B198011)

Instax instant film scanning mount - [https://www.zoekissel.com/products/mini](https://www.zoekissel.com/products/mini)

leica sofort - [https://us.leica-camera.com/Photography/Leica-SOFORT/Leica-SOFORT](https://us.leica-camera.com/Photography/Leica-SOFORT/Leica-SOFORT)
