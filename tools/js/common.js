// Common JavaScript functions for AIVOROPRO

// Load header and footer dynamically
function loadHeader() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            initializeHeader();
        })
        .catch(error => console.error('Error loading header:', error));
}

function loadFooter() {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
}

// Initialize header functionality
function initializeHeader() {
    // Search functionality
    const searchInput = document.getElementById('headerSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm.length > 0 && window.location.pathname.includes('index.html')) {
                filterTools(searchTerm);
            }
        });
    }
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (themeIcon) {
        themeIcon.className = currentTheme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            if (themeIcon) {
                themeIcon.className = newTheme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill';
            }
        });
    }
}

// Filter tools on index page
function filterTools(searchTerm) {
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
            card.parentElement.style.display = 'block';
        } else {
            card.style.display = 'none';
            // Hide parent column if all cards in section are hidden
            const section = card.closest('.tools-section');
            if (section) {
                const visibleCards = section.querySelectorAll('.tool-card[style*="display: block"], .tool-card:not([style*="display: none"])');
                if (visibleCards.length === 0) {
                    section.style.display = 'none';
                } else {
                    section.style.display = 'block';
                }
            }
        }
    });
}

// FAQ Accordion functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all FAQ items
                faqItems.forEach(faqItem => {
                    faqItem.classList.remove('active');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

// File upload functionality for tool pages
function initFileUpload(uploadArea, fileInput, previewArea, previewImage, processCallback) {
    if (!uploadArea || !fileInput) return;
    
    // Click to upload
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0], fileInput, previewArea, previewImage, processCallback);
        }
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileSelect(e.target.files[0], fileInput, previewArea, previewImage, processCallback);
        }
    });
}

function handleFileSelect(file, fileInput, previewArea, previewImage, processCallback) {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff', 'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/x-matroska', 'video/x-flv', 'video/webm', 'audio/mpeg', 'audio/wav', 'audio/aac', 'audio/flac', 'audio/mp4', 'audio/ogg', 'audio/x-ms-wma'];
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|gif|webp|bmp|tiff|heic|mp4|mov|avi|wmv|mkv|flv|webm|mp3|wav|aac|flac|m4a|ogg|wma|alac|aiff|eps|ai|svg|cgm|wmf|emf|pdf|dxf|cdr)$/i)) {
        alert('Please select a valid image, video, or audio file.');
        return;
    }
    
    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
        alert('File size must be less than 100MB.');
        return;
    }
    
    // Show preview
    if (previewArea && previewImage) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
                previewArea.classList.add('active');
            };
            reader.readAsDataURL(file);
        } else {
            previewArea.classList.add('active');
            previewImage.style.display = 'none';
        }
    }
    
    // Store file for processing
    if (processCallback) {
        processCallback(file);
    }
}

// Process file (generic function - to be customized per tool)
function processFile(file, outputFormat, processCallback) {
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    const processBtn = document.querySelector('.btn-process');
    
    if (progressBar) progressBar.classList.add('active');
    if (processBtn) processBtn.disabled = true;
    
    // Simulate processing (replace with actual processing logic)
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        if (progressFill) {
            progressFill.style.width = progress + '%';
            progressFill.textContent = progress + '%';
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            if (processCallback) {
                processCallback(file, outputFormat);
            }
            if (progressBar) progressBar.classList.remove('active');
            if (processBtn) processBtn.disabled = false;
        }
    }, 200);
}

// Download file
function downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load header and footer if placeholders exist
    if (document.getElementById('header-placeholder')) {
        loadHeader();
    }
    if (document.getElementById('footer-placeholder')) {
        loadFooter();
    }
    
    // Initialize theme toggle
    initThemeToggle();
    
    // Initialize FAQ
    initFAQ();
    
    // Re-initialize theme toggle after header loads (in case it loads async)
    setTimeout(initThemeToggle, 500);
});

