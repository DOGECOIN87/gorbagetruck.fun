# Bug Fix Report: Obstacles and Collectibles Not Rendering

## Problem Summary

Obstacles and collectibles were completely invisible during gameplay. Neither the sprite images nor the fallback geometric shapes (cubes) were rendering, even though entities were being spawned and tracked correctly.

## Root Cause

The issue was a **critical indentation and scoping error** in the `drawEntity` function in `components/GameRunner.tsx`.

### The Bug (Lines 1348-1361)

The rendering code block was improperly indented and had an extra closing brace, causing it to be **outside the scope of the `drawEntity` function**:

```typescript
      } else if (e.subtype === 'GORBILLIONS') {
        img = assets.gorbillions;
        color = '#E91E63'; // Pink for health
      }
      }  // ← EXTRA CLOSING BRACE
    }
// Draw entity  // ← WRONG INDENTATION (column 0)
	    if (img) {  // ← TAB INDENTATION (outside function scope)
	      drawSprite(ctx, img, e.x, posY, e.z, e.width, e.height);
	    } else {
	      const topColor = LightenColor(color, 20);
	      const darkColor = DarkenColor(color, 20);
	      drawCube(ctx, e.x, posY, e.z, e.width, e.height, e.depth, color, topColor, darkColor);
	    }
  };  // ← Function closing - rendering code was AFTER this
```

### Why This Caused the Issue

1. The extra closing brace on line 1349 prematurely closed the type-checking block
2. The rendering if/else block (lines 1352-1361) was outside the `drawEntity` function
3. When `drawEntity()` was called, it would:
   - Set up the `img` and `color` variables
   - Return immediately (function ended at line 1361)
   - Never execute the rendering code

4. The rendering code existed in the file but was **never executed** because it was orphaned outside any function

## The Fix

**Two changes were made:**

1. **Removed the extra closing brace** on line 1349
2. **Fixed the indentation** of the rendering block to be inside the `drawEntity` function with proper spacing

### After Fix (Lines 1345-1361)

```typescript
      } else if (e.subtype === 'GORBILLIONS') {
        img = assets.gorbillions;
        color = '#E91E63'; // Pink for health
      }
    }

    // Draw entity
    if (img) {
      // Use sprite drawing for image assets
      drawSprite(ctx, img, e.x, posY, e.z, e.width, e.height);
    } else {
      // Fallback to cube drawing if image not available
      const topColor = LightenColor(color, 20);
      const darkColor = DarkenColor(color, 20);
      drawCube(ctx, e.x, posY, e.z, e.width, e.height, e.depth, color, topColor, darkColor);
    }
  };
```

## Verification

- **Build Status**: ✅ Project builds successfully without errors
- **TypeScript**: ✅ No type errors
- **Syntax**: ✅ All braces properly balanced

## Expected Behavior After Fix

1. **Collectibles** (TRASH_COIN, GORBAGANA, STICKER_PILL, STICKER_3, WALLET) will now render:
   - As sprites if assets load successfully
   - As colored cubes if assets fail to load

2. **Obstacles** (TRASH_BAG) will now render:
   - As sprites if assets load successfully
   - As dark gray/black cubes if assets fail to load

3. **Powerups** (GOR_INCINERATOR, GORBOY_CONSOLE, GORBILLIONS) will now render:
   - As sprites if assets load successfully
   - As colored cubes if assets fail to load

## Files Modified

- `components/GameRunner.tsx` (lines 1349 and 1351-1361)

## Testing Recommendations

1. Start the game and verify obstacles appear on the road
2. Verify collectibles (coins, bananas, etc.) are visible
3. Verify powerups occasionally spawn and are visible
4. Check that collision detection works properly with visible entities
5. Verify fallback cube rendering works if any assets fail to load

## How This Bug Went Undetected

This type of bug is particularly insidious because:
- The code compiles without errors (orphaned code is syntactically valid)
- No runtime errors are thrown
- The game appears to run normally (player moves, background scrolls)
- Only the specific feature (entity rendering) silently fails
- The entity spawning and collision logic worked fine, making it seem like a rendering-only issue
