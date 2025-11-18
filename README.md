<<<<<<< HEAD
# AoE4 Stream Overlay

A simple, customizable overlay for Age of Empires 4 streams that displays your recent match history with real-time updates.

![Example Overlay](https://via.placeholder.com/800x400?text=AoE4+Match+History+Overlay)

## Features

✨ **Auto-Refresh** - Automatically updates every 30 seconds to show your latest games  
🎨 **Stream-Ready** - Transparent background, readable white text with drop shadows  
📊 **Match Stats** - Shows W/L record, win rate, game modes, and ELO comparisons  
⚡ **Fast Setup** - Just build and add to OBS with your player ID  
🎮 **OBS Compatible** - Works perfectly as a local browser source

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/bstuddard/aoe4_stream_stats.git
cd aoe4_stream_stats
npm install
```

### 2. Find Your Player ID

Visit your profile on [aoe4world.com](https://aoe4world.com). Your profile URL will look like:
```
https://aoe4world.com/players/7228992-YourName
```
The number before the dash (`7228992`) is your player ID.

### 3. Set Your Player ID

Edit `src/App.vue` and change the default player ID on line 25:

```typescript
const playerId = ref<string>('7228992'); // Change this to YOUR player ID
```

Replace `7228992` with your own player ID.

### 4. Build the Overlay

```bash
npm run build
```

This creates the overlay in the `dist` folder.

### 5. Deploy to GitHub Pages (Recommended)

**Why deploy?** Local files can't make API calls due to browser security (CORS). Deploying to GitHub Pages solves this!

1. **Create a GitHub repository** for your overlay
2. **Push your code** to the repo
3. **Enable GitHub Pages:**
   - Go to repo **Settings** → **Pages**
   - Source: **GitHub Actions**
   - Save
4. **Push to trigger deployment** (or click "Run workflow" in Actions tab)

Your overlay will be live at: `https://bstuddard.github.io/aoe4_stream_stats/`

### 6. Add to OBS

1. Open OBS Studio
2. Add a new **Browser** source
3. Settings:
   - **URL**: `https://bstuddard.github.io/aoe4_stream_stats/`
   - **Width**: `1920`
   - **Height**: `1080`
   - ✅ Check **"Refresh browser when scene becomes active"**
4. Click OK

**That's it!** The overlay will start showing your recent games with auto-refresh every 30 seconds.

## Two Ways to Set Your Player ID

### Method 1: Edit App.vue (Recommended)

The easiest way is to set a default player ID in the code:

1. Edit `src/App.vue` line 25:
   ```typescript
   const playerId = ref<string>('YOUR_PLAYER_ID');
   ```
2. Run `npm run build`
3. Add the `dist/index.html` file to OBS

### Method 2: URL Parameter (Advanced)

If you want to change player IDs without rebuilding, you can use URL parameters in OBS:

**Format:**
```
file:///C:/path/to/dist/index.html?playerId=YOUR_PLAYER_ID
```

**Example:**
```
file:///C:/Users/YourName/Documents/aoe4_stream_overlay/aoe4_stream_overlay/dist/index.html?playerId=7228992
```

**Note:** Some versions of OBS may not allow editing the file path after selecting it. If you can't add the `?playerId=` parameter, use Method 1 instead.

## Customization

### Change Refresh Interval

Edit `src/App.vue` and modify the component:

```vue
<RecentGames v-if="playerId" :playerId="playerId" :refreshInterval="60000" />
```

Times in milliseconds:
- `30000` = 30 seconds (default)
- `60000` = 1 minute
- `120000` = 2 minutes

Then rebuild: `npm run build`

### Change Number of Games

Edit `src/composables/useAOE4API.ts`, line 16:

```typescript
const url: string = `https://aoe4world.com/api/v0/players/${playerId}/games?limit=10`;
```

Change `limit=10` to your preferred number.

Then rebuild: `npm run build`

### Adjust Colors & Styling

All styles are in `src/components/RecentGames.vue` using Tailwind CSS classes.

Common changes:
- Win background: `bg-green-900/30`
- Loss background: `bg-red-900/30`
- Text shadows: `drop-shadow-lg` → `drop-shadow-xl`
- Text size: `text-sm` → `text-base`

Then rebuild: `npm run build`

## Development & Testing

### Preview in Browser

```bash
npm run dev
```

Then open `http://localhost:5173` in your browser (uses default player ID from `App.vue`).

Or test with a different player ID: `http://localhost:5173?playerId=YOUR_PLAYER_ID`

### Test in OBS Locally (Alternative to GitHub Pages)

If you don't want to deploy yet, you can test with the dev server:

1. Run `npm run dev`
2. In OBS Browser source, use URL: `http://localhost:5173`
3. Width: `1920`, Height: `1080`

**Note:** You must keep the dev server running while streaming. For production, deploy to GitHub Pages instead.

## Troubleshooting

**Overlay not showing in OBS:**
- Make sure you ran `npm run build`
- Check the file path is correct
- Make sure "Local file" is checked in OBS
- Try refreshing the browser source (right-click → Refresh)

**No data showing:**
- Make sure you set your player ID in `src/App.vue` (line 25) and rebuilt with `npm run build`
- OR if using URL parameters, make sure you added `?playerId=YOUR_PLAYER_ID` to the file path
- Check your internet connection
- Verify the player ID is correct on [aoe4world.com](https://aoe4world.com)

**Background not transparent:**
- Should be transparent by default
- Make sure you haven't added a background in OBS

## Tech Stack

- **Vue 3** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **AoE4 World API** - Game data

## Credits

- Game data provided by [AoE4 World API](https://aoe4world.com/api)
- Inspired by [AoE4 World's official overlay](https://github.com/aoe4world/overlay)

## License

MIT License - feel free to use and customize for your streams!

---

Made with ❤️ for the AoE4 streaming community
=======
# aoe4_stream_stats
>>>>>>> 08e4e44368a55e4a21a565b104499d2860ed821e
