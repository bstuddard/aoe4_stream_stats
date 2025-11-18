# AoE4 Stream Overlay

A simple, customizable overlay for Age of Empires 4 streams that displays your recent match history with real-time updates.

**🎮 [Live Demo](https://bstuddard.github.io/aoe4_stream_stats/)** | **📦 [GitHub Repo](https://github.com/bstuddard/aoe4_stream_stats)**

![Example Overlay](https://via.placeholder.com/800x400?text=AoE4+Match+History+Overlay)

> **Quick Setup:** Deploy to GitHub Pages, then add `?playerId=YOUR_ID` to the URL in OBS. No code editing required!

## Features

✨ **Auto-Refresh** - Automatically updates every 30 seconds to show your latest games  
🎨 **Stream-Ready** - Transparent background, large readable fonts optimized for 800x500px  
📊 **Match Stats** - Summary stats (W/L/Win Rate) calculated from 10 most recent games  
🎯 **Recent Games** - Displays your 2 most recent matches with ELO comparisons  
⚡ **Fast Setup** - Deploy to GitHub Pages and add to OBS  
🎮 **OBS Compatible** - Works perfectly as a browser source

## Quick Start (No Installation Required!)

### Want to use it right now? 🚀

**Just add this to OBS:**

```
https://bstuddard.github.io/aoe4_stream_stats/?playerId=YOUR_PLAYER_ID
```

Replace `YOUR_PLAYER_ID` with your ID from [aoe4world.com](https://aoe4world.com), set width to `800`, height to `500`, and you're done!

---

### Want to customize or fork it?

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

### 3. Deploy to GitHub Pages

**Why deploy?** Local files can't make API calls due to browser security (CORS). Deploying to GitHub Pages solves this!

1. **Create a GitHub repository** for your overlay
2. **Push your code** to the repo
3. **Enable GitHub Pages:**
   - Go to repo **Settings** → **Pages**
   - Source: **GitHub Actions**
   - Save
4. **Push to trigger deployment** (or click "Run workflow" in Actions tab)

Your overlay will be live at: `https://bstuddard.github.io/aoe4_stream_stats/`

### 4. Add to OBS with Your Player ID

1. Open OBS Studio
2. Add a new **Browser** source
3. Settings:
   - **URL**: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/?playerId=YOUR_PLAYER_ID`
   - Example: `https://bstuddard.github.io/aoe4_stream_stats/?playerId=7228992`
   - **Width**: `800`
   - **Height**: `500`
   - ✅ Check **"Refresh browser when scene becomes active"**
4. Click OK

**That's it!** Just add `?playerId=YOUR_PLAYER_ID` to the end of your GitHub Pages URL. No code editing needed!

## Two Ways to Set Your Player ID

### Method 1: URL Parameter (Recommended) ⭐

The easiest way! Just add your player ID to the URL in OBS:

**Format:**
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/?playerId=YOUR_PLAYER_ID
```

**Example:**
```
https://bstuddard.github.io/aoe4_stream_stats/?playerId=7228992
```

✅ No code editing  
✅ No rebuilding  
✅ Easy to change anytime  

### Method 2: Edit App.vue (Alternative)

If you prefer to set a default player ID in the code:

1. Edit `src/App.vue` line 25:
   ```typescript
   const playerId = ref<string>('YOUR_PLAYER_ID');
   ```
2. Run `npm run build`
3. Push to GitHub to deploy

This way you don't need the `?playerId=` parameter in the URL, but you have to rebuild and redeploy every time you want to change it.

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

Then open `http://localhost:5173?playerId=YOUR_PLAYER_ID` in your browser.

Example: `http://localhost:5173?playerId=7228992`

### Test in OBS Locally (Alternative to GitHub Pages)

If you don't want to deploy yet, you can test with the dev server:

1. Run `npm run dev`
2. In OBS Browser source, use URL: `http://localhost:5173?playerId=YOUR_PLAYER_ID`
3. Example: `http://localhost:5173?playerId=7228992`
4. Width: `800`, Height: `500`

**Note:** You must keep the dev server running while streaming. For production, deploy to GitHub Pages instead.

## Troubleshooting

**Overlay not showing in OBS:**
- Make sure you ran `npm run build`
- Check the file path is correct
- Make sure "Local file" is checked in OBS
- Try refreshing the browser source (right-click → Refresh)

**No data showing:**
- **Most likely:** Make sure you added `?playerId=YOUR_PLAYER_ID` to the URL in OBS
- Example: `https://bstuddard.github.io/aoe4_stream_stats/?playerId=7228992`
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
