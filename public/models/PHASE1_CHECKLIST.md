# Phase 1: Model Preparation - Quick Checklist

Use this checklist to track your progress through Phase 1.

---

## Step 1: Find Models

### Search on Sketchfab
- [ ] Search "ceramic vase" with Downloadable + CC filter
- [ ] Download 2-3 vase models as GLB
- [ ] Search "ceramic bowl" and download 2 models
- [ ] Search "ceramic plate" and download 1 model
- [ ] Search "ceramic jar" and download 1-2 models

### Search on Poly Pizza
- [ ] Browse pottery section
- [ ] Download any additional models needed

### Document Sources
- [ ] Create sources.txt file with URLs
- [ ] Note author names
- [ ] Note license types

**Target: 6-8 pottery models total**

---

## Step 2: Optimize Models

For each downloaded model:

### Model: vase-01
- [ ] Import into Blender
- [ ] Check polygon count (< 10k tris)
- [ ] Apply Decimate if needed
- [ ] Check scale (1-3 units)
- [ ] Apply All Transforms (Ctrl+A)
- [ ] Export as GLB with Draco compression
- [ ] Verify file size < 200KB
- [ ] Test in Three.js editor

### Model: vase-02
- [ ] Import into Blender
- [ ] Check polygon count (< 10k tris)
- [ ] Apply Decimate if needed
- [ ] Check scale (1-3 units)
- [ ] Apply All Transforms (Ctrl+A)
- [ ] Export as GLB with Draco compression
- [ ] Verify file size < 200KB
- [ ] Test in Three.js editor

### Model: bowl-01
- [ ] Import into Blender
- [ ] Check polygon count (< 10k tris)
- [ ] Apply Decimate if needed
- [ ] Check scale (1-3 units)
- [ ] Apply All Transforms (Ctrl+A)
- [ ] Export as GLB with Draco compression
- [ ] Verify file size < 200KB
- [ ] Test in Three.js editor

### Model: bowl-02
- [ ] Import into Blender
- [ ] Check polygon count (< 10k tris)
- [ ] Apply Decimate if needed
- [ ] Check scale (1-3 units)
- [ ] Apply All Transforms (Ctrl+A)
- [ ] Export as GLB with Draco compression
- [ ] Verify file size < 200KB
- [ ] Test in Three.js editor

### Model: plate-01
- [ ] Import into Blender
- [ ] Check polygon count (< 10k tris)
- [ ] Apply Decimate if needed
- [ ] Check scale (1-3 units)
- [ ] Apply All Transforms (Ctrl+A)
- [ ] Export as GLB with Draco compression
- [ ] Verify file size < 200KB
- [ ] Test in Three.js editor

### Model: jar-01
- [ ] Import into Blender
- [ ] Check polygon count (< 10k tris)
- [ ] Apply Decimate if needed
- [ ] Check scale (1-3 units)
- [ ] Apply All Transforms (Ctrl+A)
- [ ] Export as GLB with Draco compression
- [ ] Verify file size < 200KB
- [ ] Test in Three.js editor

---

## Step 3: Add to Project

- [ ] Copy all optimized GLB files
- [ ] Paste into `/public/models/pottery/` directory
- [ ] Verify files are in correct location
- [ ] Check file names follow convention

**File naming:**
```
✓ vase-01.glb, vase-02.glb
✓ bowl-01.glb, bowl-02.glb
✓ plate-01.glb
✓ jar-01.glb
```

---

## Step 4: Document Attribution

Edit `/public/models/README.md`:

- [ ] Fill in source URL for vase-01
- [ ] Add author name for vase-01
- [ ] Add license type for vase-01
- [ ] Fill in source URL for vase-02
- [ ] Add author name for vase-02
- [ ] Add license type for vase-02
- [ ] Fill in source URL for bowl-01
- [ ] Add author name for bowl-01
- [ ] Add license type for bowl-01
- [ ] Fill in source URL for bowl-02
- [ ] Add author name for bowl-02
- [ ] Add license type for bowl-02
- [ ] Fill in source URL for plate-01
- [ ] Add author name for plate-01
- [ ] Add license type for plate-01
- [ ] Fill in source URL for jar-01
- [ ] Add author name for jar-01
- [ ] Add license type for jar-01

---

## Step 5: Final Verification

- [ ] All models in `/public/models/pottery/`
- [ ] All models < 200KB each (or < 500KB acceptable)
- [ ] All models < 10k triangles
- [ ] All models tested in Three.js editor
- [ ] All attributions documented
- [ ] File names follow convention
- [ ] Total file size < 2MB for all models

---

## Phase 1 Complete! ✅

Once all items are checked, you're ready for:

**→ Phase 2: Model Loading Infrastructure**

Next steps:
1. Create type definitions for models
2. Build model loader component using useGLTF
3. Set up preloading system
4. Test models in React app

---

## Quick Reference

### Blender Export Settings
- Format: GLB (binary)
- Draco compression: ✓
- Compression level: 6
- Apply modifiers: ✓

### File Size Targets
- Ideal: < 200KB per model
- Acceptable: < 500KB per model
- Total: < 2MB for all models

### Polygon Count Targets
- Ideal: < 5k triangles
- Acceptable: < 10k triangles
- Maximum: 15k triangles (only for hero pieces)

---

**Start Date**: _________________
**Completion Date**: _________________
**Total Models**: _____ / 8
