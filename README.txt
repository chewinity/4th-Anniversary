ANNIVERSARY SURPRISE WEBSITE
============================

HOW TO OPEN
1. Extract the ZIP file.
2. Open index.html using Google Chrome, Microsoft Edge, Firefox, or Safari.
3. Tap/click the envelope.

HOW TO CHANGE THE LETTER
Open index.html in Notepad or Visual Studio Code.
Find the section with class="letter-body" and replace the sample paragraphs.
Change "Your Love" in the signature to your name.

HOW TO CHANGE THE PHOTOS
1. Put 5 to 10 photos inside:
   assets/images/
2. Rename them, for example:
   photo1.jpg, photo2.jpg, photo3.jpg, etc.
3. Open script.js.
4. Change the "photos" list so the filenames match your actual images.

Example:
const photos = [
  "assets/images/photo1.jpg",
  "assets/images/photo2.jpg",
  "assets/images/photo3.jpg",
  "assets/images/photo4.jpg",
  "assets/images/photo5.jpg"
];

HOW TO USE YOUR OWN SONG
The template already includes a simple built-in melody.

To use an MP3 instead:
1. Put your song in assets/ and name it music.mp3.
2. Add this before </body> in index.html:
   <audio id="bgMusic" src="assets/music.mp3" loop></audio>
3. In script.js, replace the built-in music functions with:
   const bgMusic = document.getElementById("bgMusic");
   bgMusic.volume = 0.55;
   bgMusic.play();

Note: Browsers require the user to tap/click first before music may play.
That is why the music starts only after opening the envelope.

TO SHARE ONLINE
Upload the entire extracted folder to:
- GitHub Pages
- Netlify
- Vercel

The website is responsive and adjusts to phones, tablets, and laptops.
