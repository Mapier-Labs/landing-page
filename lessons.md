# Lessons

- When enabling drag on mobile, check for `!important` layout declarations in media queries. Drag code that writes plain inline `left/top/transform` can appear to run but produce no movement because stylesheet `!important` rules win.
- When a user asks to keep existing behavior on a breakpoint, prefer a targeted revert of that breakpoint’s logic instead of keeping optional enhancements.
