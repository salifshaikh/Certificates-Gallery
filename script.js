document.addEventListener('DOMContentLoaded', function() {
    // Get all DOM elements we need
    const certificateFrames = document.querySelectorAll('.certificate-frame');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const modal = document.querySelector('.modal');
    const modalContent = document.querySelector('.modal-content');
    const modalTitle = document.getElementById('modal-title');
    const closeModalBtn = document.getElementById('close-modal');
    const downloadBtn = document.getElementById('download-btn');
    
    // Apply intersection observer for scroll animations
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    certificateFrames.forEach(frame => {
        observer.observe(frame);
    });
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the filter value
            const filter = this.getAttribute('data-filter');
            
            // Filter the certificates
            certificateFrames.forEach(frame => {
                if (filter === 'all') {
                    frame.classList.remove('hidden');
                } else if (frame.getAttribute('data-category') === filter) {
                    frame.classList.remove('hidden');
                } else {
                    frame.classList.add('hidden');
                }
            });
        });
    });
    
    // Modal functionality for certificate viewing
    certificateFrames.forEach(frame => {
        const certificateContent = frame.querySelector('.certificate-content');
        const certificateTitle = frame.querySelector('.certificate-info h3').textContent;
        
        certificateContent.addEventListener('click', function() {
            const isPDF = this.classList.contains('pdf-content');
            let contentSrc;
            
            if (isPDF) {
                contentSrc = this.querySelector('iframe').getAttribute('src');
                // Create new iframe for modal to ensure it loads properly
                modalContent.innerHTML = `<iframe src="${contentSrc}"></iframe>`;
            } else {
                contentSrc = this.querySelector('img').getAttribute('src');
                modalContent.innerHTML = `<img src="${contentSrc}" alt="${certificateTitle}">`;
            }
            
            // Set download link and title
            downloadBtn.setAttribute('data-src', contentSrc);
            modalTitle.textContent = certificateTitle;
            
            // Show modal with animation
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
    });
    
    // Close modal when clicking close button
    closeModalBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Re-enable scrolling
    });
    
    // Close modal when clicking outside of content
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Re-enable scrolling
        }
    });
    
    // Download functionality
    downloadBtn.addEventListener('click', function() {
        const source = this.getAttribute('data-src');
        
        // Create an anchor element for downloading
        const a = document.createElement('a');
        a.href = source;
        a.download = modalTitle.textContent.replace(/\s+/g, '-').toLowerCase() + 
                    (source.endsWith('.pdf') ? '.pdf' : '.jpg');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
    
    // Add keyboard support (ESC to close)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Re-enable scrolling
        }
    });
    
    // Add hover effect for better interaction feedback
    certificateFrames.forEach(frame => {
        frame.addEventListener('mouseenter', function() {
            this.querySelector('.certificate-content').style.transform = 'scale(1.02)';
        });
        
        frame.addEventListener('mouseleave', function() {
            this.querySelector('.certificate-content').style.transform = 'scale(1)';
        });
    });
});