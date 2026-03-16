// js/animalIcons.js
// Animal icons - fallback to text labels if SVG loading fails

const breedLabel = { bovino: 'Bovino', ovino: 'Ovino', equino: 'Equino', porcino: 'Porcino', caninos: 'Caninos', felinos: 'Felinos' };

// Cache for loaded icons
const iconCache = {};

// Load a single icon
async function loadIcon(breed) {
    const iconMap = {
        bovino: 'Bovino.svg',
        ovino: 'Ovino.svg',
        equino: 'Equino.svg',
        porcino: 'Porcino.svg',
        caninos: 'Canino.svg',
        felinos: 'Felino.svg'
    };
    
    const filename = iconMap[breed];
    if (!filename) return '';
    
    try {
        const response = await fetch('svg/' + filename);
        if (!response.ok) throw new Error('Icon not found');
        let svg = await response.text();
        
        // Clean up SVG
        svg = svg.replace(/<\?xml[^>]*\?>/, '');
        svg = svg.replace(/<svg/, '<svg width="14" height="14" style="vertical-align:middle"');
        
        iconCache[breed] = svg;
        return svg;
    } catch (e) {
        // Silently fail - return empty to use text fallback
        return '';
    }
}

// Get icon HTML
function getAnimalIcon(breed, size = 14) {
    const cached = iconCache[breed];
    if (cached) {
        // Adjust size if needed
        if (size !== 14) {
            return cached.replace(/width="14" height="14"/, `width="${size}" height="${size}"`);
        }
        return cached;
    }
    
    // If not cached, return empty and trigger load
    loadIcon(breed);
    return '';
}

// Get all icons HTML
function getAnimalIconsHtml(breeds, options = {}) {
    const { size = 14, showLabel = true, className = '' } = options;
    
    if (!breeds || breeds.length === 0) return '';
    
    // Trigger load for all icons
    breeds.forEach(b => {
        if (!iconCache[b]) loadIcon(b);
    });
    
    return breeds.map(b => {
        const icon = getAnimalIcon(b, size);
        const label = breedLabel[b] || b;
        return `<span class="inline-flex items-center gap-1 text-[10px] bg-white border border-green-100 text-primary px-1.5 py-0.5 rounded-full shadow-sm capitalize font-medium ${className}" title="${label}">${icon} ${showLabel ? label : ''}</span>`;
    }).join('');
}

// Preload all icons
function preloadAnimalIcons() {
    Object.keys(breedLabel).forEach(breed => loadIcon(breed));
}

// Auto-preload when DOM is ready
document.addEventListener('DOMContentLoaded', preloadAnimalIcons);
