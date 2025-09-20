import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- DATA FROM THE DOCUMENT ---
const promptCategories = [
  {
    category: "Illustrative & Design Styles",
    prompts: [
      { title: 'Vector Art', prompt: 'Cute Muffin Clipart, watercolor, vector, contour, white background' },
      { title: 'Vector T-Shirt Design', prompt: 'Vector t-shirt design, vintage retro sunset distressed design, a cute black girl, 4k, steampunk, high quality, illustration, cartoon style, white background, no text' },
      { title: 'Coloring Page', prompt: 'A coloring page of with black and pure white outline of a serene countryside garden with peonies growing along a wooden fence.' },
      { title: 'Sticker', prompt: 'A beautiful cartoon baby panda with a bamboo stick sticker, close-up, sticker, cute, high resolution, illustration style' },
      { title: 'Nursery Art', prompt: 'Cute puppy watercolor sublimation' },
      { title: 'Pastel Pattern', prompt: 'Pastel Watercolor Hibiscus Flower Pattern, Digital Illustration, Minimalism, Modern, Abstract, inspired by Ellsworth Kelly and Sol LeWitt' },
      { title: 'Boho Prints', prompt: 'A watercolor sketch illustration about the living of a Penthouse in New York city, with a wasabi interior design style' },
      { title: 'Anime', prompt: 'Simple Nostalgia 90s marker art – anime girl with slim body, action shot view, portrait, strong marker style outlines, eyeliner makeup, streetwear design, pro vector, full design, solid colors' },
    ]
  },
  {
    category: "Photography & Realism",
    prompts: [
      { title: 'Food Photography', prompt: 'One delicious hamburger with whipped cream, light pink solid background' },
      { title: 'Realistic Photography', prompt: 'A delicious hamburger, professional photo, cinematic light, high quality product image, multicolored, luxurious setting, chic environment, beautiful hard sunlight, spectacular frame, competition winner, fine art, high detail, shot on nikon z9, premium lens' },
      { title: '3D Animation Characters', prompt: 'HD, 8k resolution of a young lady named Marlowe Lily Potter with emerald green eyes, fiery red hair that flows down her back in waves with a heart-shaped face. wearing a white collared shirt, and a dark robe. Sad expression' },
      { title: 'Mockup Image', prompt: 'Mockup of a large painting in a framed light living room interior. Scandinavian style with stone, big window, white color with light shades of beige and blue, candles, carpet' },
      { title: 'Cinematic Movie Still', prompt: 'A cinematic movie still of a detective in a fedora looking through a rain-streaked window in a 1940s film noir setting, dramatic lighting, high contrast, moody.' },
      { title: 'Wildlife Photography', prompt: 'National Geographic style photo of a snow leopard on a rocky cliff, telephoto lens, shallow depth of field, sharp focus, golden hour lighting.' },
      { title: 'Macro Insect Photo', prompt: 'Extreme macro shot of a dew-covered dragonfly on a blade of grass, intricate details, vibrant colors, bokeh background.' },
      { title: 'Drone Landscape', prompt: 'Aerial drone shot of a winding river through a dense, foggy autumn forest, top-down perspective, rich fall colors, epic scale.' },
    ]
  },
  {
    category: "Traditional Art Styles",
    prompts: [
      { title: 'Oil Painting', prompt: 'A boy sitting on a lake shore, watching the sunset, in Van Gogh art style, oil painting' },
      { title: 'Impressionist Landscape', prompt: 'A vibrant, sun-drenched poppy field in the style of Claude Monet, visible brushstrokes, bright color palette, impressionism.' },
      { title: 'Japanese Ukiyo-e', prompt: 'A samurai warrior standing under a cherry blossom tree, looking at Mount Fuji in the distance, traditional Japanese Ukiyo-e woodblock print style, Hokusai inspired.' },
      { title: 'Renaissance Portrait', prompt: 'A regal portrait of a queen in the style of Leonardo da Vinci, sfumato technique, serene expression, intricate details on clothing and jewelry.' },
      { title: 'Abstract Expressionism', prompt: 'A chaotic and energetic abstract painting in the style of Jackson Pollock, drip and splash technique, layered colors, expressing raw emotion.' },
      { title: 'Gothic Architecture Sketch', prompt: 'A detailed pen and ink sketch of a gothic cathedral, high arches, intricate stained glass windows, flying buttresses, dramatic shadows.' },
    ]
  },
  {
    category: "Cyberpunk & Sci-Fi",
    prompts: [
      { title: 'Cyberpunk Alley', prompt: 'A dark, rain-slicked cyberpunk alleyway, glowing neon signs in Japanese, steam rising from vents, a lone figure in a trench coat, cinematic, hyper-detailed, Blade Runner aesthetic.' },
      { title: 'Futuristic Megastructure', prompt: 'A colossal alien megastructure in deep space, Dyson sphere concept, glowing energy lines, intricate geometric patterns, awe-inspiring scale.' },
      { title: 'Biomechanical Android', prompt: 'Portrait of a biomechanical android, half human face, half exposed wiring and chrome, style of H.R. Giger, intricate, dark, surreal.' },
      { title: 'Holographic Data Room', prompt: 'A person interacting with floating holographic data screens in a dark, futuristic control room, glowing UI elements, data streams, Minority Report style.' },
      { title: 'Steampunk Airship', prompt: 'A magnificent steampunk airship with brass pipes and rotating cogs, soaring through clouds above a Victorian city, detailed, imaginative.' },
      { title: 'Post-Apocalyptic Survivor', prompt: 'A lone survivor in weathered gear standing in the ruins of a city overgrown with nature, post-apocalyptic, moody, detailed environment.' },
    ]
  },
  {
    category: "Surrealism & Fantasy",
    prompts: [
      { title: 'Floating Islands', prompt: 'Surreal landscape of floating islands with cascading waterfalls connecting them, giant bioluminescent mushrooms, in the style of Salvador Dali and Hayao Miyazaki, dreamlike, ethereal.' },
      { title: 'Clockwork Forest', prompt: 'An enchanted forest where the trees are made of intricate clockwork gears and the animals are mechanical automatons, surreal, detailed, magical.' },
      { title: 'Underwater City', prompt: 'The lost city of Atlantis, a beautiful underwater cityscape with glowing coral architecture and schools of fantastical fish, fantasy, epic, serene.' },
      { title: 'Cosmic Being', prompt: 'A celestial being made of swirling galaxies and stardust, holding a planet in its hand, cosmic, abstract, vibrant colors.' },
      { title: 'Dreamscape Library', prompt: 'An infinite library where the bookshelves stretch into the clouds, and flying books navigate the air, in the style of M.C. Escher, surreal, impossible architecture.' },
      { title: 'Mythical Griffin', prompt: 'A majestic griffin perched on a mountain peak at sunrise, fantasy creature, detailed feathers and fur, epic lighting.' },
    ]
  },
  {
    category: "Abstract & Sculptural",
    prompts: [
      { title: 'Kinetic Light Sculpture', prompt: 'An abstract kinetic sculpture made of polished chrome and colored glass, constantly in motion, casting complex light patterns on a white gallery wall, minimalist, elegant, 4k.' },
      { title: 'Geometric Papercraft', prompt: 'A complex, colorful geometric landscape made entirely of folded paper, origami style, sharp angles, vibrant gradients, abstract.' },
      { title: 'Fluid Ink Abstract', prompt: 'A macro shot of colorful alcohol inks blooming and mixing in liquid, creating organic, nebula-like patterns, abstract, vibrant, high resolution.' },
      { title: 'Minimalist Line Art', prompt: 'A single continuous line drawing of a cat, minimalist, elegant, black on a white background.' },
      { title: 'Glitch Art Portrait', prompt: 'A distorted and glitchy portrait of a person, pixel sorting, RGB split effects, digital noise, vaporwave aesthetic.' },
      { title: 'Glassmorphism Sculpture', prompt: 'A 3D render of an abstract sculpture made of frosted glass, showcasing refraction and reflection, glassmorphism, soft lighting, ethereal.' },
    ]
  }
];


const monetizationIdeas = {
  "Recipes & Food Photography": [
    "Create Recipe books and sell on Amazon KDP",
    "Start a Recipe newsletter with Beehiiv.com",
    "Start a Recipe Blog on Medium and make money from the partner program",
    "Start a Recipe social media page and promote your recipe books",
    "Sell your recipe photography on AdobeStock and Freepik",
    "Create food flyers for restaurants on Fiverr and Upwork",
    "Start a Recipe YouTube channel for food recommendations"
  ],
  "Anime, Comic & Cartoon": [
    "Create books to sell on Amazon KDP",
    "Start an Anime or comic newsletter with Beehiiv.com",
    "Sell your books on Barnes and Noble, Lulu, or Kobo writing life",
    "Create an Animation YouTube Channel with AI voiceover",
    "Share your stories on Artstation.com and grow your following",
    "Offer your AI Animation design on Fiverr and Upwork"
  ],
  "Boho & Oil Painting Prints": [
    "Post your art on Pinterest to Market your Teespring.com artprint shop",
    "Sell your art as a physical or digital product on Etsy",
    "Sell your art on Zazzle, Displate.com, Society 6, or Redbubble",
    "Create Boho Journal and Planners to sell on Etsy",
    "Sell your artprint on Artstation's Marketplace"
  ],
  "Stickers": [
    "Sell your sticker sheets on Redbubble",
    "Sell your sticker sheets on Teepublic.com",
    "Market your sticker sheets on Pinterest and sell on Teespring",
    "Sell your sticker sheets on Zazzle",
    "Sell your sticker sheets on Etsy with Printify"
  ],
  "Vector Art & Illustrations": [
    "Sell them as Clipart Bundles on Etsy, Creative Fabrica, or Teachers Pay Teachers",
    "Create flash cards or teacher materials to sell on Teachers Pay Teachers",
    "Create Nursery wall art and sell on Etsy as a printable or physical product",
    "Sell them as Nursery art prints on Zazzle",
    "Upload them as vectors on Adobe stock or Freepik"
  ],
  "Patterns": [
    "Sell them as Digital Papers on Etsy or Creative Fabrica",
    "Sell them as physical products on Mugs and apparel on Zazzle, Etsy, Redbubble and Society 6",
    "Sell them as Pattern fabrics on Pattern Bank and spoonflower marketplace"
  ]
};


// --- API CLIENT ---
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


// --- HELPER COMPONENTS ---
const Spinner = () => (
    <div className="spinner-container">
        <div className="spinner"></div>
    </div>
);

const Icon = ({ name }) => <span className="material-icons">{name}</span>;


// --- MAIN COMPONENTS ---

const PromptCard = ({ title, prompt: initialPrompt }) => {
    const [prompt, setPrompt] = useState(initialPrompt);
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [prompt]);

    const handleDownload = useCallback(() => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `${title.replace(/\s+/g, '_').toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [generatedImage, title]);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        try {
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/png',
                    aspectRatio: aspectRatio,
                },
            });

            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
            setGeneratedImage(imageUrl);

        } catch (err) {
            console.error(err);
            setError('Failed to generate image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Unique ID for select element for accessibility
    const selectId = `aspect-ratio-${title.replace(/\s+/g, '-')}`;

    return (
        <div className="prompt-card">
            <h3 className="prompt-card-title">{title}</h3>
            <div className="prompt-input-wrapper">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    aria-label={`Prompt for ${title}`}
                />
            </div>
            <div className="prompt-card-settings">
                <label htmlFor={selectId} className="aspect-ratio-label">Aspect Ratio:</label>
                <select
                    id={selectId}
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="aspect-ratio-select"
                >
                    <option value="1:1">1:1 (Square)</option>
                    <option value="16:9">16:9 (Landscape)</option>
                    <option value="9:16">9:16 (Portrait)</option>
                    <option value="4:3">4:3 (Standard)</option>
                    <option value="3:4">3:4 (Tall)</option>
                </select>
            </div>
            <div className="prompt-card-actions">
                <button onClick={handleCopy} className="btn btn-secondary">
                    <Icon name="content_copy" /> {copied ? 'Copied!' : 'Copy'}
                </button>
                <button onClick={handleGenerate} className="btn btn-primary" disabled={isLoading}>
                    <Icon name="auto_awesome" /> {isLoading ? 'Generating...' : 'Generate'}
                </button>
                {generatedImage && (
                    <button onClick={handleDownload} className="btn btn-secondary">
                        <Icon name="download" /> Download
                    </button>
                )}
            </div>
            <div className="prompt-card-result" aria-live="polite">
                {isLoading && <Spinner />}
                {error && <p className="error-message">{error}</p>}
                {generatedImage && <img src={generatedImage} alt="AI generated art" />}
            </div>
        </div>
    );
};

const App = () => {
    return (
        <>
            <header className="app-header">
                <h1>AI Art Prompt Engineer</h1>
                <p>Your guide to crafting perfect prompts and generating stunning AI art.</p>
            </header>
            <main className="app-main">
                <section id="intro">
                    <h2>Introduction</h2>
                    <p>Prompts are commands that direct AI behavior. Mastering them is key to unlocking high-quality, relevant results. This guide will help you create stunning images with ease by showing you how to prompt the right way. Simply edit the prompts below or use them as inspiration, then generate your vision with a single click.</p>
                </section>
                
                <section id="prompt-styles">
                    <h2>Prompt Styles & Generator</h2>
                    {promptCategories.map(({ category, prompts }) => (
                        <div key={category} className="prompt-category-group">
                            <h3>{category}</h3>
                            <div className="prompt-grid">
                                {prompts.map((style) => (
                                    <PromptCard key={style.title} {...style} />
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                <section id="monetization">
                    <h2>42 Ways to Make Money with Your AI Art</h2>
                    <p>Once you've created your masterpiece, here are some ideas to turn your creativity into profit.</p>
                    <div className="monetization-grid">
                        {Object.entries(monetizationIdeas).map(([category, ideas]) => (
                            <div key={category} className="monetization-category">
                                <h3>{category}</h3>
                                <ul>
                                    {ideas.map((idea, index) => (
                                        <li key={index}>{idea}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <footer className="app-footer">
                <p>Built with React & Gemini API</p>
            </footer>
        </>
    );
};

// --- STYLES ---
const styles = `
:root {
    --background-color: #f8f9fa;
    --text-color: #212529;
    --primary-color: #4f46e5;
    --primary-hover-color: #4338ca;
    --secondary-color: #6c757d;
    --secondary-hover-color: #5a6268;
    --card-background: #ffffff;
    --card-border: #e9ecef;
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --border-radius: 8px;
    --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

body {
    font-family: var(--font-family);
    background-color: var(--background-color);
    color: var(--text-color);
    margin: 0;
    line-height: 1.6;
}

#root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.app-header {
    background: var(--card-background);
    border-bottom: 1px solid var(--card-border);
    padding: 2rem;
    text-align: center;
}

.app-header h1 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin: 0 0 0.5rem 0;
}

.app-header p {
    font-size: 1.1rem;
    color: var(--secondary-color);
    margin: 0;
}

.app-main {
    flex: 1;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 2rem 1rem;
    box-sizing: border-box;
}

section {
    background-color: var(--card-background);
    border-radius: var(--border-radius);
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: var(--shadow);
}

section > h2 {
    font-size: 2rem;
    margin-top: 0;
    margin-bottom: 2rem;
    border-bottom: 2px solid var(--primary-color);
    padding-bottom: 0.5rem;
    display: inline-block;
}

.prompt-category-group {
    margin-bottom: 3rem;
}
.prompt-category-group:last-child {
    margin-bottom: 0;
}

.prompt-category-group h3 {
    font-size: 1.75rem;
    color: var(--text-color);
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--card-border);
}

.prompt-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
}

.prompt-card {
    border: 1px solid var(--card-border);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    transition: box-shadow 0.2s ease-in-out;
}

.prompt-card:hover {
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
}

.prompt-card-title {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
}

.prompt-input-wrapper textarea {
    width: 100%;
    padding: 0.75rem;
    border-radius: 6px;
    border: 1px solid var(--card-border);
    font-family: inherit;
    font-size: 1rem;
    resize: vertical;
    box-sizing: border-box;
}

.prompt-card-settings {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 1rem 0;
}

.aspect-ratio-label {
    font-size: 0.9rem;
    font-weight: 500;
    white-space: nowrap;
}

.aspect-ratio-select {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    border: 1px solid var(--card-border);
    background-color: #fff;
    font-family: inherit;
    font-size: 0.9rem;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.aspect-ratio-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.25);
}

.prompt-card-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s;
    font-size: 0.9rem;
    flex-grow: 1;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-primary {
    background-color: var(--primary-color);
    color: white;
}
.btn-primary:not(:disabled):hover {
    background-color: var(--primary-hover-color);
}

.btn-secondary {
    background-color: #e9ecef;
    color: var(--text-color);
}
.btn-secondary:not(:disabled):hover {
    background-color: #dee2e6;
}

.prompt-card-result {
    margin-top: 1.5rem;
    min-height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f3f5;
    border-radius: 6px;
}

.prompt-card-result img {
    max-width: 100%;
    border-radius: 6px;
}

.error-message {
    color: #dc3545;
    padding: 1rem;
}

.spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.spinner {
    border: 4px solid rgba(0,0,0,0.1);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border-left-color: var(--primary-color);
    animation: spin 1s ease infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.material-icons {
    font-size: 1.2em;
}

.monetization-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.monetization-category h3 {
    color: var(--primary-color);
    margin-bottom: 0.5rem;
}

.monetization-category ul {
    list-style-type: '🎨';
    padding-left: 1.5rem;
}

.monetization-category li {
    padding-left: 0.5rem;
    margin-bottom: 0.5rem;
}

.app-footer {
    text-align: center;
    padding: 1.5rem;
    font-size: 0.9rem;
    color: var(--secondary-color);
    border-top: 1px solid var(--card-border);
    margin-top: 2rem;
}

@media (max-width: 768px) {
    .app-header h1 {
        font-size: 2rem;
    }
    section {
        padding: 1.5rem;
    }
}
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// --- RENDER APP ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);