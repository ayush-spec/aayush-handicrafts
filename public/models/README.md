# 3D Model Assets

This directory contains optimized 3D models used in the Mud Monkey Studio website.

## Directory Structure

```
models/
  pottery/          # Pottery models (vases, bowls, plates, jars)
    vase-01.glb
    vase-02.glb
    bowl-01.glb
    plate-01.glb
    jar-01.glb
```

## Model Requirements

- **Format**: GLB (GLTF Binary)
- **File Size**: < 200KB per model
- **Polygon Count**: < 10,000 triangles
- **Scale**: 1-3 units in Blender
- **Compression**: Draco compression enabled
- **Textures**: Embedded in GLB file

## Model Attribution

All models used in this project must comply with their respective licenses. Document all sources below:

### Pottery Models

#### vase-01.glb
- **Source**: [URL]
- **Author**: [Author Name]
- **License**: [CC0 / CC-BY / CC-BY-SA]
- **Attribution**: [Required attribution text if applicable]
- **Date Downloaded**: [YYYY-MM-DD]

#### vase-02.glb
- **Source**: [URL]
- **Author**: [Author Name]
- **License**: [CC0 / CC-BY / CC-BY-SA]
- **Attribution**: [Required attribution text if applicable]
- **Date Downloaded**: [YYYY-MM-DD]

#### bowl-01.glb
- **Source**: [URL]
- **Author**: [Author Name]
- **License**: [CC0 / CC-BY / CC-BY-SA]
- **Attribution**: [Required attribution text if applicable]
- **Date Downloaded**: [YYYY-MM-DD]

#### bowl-02.glb
- **Source**: [URL]
- **Author**: [Author Name]
- **License**: [CC0 / CC-BY / CC-BY-SA]
- **Attribution**: [Required attribution text if applicable]
- **Date Downloaded**: [YYYY-MM-DD]

#### plate-01.glb
- **Source**: [URL]
- **Author**: [Author Name]
- **License**: [CC0 / CC-BY / CC-BY-SA]
- **Attribution**: [Required attribution text if applicable]
- **Date Downloaded**: [YYYY-MM-DD]

#### jar-01.glb
- **Source**: [URL]
- **Author**: [Author Name]
- **License**: [CC0 / CC-BY / CC-BY-SA]
- **Attribution**: [Required attribution text if applicable]
- **Date Downloaded**: [YYYY-MM-DD]

## License Types

### CC0 (Public Domain)
- No attribution required
- Free to use for any purpose
- Best option for commercial projects

### CC-BY (Attribution)
- Attribution required
- Display credit in website footer or credits page
- Free to use and modify

### CC-BY-SA (Attribution-ShareAlike)
- Attribution required
- Derivative works must use same license
- Free to use and modify

## Where to Add Attribution

If models require attribution (CC-BY, CC-BY-SA), add credits to:
- Website footer component (`src/components/layout/Footer.tsx`)
- Or create a dedicated Credits/Attribution page

Example attribution in footer:
```
3D Models: [Model Name] by [Author] (CC-BY), [Model Name] by [Author] (CC-BY-SA)
```

## Optimization Status

- [ ] vase-01.glb - Optimized & Ready
- [ ] vase-02.glb - Optimized & Ready
- [ ] bowl-01.glb - Optimized & Ready
- [ ] bowl-02.glb - Optimized & Ready
- [ ] plate-01.glb - Optimized & Ready
- [ ] jar-01.glb - Optimized & Ready

## Notes

- Keep source files (FBX, OBJ, blend) in a separate backup location
- Only commit optimized GLB files to the repository
- Test each model in the application before committing
- Update attribution immediately when adding new models
