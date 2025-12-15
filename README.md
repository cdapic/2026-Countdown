# 2026 New Year Countdown

A precision countdown timer to New Year 2026 with network time synchronization, audio cues, and visual effects.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```

## Build for Production

To create the files needed for deployment:

```bash
npm run build
```

This will create a `dist` folder containing the compiled HTML, JavaScript, and assets.

---

## WordPress Deployment Instructions

This application is designed to run full-screen with its own styling. The best way to deploy it to WordPress without conflicts (and to ensure the full-screen effect works) is to host it as a static page and load it via an Iframe or a direct link.

### Method 1: Iframe Embedding (Recommended)

This method allows you to embed the countdown inside a standard WordPress page while keeping the app's styles isolated.

1.  **Build the App**: Run `npm run build` on your computer.
2.  **Upload Files**:
    *   Connect to your WordPress server via FTP/SFTP.
    *   Navigate to `wp-content/uploads/`.
    *   Create a new folder named `2026-countdown`.
    *   Upload all files from your local `dist` folder into this new folder.
3.  **Create a WordPress Page**:
    *   Log in to your WordPress Admin.
    *   Create a new Page (e.g., "Countdown").
    *   Add a **Custom HTML** block.
    *   Paste the following code (adjusting your domain):

    ```html
    <iframe 
      src="/wp-content/uploads/2026-countdown/index.html" 
      style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; border: none; z-index: 9999;"
      title="2026 Countdown"
    ></iframe>
    ```

    *Note: The `z-index: 9999` and `fixed` position will make it cover the entire screen (including WordPress headers/footers). If you want it contained within the page content area, remove `position: fixed; top: 0; left: 0;` and set a specific `height` (e.g., `height: 800px;`).*

### Method 2: Direct Link

If you want the countdown to be a completely standalone experience (no WordPress theme elements):

1.  Follow steps 1 & 2 from above (Upload files).
2.  Create a custom link in your WordPress Menu that points directly to:
    `https://your-site.com/wp-content/uploads/2026-countdown/index.html`

## Test Mode

To test the countdown effects without waiting for 2026:
1. Open the app.
2. Click the concealed **"DEV_TEST"** button in the bottom-right corner.
3. This will simulate the timer jumping to T-minus 15 seconds.
