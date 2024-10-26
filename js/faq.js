document.addEventListener('DOMContentLoaded', () => {
    const faqContainer = document.getElementById('faq-container');
    const loadingDiv = document.getElementById('loading');
    const errorContainer = document.getElementById('error-container');
    const searchInput = document.getElementById('faqSearch');
    const categoriesList = document.getElementById('categoriesList');

    // Enhanced fetch with better error handling
    async function fetchFAQData() {
        try {
            const [faqResponse, categoriesResponse] = await Promise.all([
                fetch('./data/faq.json'),
                fetch('./data/categories.json')
            ]);

            if (!faqResponse.ok || !categoriesResponse.ok) {
                throw new Error('Network response was not ok');
            }

            const faqData = await faqResponse.json();
            const categoriesData = await categoriesResponse.json();

            return { faqData, categoriesData };
        } catch (error) {
            throw new Error('Failed to fetch FAQ data');
        }
    }

    // Render FAQ content with enhanced formatting
    function renderFAQ(faqData, categoriesData) {
        loadingDiv.style.display = 'none';
        
        // Ensure we're working with arrays
        const categories = Array.isArray(categoriesData) ? categoriesData : [];
        const faqs = Array.isArray(faqData) ? faqData : [];
        
        // Render categories in sidebar
        categories.forEach(category => {
            const categoryLink = document.createElement('a');
            categoryLink.href = `#${category.toLowerCase().replace(/\s+/g, '-')}`;
            categoryLink.textContent = category;
            categoriesList.appendChild(categoryLink);
        });

        // Render FAQ content
        categories.forEach(category => {
            const categoryFAQs = faqs.filter(faq => faq.category === category);
            if (categoryFAQs.length > 0) {
                const section = document.createElement('section');
                section.id = category.toLowerCase().replace(/\s+/g, '-');
                section.innerHTML = `
                    <h2>${category}</h2>
                    ${categoryFAQs.map(faq => `
                        <div class="faq-item">
                            <h3>${faq.question}</h3>
                            <div class="faq-content">
                                ${formatContent(faq.answer)}
                            </div>
                        </div>
                    `).join('')}
                `;
                faqContainer.appendChild(section);
            }
        });
    }

    // Format content with support for markdown-like syntax
    function formatContent(content) {
        return content
            .replace(/\[image\](.*?)\[\/image\]/g, '<img src="$1" alt="FAQ Image">')
            .replace(/\[link\](.*?)\|(.*?)\[\/link\]/g, '<a href="$1">$2</a>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
    }

    // Initialize
    fetchFAQData()
        .then(({ faqData, categoriesData }) => {
            console.log('Data received:', { faqData, categoriesData });
            renderFAQ(faqData, categoriesData);
        })
        .catch(error => {
            loadingDiv.style.display = 'none';
            errorContainer.style.display = 'block';
            errorContainer.querySelector('#errorMessage').textContent = error.message;
        });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    });
});
