// Article root directory (local — no external fetches)
const ARTICLES_DIR = 'articles';

// Published article IDs — add a new ID here whenever you publish a post
const ARTICLE_IDS = ['laser-am-radio', 'beauty-of-interstellar', 'am-radio', 'voltage-divider-explained'];

// Featured article IDs — shown in the "Featured Articles" section (subset of ARTICLE_IDS)
const FEATURED_ARTICLE_IDS = ['laser-am-radio', 'beauty-of-interstellar', 'am-radio'];

// Hidden articles — articles with `hidden: true` in frontmatter are hidden from the front page

// Global articles data
let allArticles = [];
let currentFilter = null;

// Parse YAML-like frontmatter and markdown content
function parseFrontmatter(markdown) {
    // Normalize line endings (\r\n and \r → \n) so the regex works cross-platform
    markdown = markdown.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    let content = markdown;
    let metadata = {};

    if (frontmatterMatch) {
        const frontmatter = frontmatterMatch[1];
        content = frontmatterMatch[2];

        frontmatter.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
                metadata[key.trim()] = valueParts.join(':').trim().replace(/^['"]|['"]$/g, '');
            }
        });
    }

    return { metadata, content };
}

// Parse a comma-separated tags string into an array
function parseTags(tagsStr) {
    if (!tagsStr) return [];
    return tagsStr.split(',').map(t => t.trim()).filter(t => t);
}

// Map a tag name to a difficulty-based CSS class
function getTagClass(tag) {
    switch (tag.toLowerCase()) {
        case 'easy':   return 'tag-easy';
        case 'intermediate': return 'tag-intermediate';
        case 'expert': return 'tag-expert';
        default:       return '';
    }
}

// Render tag spans — shows at most `limit` tags; the remaining hidden tags
// are collapsed into a "+X More" pill that links to the article page
function renderTags(tags, articleId, limit = 5) {
    if (!tags || tags.length === 0) return '';

    if (tags.length <= limit) {
        return tags.map(tag =>
            `<span class="tag ${getTagClass(tag)}" onclick="filterByTag('${tag}', event)">${tag}</span>`
        ).join('');
    }

    const visible = tags.slice(0, limit);
    const remaining = tags.length - limit;

    let html = visible.map(tag =>
        `<span class="tag ${getTagClass(tag)}" onclick="filterByTag('${tag}', event)">${tag}</span>`
    ).join('');

    html += `<span class="tag tag-more" onclick="window.location='article.html?id=${articleId}'">+${remaining} More</span>`;

    return html;
}

// Generate a basic excerpt from markdown content when no description is set
function generateExcerpt(content) {
    let text = content
        .replace(/^#.*$/gm, '')
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/`{3}[\s\S]*?`{3}/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/_([^_]+)_/g, '$1')
        .replace(/^\s*[-*+]\s+/gm, '')
        .replace(/\n{2,}/g, ' ')
        .trim();
    return text.substring(0, 160) + (text.length > 160 ? '...' : '');
}

// Load articles list on homepage (metadata parsed from markdown frontmatter)
async function loadArticles() {
    try {
        // Fetch each article's markdown to extract frontmatter metadata
        const articlesPromises = ARTICLE_IDS.map(async id => {
            try {
                const mdUrl = `${ARTICLES_DIR}/${id}/article.md`;
                const resp = await fetch(mdUrl);
                if (!resp.ok) throw new Error(`Could not load ${id}`);
                const markdown = await resp.text();

                const { metadata, content } = parseFrontmatter(markdown);
                const tags = parseTags(metadata.tags);
                const excerpt = metadata.description || generateExcerpt(content);

                return {
                    id,
                    title: metadata.title || id,
                    date: metadata.date || '',
                    excerpt: excerpt,
                    tags: tags,
                    image: metadata.image || '',
                    hidden: metadata.hidden || 'false'
                };
            } catch (error) {
                console.error(`Error loading article ${id}:`, error);
                return null;
            }
        });

        const articles = (await Promise.all(articlesPromises)).filter(a => a !== null);
        allArticles = articles;

        // Sort by date (newest first)
        const sorted = [...allArticles].sort((a, b) => new Date(b.date) - new Date(a.date));

        // Render featured articles (subset of all articles)
        const featured = sorted.filter(a => FEATURED_ARTICLE_IDS.includes(a.id));
        const featuredContainer = document.getElementById('featured-articles');
        if (featuredContainer) {
            // Filter out hidden articles
            const visibleFeatured = featured.filter(a => a.hidden !== 'true');

            if (visibleFeatured.length === 0) {
                featuredContainer.innerHTML = '<p style="text-align: center; color: #999; font-size: 1.1rem; padding: 2rem;">No articles yet; stay tuned!</p>';
            } else {
                featuredContainer.innerHTML = renderArticleCards(visibleFeatured);
            }
        }

        // Render all articles
        const allContainer = document.getElementById('all-articles-list');
        if (allContainer) {
            // Filter out hidden articles
            const visible = sorted.filter(a => a.hidden !== 'true');

            if (visible.length === 0) {
                allContainer.innerHTML = '<p style="text-align: center; color: #999; font-size: 1.1rem; padding: 2rem;">No articles yet; stay tuned!</p>';
            } else {
                allContainer.innerHTML = renderArticleCards(visible);
            }
        }
    } catch (error) {
        console.error('Error loading articles:', error);
        const featuredContainer = document.getElementById('featured-articles');
        if (featuredContainer) {
            featuredContainer.innerHTML = '<p style="text-align: center; color: #999;">Could not load articles. Try again later.</p>';
        }
        const allContainer = document.getElementById('all-articles-list');
        if (allContainer) {
            allContainer.innerHTML = '<p style="text-align: center; color: #999;">Could not load articles. Try again later.</p>';
        }
    }
}

// Generate HTML for article cards
function renderArticleCards(articles) {
    return articles.map(article => {
        const tagHtml = renderTags(article.tags, article.id);
        return `
            <article class="article-card" onclick="if(event.target.classList.contains('tag')) return; window.location='article.html?id=${article.id}'">
                <div class="article-card-header" ${article.image ? `style="--card-image: url('${article.image}')"` : ''}>
                    <h3>${article.title}</h3>
                    <p class="article-date">${formatDate(article.date)}</p>
                </div>
                <div class="article-card-body">
                    <p>${article.excerpt}</p>
                    <div class="article-card-tags">${tagHtml}</div>
                    <a href="article.html?id=${article.id}" class="read-more">Read More →</a>
                </div>
            </article>
        `;
    }).join('');
}

// Format date nicely
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Truncate text to a maximum character count, appending "..."
function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength).trim() + '...';
}

// Get all unique tags from articles
function getAllTags() {
    const tags = new Set();
    allArticles.forEach(article => {
        (article.tags || []).forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
}

// Filter by tag
function filterByTag(tag, event) {
    event.stopPropagation();
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = tag;
        performSearch(tag);
    }
}

// Perform search
function performSearch(query) {
    if (!query.trim()) {
        loadArticles();
        document.getElementById('search-results-dropdown').classList.remove('active');
        return;
    }

    const dropdown = document.getElementById('search-results-dropdown');
    const allTags = getAllTags();
    const lowerQuery = query.toLowerCase();
    
    let results = [];
    
    // Find matching tags
    const matchingTags = allTags.filter(tag => tag.toLowerCase().includes(lowerQuery));
    
    // Find articles with matching tags (prioritized)
    const tagMatchArticles = allArticles.filter(article => 
        article.hidden !== 'true' &&
        (article.tags || []).some(tag => tag.toLowerCase().includes(lowerQuery))
    );
    
    // Find articles with matching content
    const contentMatchArticles = allArticles.filter(article => 
        article.hidden !== 'true' &&
        !tagMatchArticles.includes(article) && (
            article.title.toLowerCase().includes(lowerQuery) ||
            article.excerpt.toLowerCase().includes(lowerQuery)
        )
    );
    
    // Build dropdown results
    let dropdownHTML = '';
    
    // Show available tags
    if (matchingTags.length > 0) {
        dropdownHTML += '<div class="search-result-item tag"><strong>Available Tags:</strong><br>';
        dropdownHTML += matchingTags.map(tag => 
            `<span class="search-result-item tag-badge ${getTagClass(tag)}" onclick="filterByTag('${tag}', event)">${tag}</span>`
        ).join('');
        dropdownHTML += '</div>';
    }
    
    // Show tag-matched articles
    if (tagMatchArticles.length > 0) {
        dropdownHTML += '<div style="padding: 0.5rem 1rem; color: #7f8c8d; font-size: 0.85rem; font-weight: bold;">Articles with matching tags:</div>';
        tagMatchArticles.forEach(article => {
            dropdownHTML += `<div class="search-result-item" onclick="window.location='article.html?id=${article.id}'">
                <div class="search-result-title">${article.title}</div>
                <div class="search-result-subtitle">${formatDate(article.date)}</div>
            </div>`;
        });
    }
    
    // Show content-matched articles
    if (contentMatchArticles.length > 0) {
        dropdownHTML += '<div style="padding: 0.5rem 1rem; color: #7f8c8d; font-size: 0.85rem; font-weight: bold;">Articles with matching content:</div>';
        contentMatchArticles.forEach(article => {
            dropdownHTML += `<div class="search-result-item" onclick="window.location='article.html?id=${article.id}'">
                <div class="search-result-title">${article.title}</div>
                <div class="search-result-subtitle">${article.excerpt.substring(0, 80)}...</div>
            </div>`;
        });
    }
    
    if (dropdownHTML === '') {
        dropdownHTML = '<div class="search-result-item">No results found</div>';
    }
    
    dropdown.innerHTML = dropdownHTML;
    dropdown.classList.add('active');
}

// Load individual article
async function loadArticle() {
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');
    
    if (!articleId) {
        window.location = 'index.html';
        return;
    }
    
    try {
        const rawUrl = `${ARTICLES_DIR}/${articleId}/article.md`;
        const response = await fetch(rawUrl);
        if (!response.ok) throw new Error('Article not found');

        const markdown = await response.text();
        const contentDiv = document.getElementById('article-content');

        if (!contentDiv) {
            console.error('Content div not found');
            return;
        }

        const { metadata, content } = parseFrontmatter(markdown);

        // Set page title and header
        if (metadata.title) {
            document.title = metadata.title + ' - Electronics Lab';
            const titleEl = document.getElementById('article-title');
            if (titleEl) titleEl.textContent = metadata.title;
        }

        if (metadata.date) {
            const dateEl = document.getElementById('article-date');
            if (dateEl) dateEl.textContent = formatDate(metadata.date);
        }

        if (metadata.author) {
            const authorEl = document.getElementById('article-author');
            const bulletEl = document.getElementById('article-author-bullet');
            if (authorEl) authorEl.textContent = metadata.author;
            if (bulletEl) bulletEl.style.display = 'inline';
        }

        // Parse and display tags
        if (metadata.tags) {
            const tags = parseTags(metadata.tags);
            const tagsEl = document.getElementById('article-tags');
            if (tagsEl && tags.length > 0) {
                tagsEl.innerHTML = renderTags(tags, articleId, tags.length);
            }
        }

        // Prefer an article cover video, with the image retained as its poster fallback.
        if (metadata.video) {
            const videoEl = document.getElementById('article-video');
            if (videoEl) {
                videoEl.src = metadata.video;
                videoEl.poster = metadata.image || '';
                videoEl.setAttribute('aria-label', metadata.title || 'Article cover video');
                videoEl.classList.add('visible');
                videoEl.load();
            }
        } else if (metadata.image) {
            const imgEl = document.getElementById('article-image');
            if (imgEl) {
                imgEl.src = metadata.image;
                imgEl.alt = metadata.title || 'Article image';
                imgEl.classList.add('visible');
            }
        }
        
        // Convert markdown to HTML
        let htmlContent = marked.parse(content);

        // Post-process: convert GitHub-style alert blockquotes to notice elements
        // Syntax: > [!NOTE], > [!TIP], > [!WARNING], > [!INFO], etc.
        const alertTypes = 'NOTE|TIP|WARNING|DANGER|INFO|CAUTION|IMPORTANT|REMEMBER';

        // Case 1: separate paragraph — <p>[!TYPE]</p> followed by content
        htmlContent = htmlContent.replace(
            new RegExp('<blockquote>\\s*<p>\\[!(' + alertTypes + ')\\]</p>([\\s\\S]*?)</blockquote>', 'gi'),
            (match, type, body) =>
                `<blockquote class="notice notice-${type.toLowerCase()}">${body.replace(/<br\s*\/?>/gi, '\n')}</blockquote>`
        );

        // Case 2: same paragraph — <p>[!TYPE]<br>Text</p> or <p>[!TYPE]\nText</p>
        htmlContent = htmlContent.replace(
            new RegExp('<blockquote>\\s*<p>\\[!(' + alertTypes + ')\\]\\s*(?:<br\\s*\\/?>\\s*)?([\\s\\S]*?)</p>([\\s\\S]*?)</blockquote>', 'gi'),
            (match, type, firstP, rest) => {
                let content = firstP.replace(/<br\s*\/?>/gi, '\n').trim();
                let body = content ? content : '';
                if (rest) {
                    body += rest.replace(/<br\s*\/?>/gi, '\n');
                }
                return `<blockquote class="notice notice-${type.toLowerCase()}">${body.trim()}</blockquote>`;
            }
        );

        // Case 3: multi-line blockquote with [!TYPE] and content separated by <br>
        htmlContent = htmlContent.replace(
            new RegExp('<blockquote>\\s*<p>\\[!(' + alertTypes + ')\\]<br\\s*\\/?>([\\s\\S]*?)</p>\\s*</blockquote>', 'gi'),
            (match, type, body) => {
                return `<blockquote class="notice notice-${type.toLowerCase()}">${body.replace(/<br\s*\/?>/gi, '\n').trim()}</blockquote>`;
            }
        );

        // Convert newlines inside notice blockquotes to <br> for proper rendering
        htmlContent = htmlContent.replace(
            /<blockquote class="notice[^"]*">([\s\S]*?)<\/blockquote>/gi,
            (match, body) => {
                return match.replace(body, body.replace(/\n/g, '<br>'));
            }
        );

        contentDiv.innerHTML = htmlContent;
        initializeArticleImageZoom(contentDiv);
        initializeVideoGain(document);
        
        // Render LaTeX with MathJax
        setTimeout(() => {
            if (window.MathJax && window.MathJax.typesetPromise) {
                window.MathJax.typesetPromise([contentDiv]).catch(err => console.log('MathJax render error:', err));
            }
        }, 100);
        
    } catch (error) {
        console.error('Error loading article:', error);
        const contentDiv = document.getElementById('article-content');
        if (contentDiv) {
            contentDiv.innerHTML = '<p>Error loading article. <a href="index.html">Return to home</a></p>';
        }
    }
}

function initializeVideoGain(root) {
    root.querySelectorAll('video[data-audio-gain]').forEach(video => {
        if (video.dataset.gainReady) return;
        video.dataset.gainReady = 'true';

        video.addEventListener('play', () => {
            if (!video._gainContext) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (!AudioContext) return;
                const context = new AudioContext();
                const source = context.createMediaElementSource(video);
                const gain = context.createGain();
                gain.gain.value = Number(video.dataset.audioGain) || 2;
                source.connect(gain).connect(context.destination);
                video._gainContext = context;
            }
            if (video._gainContext.state === 'suspended') video._gainContext.resume();
        });
    });
}

// Add a cursor-following magnifier to marked article images.
function initializeArticleImageZoom(root) {
    if (!root || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    root.querySelectorAll('.article-image-zoom').forEach(zoom => {
        const image = zoom.querySelector('img');
        const zoomImage = zoom.dataset.zoomImage || (image && image.src);
        if (!image || !zoomImage) return;

        const lens = document.createElement('div');
        lens.className = 'article-zoom-lens';
        lens.style.backgroundImage = `url("${zoomImage}")`;
        zoom.appendChild(lens);

        zoom.addEventListener('mouseenter', () => {
            zoom.classList.add('is-zooming');
        });

        zoom.addEventListener('mousemove', event => {
            const rect = image.getBoundingClientRect();
            const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
            const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height));
            const lensWidth = lens.offsetWidth;
            const lensHeight = lens.offsetHeight;

            lens.style.left = `${Math.max(0, Math.min(x - lensWidth / 2, rect.width - lensWidth))}px`;
            lens.style.top = `${Math.max(0, Math.min(y - lensHeight / 2, rect.height - lensHeight))}px`;
            lens.style.backgroundSize = `${rect.width * 2.75}px ${rect.height * 2.75}px`;
            lens.style.backgroundPosition = `${(x / rect.width) * 100}% ${(y / rect.height) * 100}%`;
        });

        zoom.addEventListener('mouseleave', () => {
            zoom.classList.remove('is-zooming');
        });
    });
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchDropdown = document.getElementById('search-results-dropdown');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchDropdown.classList.remove('active');
        }
    });
    
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim()) {
            searchDropdown.classList.add('active');
        } else {
            searchDropdown.classList.remove('active');
        }
    });
}

// Initialize tools dropdown
function initializeToolsDropdown() {
    const toggle = document.querySelector('.tools-toggle');
    const dropdown = document.querySelector('.tools-dropdown');

    if (!toggle || !dropdown) return;

    toggle.addEventListener('click', function(e) {
        e.preventDefault();
        dropdown.classList.toggle('open');
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.tools-dropdown')) {
            dropdown.classList.remove('open');
        }
    });
}

// Load shared header and footer partials
async function loadPartials() {
    const headerPlaceholder = document.getElementById('site-header-placeholder');
    const footerPlaceholder = document.getElementById('site-footer-placeholder');

    const fetches = [];

    if (headerPlaceholder) {
        fetches.push(
            fetch('_header.html')
                .then(r => r.ok ? r.text() : Promise.reject('Could not load header'))
                .then(html => { headerPlaceholder.innerHTML = html; })
        );
    }

    if (footerPlaceholder) {
        fetches.push(
            fetch('_footer.html')
                .then(r => r.ok ? r.text() : Promise.reject('Could not load footer'))
                .then(html => { footerPlaceholder.innerHTML = html; })
        );
    }

    await Promise.all(fetches);

    // Initialize nav components once the header is in the DOM
    initializeSearch();
    initializeToolsDropdown();
    setActiveNav();
}

// Set the active nav link based on current page
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize based on page
document.addEventListener('DOMContentLoaded', function() {
    loadPartials().then(() => {
        if (window.location.pathname.includes('article.html')) {
            loadArticle();
        } else {
            loadArticles();
        }
    }).catch(err => {
        console.error('Error loading page partials:', err);
    });
});
