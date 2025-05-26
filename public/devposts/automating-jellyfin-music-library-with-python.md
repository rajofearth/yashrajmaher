---  
title: "How I Automated My Jellyfin Music Library Cleanup with Python"  
date: 2024-10-27
description: "Frustrated by Jellyfin’s metadata quirks, I built a script to enforce album-per-folder rules, sanitize filenames, and fix missing cover art." 
author: "Yashraj Maher"
website: "https://github.com/rajofearth/audio_file_organizer"
tags: [automation, jellyfin, music, python, metadata]  
---  

### **The Jellyfin Metadata Trap**  
I love Jellyfin’s self-hosted media streaming – except when it comes to music. Despite meticulous tagging, my library looked broken:  
- Albums split into 3+ entries because tracks were scattered across folders.  
- Cover art ignored despite being embedded in files.  
- Songs titled `Track05.mp3` because Jellyfin fell back to filenames.  

The [official docs](https://jellyfin.org/docs/general/server/media/music/) hinted at the issue:  
> *“Albums are organized in folders, with one folder containing one and only one album.”*  

My music collection was a mess of single-track folders, unsanitized filenames (`Song#1!.flac`), and inconsistent metadata. Manual fixes for 300+ tracks? No thanks.  

---

### **Why Off-the-Shelf Tools Failed**  
I tried:  
- **MusicBrainz Picard**: Required manual album matching.  
- **Beets**: Too much configuration for a simple task.  
- **Bulk Renamers**: Fixed filenames but ignored folder structures.  

I needed something that:  
1. **Grouped tracks into Jellyfin-friendly `Artist/Album` folders**  
2. **Used embedded metadata as the source of truth**  
3. **Eliminated special characters Jellyfin hates** (`#`, `?`, `:`, etc.)  

So I built a Python script to do it in **under 10 seconds**.  

---

### **The Script: Key Features**  
#### 1. **Jellyfin Folder Structure Enforcement**  
```python  
# Jellyfin requires 1 album = 1 folder  
def create_jellyfin_path(file_path, artist, album):  
    base_dir = os.path.dirname(file_path)  
    safe_artist = sanitize(artist) or "Unknown_Artist"  
    safe_album = sanitize(album) or "Unknown_Album"  
    target_dir = os.path.join(base_dir, safe_artist, safe_album)  
    os.makedirs(target_dir, exist_ok=True)  
    return target_dir  
```  
- **Before**: Tracks for *“Dark Side of the Moon”* scattered across `Pink Floyd/`, `Rock/`, and loose files.  
- **After**: All tracks moved to `Pink_Floyd/Dark_Side_of_the_Moon/`.  

#### 2. **Filename Sanitization**  
Jellyfin chokes on `?` or `:`, so the script replaces them with underscores:  
```python  
def jellyfin_sanitize(name):  
    unsafe_chars = r'<>:"/\|?*#'  # Jellyfin's kryptonite  
    for char in unsafe_chars:  
        name = name.replace(char, "_")  
    return name.strip()  
```  
- **Before**: `Hey You (Remix 2023).flac` → Jellyfin logs errors.  
- **After**: `Hey_You_(Remix_2023).flac` → Jellyfin parses smoothly.  

#### 3. **Metadata-Driven Sorting**  
Using Mutagen, the script prioritizes embedded tags over filenames:  
```python  
from mutagen.flac import FLAC  

def get_metadata(file_path):  
    if file_path.endswith(".flac"):  
        audio = FLAC(file_path)  
        return {  
            "artist": audio.get("artist", ["Unknown"])[0],  
            "album": audio.get("album", ["Unknown"])[0],  
            "date": audio.get("date", ["1970"])[0],  # For sorting  
        }  
    # Similar logic for MP3, OGG, etc.  
```  
- **Result**: Jellyfin displays `The Dark Side of the Moon` instead of `Album 3`.  

---

### **Advanced Tricks for Jellyfin Compatibility**  
#### **Auto-Extracting Cover Art**  
Jellyfin looks for `cover.jpg` or `folder.jpg` in album folders. The script extracts embedded art:  
```python  
from mutagen.id3 import ID3  

def extract_cover_art(file_path, target_dir):  
    if file_path.endswith(".mp3"):  
        audio = ID3(file_path)  
        if 'APIC:' in audio:  
            with open(f"{target_dir}/cover.jpg", "wb") as f:  
                f.write(audio['APIC:'].data)  
```  
- **Bonus**: Adds missing art using Last.fn API if none exists.  

#### **Generating .nfo Files**  
For albums with missing metadata, the script creates Jellyfin-compatible `.nfo` files:  
```text  
<!-- Pink_Floyd/Dark_Side_of_the_Moon/album.nfo -->  
<album>  
  <title>The Dark Side of the Moon</title>  
  <year>1973</year>  
</album>  
```  

---

### **Challenges & Lessons**  
1. **Metadata Inconsistencies**:  
   - Some MP3s used `TPE1` for artist, others `ARTIST`. Normalized all to `artist`.  
   - Solution: A unified tag-to-key mapping table.  

2. **Special Characters**:  
   - A file named `AC/DC - Back In Black.mp3` broke folder creation.  
   - Solution: Replace `/` with `_` during sanitization.  

3. **Performance**:  
   - Processing 10,000+ files took minutes.  
   - Future: Add multithreading with `concurrent.futures`.  

---

### **Try It Yourself**  
The script is [open-source here](https://github.com/rajofearth/audio_file_organizer). To use:  

1. **Install**:  
   ```bash  
   pip install mutagen requests  # For cover art fetching  
   ```  

2. **Run**:  
   ```bash  
   python3 organize.py --input ~/Music --jellyfin-mode  
   ```  

3. **Flags**:  
   - `--dry-run`: Preview changes without moving files.  
   - `--fetch-art`: Auto-download missing cover art.  

---

### **Conclusion**  
This project taught me two things:  
1. **Jellyfin’s “metadata-first” claim is half-true** – folder structure and filenames matter more than they admit.  
2. **Python is perfect for quick FS automation** – the script took just 4 hours to build but saved me days of manual cleanup.  

Next up:  
- **GUI version** for non-technical users.  
- **Integration with Lidarr** for auto-tagging.  
( Only If i don't procastinate, which well never happen )

*Your turn: How do you organize your music library? Share your hacks!* 🎶  

---  