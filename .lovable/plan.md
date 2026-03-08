

## Plan: Create Adapted flickering-footer.tsx Component

The provided component has several dependencies not in this project. Here's the adaptation plan:

### File: `src/components/ui/flickering-footer.tsx`

Create this file by adapting the provided code with these substitutions:

| Original | Replacement |
|----------|-------------|
| `"use client"` | Remove (Vite, not Next.js) |
| `import { ChevronRightIcon } from "@radix-ui/react-icons"` | `import { ChevronRight } from "lucide-react"` |
| `import * as Color from "color-bits"` | Use the manual `getRGBA` helper already in our `flickering-grid.tsx` |
| `import { motion } from "motion/react"` | Replace `motion.div`/`motion.p` with plain `div`/`p` + CSS transitions |
| `import Link from "next/link"` | `import { Link } from "react-router-dom"` |
| `cn` utility (inline) | `import { cn } from "@/lib/utils"` |
| `Link href=` | `Link to=` |
| `Icons.logo` SVG | Replace with Kayn Scan "K" logo |
| SOC2/HIPAA badge icons | Remove (not relevant to manga site) |
| `focusInput`, `focusRing`, `hasErrorInput` exports | Remove (unused utility classes) |

**Color helpers**: Replace `Color.formatRGBA(Color.parse(...))` with a simple DOM-based color resolver (createElement → getComputedStyle → extract rgb values), and `Color.alpha(Color.parse(...), opacity)` with string manipulation on the rgb result.

**Motion animations**: The original uses `motion.div` with `initial`/`animate`/`transition` for fade-in effects. Replace with CSS `opacity` transitions or just render statically since animations are subtle.

**Content**: Adapt footer sections to use Kayn Scan branding and navigation links (Home, Series, Latest, Library, DMCA, Discord) instead of the generic company links.

### File: `src/components/Footer.tsx`

Update to import and use the new `Component` from `flickering-footer.tsx` as the footer, replacing the current implementation.

