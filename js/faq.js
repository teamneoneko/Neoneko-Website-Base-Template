document.addEventListener('DOMContentLoaded', () => {
    const faqContainer = document.getElementById('faq-container');
    const loadingDiv = document.getElementById('loading');
    const errorContainer = document.getElementById('error-container');
    const searchInput = document.getElementById('faqSearch');
    const categoriesList = document.getElementById('categoriesList');

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
    
            return { 
                faqData: faqData.faqs, 
                categoriesData: categoriesData.categories 
            };
        } catch (error) {
            throw new Error('Failed to fetch FAQ data');
        }
    }

    // Render FAQ content with enhanced formatting
    function renderFAQ(faqData, categoriesData) {
        loadingDiv.style.display = 'none';
        faqContainer.innerHTML = '';
        
        // Render categories in sidebar
        categoriesData.forEach(category => {
            const categoryLink = document.createElement('a');
            categoryLink.href = `#${category.toLowerCase().replace(/\s+/g, '-')}`;
            categoryLink.textContent = category;
            categoriesList.appendChild(categoryLink);
        });
    
        // Render FAQ content by category
        categoriesData.forEach(category => {
            const categoryFAQs = faqData.filter(faq => faq.category === category);
            
            if (categoryFAQs.length > 0) {
                const section = document.createElement('section');
                section.id = category.toLowerCase().replace(/\s+/g, '-');
                
                const categoryTitle = document.createElement('h2');
                categoryTitle.textContent = category;
                section.appendChild(categoryTitle);
    
                categoryFAQs.forEach(faq => {
                    const faqItem = document.createElement('div');
                    faqItem.className = 'faq-item';
                    
                    const question = document.createElement('h3');
                    question.className = 'faq-question';
                    question.innerHTML = `${faq.question} <span class="toggle-icon">+</span>`;
                    
                    const answer = document.createElement('div');
                    answer.className = 'faq-content hidden'; // Added hidden class by default
                    answer.innerHTML = formatContent(faq.answer);
                    
                    question.addEventListener('click', () => {
                        const wasHidden = answer.classList.contains('hidden');
                        
                        // Close all other answers first
                        document.querySelectorAll('.faq-content').forEach(content => {
                            content.classList.add('hidden');
                            content.previousElementSibling.querySelector('.toggle-icon').textContent = '+';
                        });
                        
                        // Toggle current answer
                        if (wasHidden) {
                            answer.classList.remove('hidden');
                            question.querySelector('.toggle-icon').textContent = '-';
                        }
                    });
                    
                    faqItem.appendChild(question);
                    faqItem.appendChild(answer);
                    section.appendChild(faqItem);
                });
    
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
        const sections = document.querySelectorAll('.wiki-content section');
        
        sections.forEach(section => {
            const faqItems = section.querySelectorAll('.faq-item');
            let visibleItems = 0;
            
            faqItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                const isVisible = text.includes(searchTerm);
                item.style.display = isVisible ? 'block' : 'none';
                if (isVisible) visibleItems++;
            });
            
            // Hide the entire section if no items are visible
            section.style.display = visibleItems > 0 ? 'block' : 'none';
            
            // Hide/show the corresponding sidebar link
            const categoryId = section.id;
            const sidebarLink = document.querySelector(`.wiki-nav a[href="#${categoryId}"]`);
            if (sidebarLink) {
                sidebarLink.style.display = visibleItems > 0 ? 'block' : 'none';
            }
        });
    });   
});