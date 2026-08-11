# 3D Model Sourcing & Optimization Guide

Complete guide for finding, downloading, and optimizing 3D pottery models for the Mud Monkey Studio website.

---

## Part 1: Finding 3D Models

### Recommended Sources (Free & Legal)

#### 1. Sketchfab (Most Popular)
**URL**: https://sketchfab.com

**How to find pottery models:**
1. Go to Sketchfab.com
2. Search for: "pottery", "ceramic vase", "handmade bowl", "clay pot", "ceramic jar"
3. Apply filters:
   - **Features** → Check "Downloadable"
   - **License** → Select "Creative Commons" (CC0, CC-BY, or CC-BY-SA)
   - **Animated** → No (we want static models)
4. Sort by "Most Viewed" or "Most Liked" for quality models
5. Click on model → Click "Download 3D Model" button
6. Choose format: **GLB** or **GLTF** (preferred)

**License types on Sketchfab:**
- CC0 (Public Domain) - Best, no attribution needed
- CC-BY - Requires attribution
- CC-BY-SA - Requires attribution + share-alike

#### 2. Poly Pizza
**URL**: https://poly.pizza

**Features:**
- All models are free and open-source
- Previously Google Poly
- Clean, simple models
- Search: "pottery", "vase", "bowl", "ceramic"
- Download directly as GLB

#### 3. Quaternius
**URL**: https://quaternius.com/index.html

**Features:**
- Free ultimate models pack
- Clean, low-poly aesthetic
- CC0 license (public domain)
- Look for "Props" or "Items" packs
- Download as FBX or OBJ, convert to GLB

#### 4. Kenney Assets
**URL**: https://kenney.nl/assets

**Features:**
- Huge library of free game assets
- CC0 license
- Stylized, game-ready models
- Search for "furniture" or "props"
- Download format varies (may need conversion)

#### 5. TurboSquid Free
**URL**: https://www.turbosquid.com/Search/3D-Models/free/pottery

**Features:**
- Some free models available
- Mix of licenses (check carefully)
- Higher quality, more detailed
- Download format: FBX, OBJ (convert to GLB)

### What to Look For

**Good pottery models:**
- Clean topology (not too many polygons)
- Realistic or stylized aesthetic that matches brand
- Single mesh (not multiple parts)
- Neutral colors (we'll apply brand colors)
- No embedded animations
- Reasonable file size

**Avoid:**
- Very high-poly models (>50k triangles)
- Models with complex texture setups
- Rigged or animated models
- Models with licensing restrictions

---

## Part 2: Downloading Models

### Step-by-Step Download Process

#### From Sketchfab:
1. Click model thumbnail
2. Click "Download 3D Model" button (requires free account)
3. Select **GLB** format (or GLTF)
4. Click "Download"
5. Save to your computer (not the project yet)

#### From Poly Pizza:
1. Click model
2. Click "Download" button
3. Choose **GLB** format
4. Save to your computer

#### From other sources:
1. Download in available format (FBX, OBJ, DAE)
2. You'll need to convert to GLB using Blender (see Part 3)

### Organizing Downloads

Create a temporary folder on your computer:
```
~/Downloads/pottery-models/
  raw/              # Original downloaded files
  optimized/        # Processed GLB files ready for web
  sources.txt       # List of URLs and licenses
```

Document each model immediately:
```
vase-01.glb
Source: https://sketchfab.com/3d-models/...
Author: John Doe
License: CC-BY
Downloaded: 2026-01-13
```

---

## Part 3: Optimizing Models with Blender

### Installing Blender (Free)

**Download**: https://www.blender.org/download/

**System Requirements:**
- Windows, Mac, or Linux
- 8GB RAM minimum
- 1GB disk space

**Installation:**
1. Download for your OS
2. Run installer
3. Launch Blender
4. No configuration needed for basic optimization

### Optimization Workflow in Blender

#### Import Model

1. Open Blender
2. Delete default cube: Select cube → Press `X` → Delete
3. File → Import → Choose format:
   - **GLB/GLTF 2.0** (if downloaded as GLB)
   - **FBX** (if downloaded as FBX)
   - **Wavefront (.obj)** (if downloaded as OBJ)
4. Navigate to your downloaded model → Import

#### Check Model Stats

1. Look at top-right info panel (or press `N` to show)
2. Check polygon count:
   - **Tris**: Should be < 10,000 for web
   - **Verts**: Should be < 6,000

If higher than this, you need to simplify.

#### Simplify Model (Decimate)

**Only if polygon count is too high:**

1. Select the model (click it)
2. Go to right panel → Wrench icon (Modifiers)
3. Click "Add Modifier" → "Decimate"
4. Adjust "Ratio":
   - Start with 0.5 (reduces by 50%)
   - Watch triangle count in top-right
   - Adjust until < 10,000 triangles
5. Look at model to ensure it still looks good
6. Click "Apply" when satisfied

#### Check Scale

1. Select model
2. Look at "Dimensions" in right panel (press `N` if hidden)
3. Pottery should be roughly 1-3 Blender units tall
4. If too large or small:
   - Press `S` (Scale)
   - Type number (e.g., `0.5` for half size)
   - Press Enter

#### Apply Transformations

**Important step:**

1. Select model
2. Press `Ctrl + A` (Mac: `Cmd + A`)
3. Click "All Transforms"

This bakes scale/rotation into the geometry.

#### Export as Optimized GLB

1. File → Export → **glTF 2.0 (.glb/.gltf)**
2. Settings on right panel:
   - **Format**: GLB (binary)
   - **Include**: ✓ Selected Objects
   - **Transform**: ✓ +Y Up
   - **Geometry**:
     - ✓ Apply Modifiers
     - ✓ UVs
     - ✓ Normals
     - ✓ Vertex Colors (if any)
   - **Compression**: ✓ Draco mesh compression
     - Compression level: 6 (higher = smaller file)
     - Position quantization: 14
     - Normal quantization: 10
     - Texture coordinate quantization: 12
3. Navigate to save location: `~/Downloads/pottery-models/optimized/`
4. Name file: `vase-01.glb`, `bowl-01.glb`, etc.
5. Click "Export glTF 2.0"

#### Verify File Size

Check exported file:
- **Target**: < 200KB
- **Acceptable**: < 500KB
- **Too large**: > 1MB (increase Draco compression or simplify more)

---

## Part 4: Alternative - Online Tools (No Blender Required)

### glTF-Transform (Online)

**URL**: https://gltf-transform.donmccurdy.com

**Features:**
- Web-based GLTF optimizer
- No installation required
- Apply compression, simplification

**How to use:**
1. Go to website
2. Drop your GLB file
3. Click "Optimize" or "Compress"
4. Download optimized version

### gltf.report (Analysis Only)

**URL**: https://gltf.report

**Features:**
- Analyze GLTF/GLB files
- See polygon counts, file size breakdown
- Identify optimization opportunities

**How to use:**
1. Go to website
2. Drop your GLB file
3. Review stats
4. Use another tool to optimize based on findings

---

## Part 5: Adding Models to Project

### Copy Optimized Files

1. Navigate to your optimized models folder
2. Copy GLB files
3. Paste into project directory:
   ```
   /home/vishrut/mudmonkeystudio/public/models/pottery/
   ```

### File Naming Convention

Use descriptive, consistent names:
- `vase-01.glb`, `vase-02.glb`
- `bowl-01.glb`, `bowl-02.glb`
- `plate-01.glb`, `plate-02.glb`
- `jar-01.glb`, `jar-02.glb`

### Update Attribution

Edit `/public/models/README.md`:
1. Fill in source URL
2. Add author name
3. Specify license type
4. Add attribution text if required
5. Add download date

---

## Part 6: Testing Models

### Quick Test with Three.js Editor

**URL**: https://threejs.org/editor/

1. Go to Three.js editor
2. File → Import → Choose your GLB
3. Verify it loads and looks correct
4. Check that materials appear properly
5. Rotate and inspect from all angles

### Test in Project

After setting up model loading infrastructure in Phase 2, test each model:
1. Add model to `POTTERY_MODELS` registry
2. Render in test scene
3. Check performance (FPS)
4. Verify colors can be overridden
5. Test on mobile device

---

## Recommended Model Collection

For Mud Monkey Studio, aim for this collection:

### Vases (3 models)
- **vase-01.glb** - Tall elegant vase with narrow neck
- **vase-02.glb** - Round bulbous vase
- **vase-03.glb** - Modern cylindrical vase

### Bowls (2 models)
- **bowl-01.glb** - Wide shallow bowl
- **bowl-02.glb** - Deep rounded bowl

### Plates (1 model)
- **plate-01.glb** - Dinner plate with rim

### Jars (2 models)
- **jar-01.glb** - Storage jar with lid
- **jar-02.glb** - Wide-mouth jar

**Total: 8 models** (provides variety for scroll animations)

---

## Quality Checklist

Before adding a model to the project:

- [ ] File size < 200KB (< 500KB acceptable)
- [ ] Polygon count < 10,000 triangles
- [ ] Draco compression applied
- [ ] Scale is reasonable (1-3 units)
- [ ] Single mesh (not multiple parts)
- [ ] No errors when viewing in Three.js editor
- [ ] License documented in README
- [ ] Attribution added if required
- [ ] File naming follows convention

---

## Troubleshooting

### Model Won't Import in Blender
**Solution**: Try different import format (FBX vs OBJ)

### File Size Still Too Large
**Solution**:
- Increase Draco compression level (up to 10)
- Further reduce polygon count with Decimate
- Remove embedded textures if not needed

### Model Looks Broken After Decimation
**Solution**:
- Reduce decimation ratio (try 0.7 instead of 0.5)
- Use "Planar" decimation mode for flat surfaces
- Apply smoothing modifier before decimating

### Model Appears Tiny/Huge in Scene
**Solution**:
- Check scale in Blender before export
- Apply transforms (Ctrl+A → All Transforms)
- Use scale prop in React component

### Colors Don't Override
**Solution**:
- Ensure materials are MeshStandardMaterial compatible
- Check material names in model
- May need to manually assign materials in code

---

## Next Steps

After completing Phase 1:

1. ✅ Models sourced and downloaded
2. ✅ Models optimized with Blender/online tools
3. ✅ Files added to `/public/models/pottery/`
4. ✅ Attribution documented in README
5. → **Move to Phase 2**: Build model loading infrastructure

---

## Resources

### Documentation
- Blender Manual: https://docs.blender.org/manual/en/latest/
- GLTF Spec: https://www.khronos.org/gltf/
- Draco Compression: https://google.github.io/draco/

### Tools
- Blender: https://www.blender.org
- Three.js Editor: https://threejs.org/editor/
- glTF-Transform: https://gltf-transform.donmccurdy.com
- gltf.report: https://gltf.report

### Communities
- Sketchfab Community: https://sketchfab.com/community
- Blender Stack Exchange: https://blender.stackexchange.com
- Three.js Forum: https://discourse.threejs.org

---

**Last Updated**: 2026-01-13
