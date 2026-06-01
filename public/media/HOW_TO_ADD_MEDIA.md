# Media Storage Guide

This folder is designed to hold all the large media for your site—especially your videos and photos. 

Because it's in the `public` folder, everything here will be served as a direct URL to the browser, which is the perfect and most performant way to load heavy video files.

### Where to put things:
1. **Videos:** Drop your `.mp4`, `.webm`, or `.mov` files into the `public/media/videos` folder. 
2. **Images:** Drop your images (`.png`, `.jpg`, etc.) into the `public/media/images` folder.

### How to use them in your code:
If you place a video called `our_moment.mp4` into `public/media/videos/our_moment.mp4`, you can reference it in your React code using the absolute path:

```tsx
<video src="/media/videos/our_moment.mp4" />
```

*(Note: In Vite, files in the `public` directory are referenced with a leading slash `/` representing the root of the site, omitting the word "public".)*
